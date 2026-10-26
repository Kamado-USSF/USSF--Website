import React, { useState } from 'react';
import { 
  Users, MessageSquare, Plus, Lock, Shield, Send, Check, 
  UserPlus, UserCheck, AlertCircle, Clock, Hash, ChevronRight, X
} from 'lucide-react';
import { USSFMember, SquadGroupChat, SquadGroupMember, SquadGroupRequest, SquadGroupMessage } from '../data/ussfData';
import { tacticalAudio } from '../utils/audioSynth';

interface PersonalGroupChatProps {
  currentUser: USSFMember | null;
  members: USSFMember[];
  groups: SquadGroupChat[];
  onUpdateGroups: (groups: SquadGroupChat[]) => void;
  onOpenAuth: () => void;
}

export const PersonalGroupChat: React.FC<PersonalGroupChatProps> = ({
  currentUser,
  members,
  groups,
  onUpdateGroups,
  onOpenAuth
}) => {
  const [selectedGroupId, setSelectedGroupId] = useState<string>(groups[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'chat' | 'discover'>('chat');
  const [newMessageText, setNewMessageText] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  // New Group Form
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupTag, setNewGroupTag] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  // Selected Group
  const activeGroup = groups.find(g => g.id === selectedGroupId) || groups[0];

  // Check if current user is a member of the active group
  const userMembership = currentUser
    ? activeGroup?.members.find(m => m.cid === currentUser.cid)
    : null;

  const isUserMember = !!userMembership;
  const isUserLeader = userMembership?.role === 'LEADER';

  // Strict Rule: If user joined by request/invite, they ONLY see messages timestamped AFTER their joinedAt!
  const visibleMessages = activeGroup && userMembership
    ? activeGroup.messages.filter(msg => {
        // Parse timestamps safely
        const msgTime = new Date(msg.timestamp).getTime();
        const joinTime = new Date(userMembership.joinedAt).getTime();
        // If valid dates, compare; otherwise if user is creator/leader or message was sent during membership, show it
        if (!isNaN(msgTime) && !isNaN(joinTime)) {
          return msgTime >= joinTime - 60000; // allow 1 minute leeway for clock skew
        }
        return true;
      })
    : [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || !currentUser || !activeGroup || !isUserMember) return;

    tacticalAudio.playRadioSquelch();

    const nowIso = new Date().toISOString();
    const newMsg: SquadGroupMessage = {
      id: `msg-${Date.now()}`,
      senderCid: currentUser.cid,
      senderName: currentUser.name,
      senderRank: currentUser.rank,
      senderAvatar: currentUser.avatarUrl || '/src/assets/images/military_leader_training_1790341999734.jpg',
      content: newMessageText.trim(),
      timestamp: nowIso
    };

    const updatedGroups = groups.map(g => {
      if (g.id === activeGroup.id) {
        return {
          ...g,
          messages: [...g.messages, newMsg]
        };
      }
      return g;
    });

    onUpdateGroups(updatedGroups);
    setNewMessageText('');
  };

  const handleCreateGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupName.trim() || !currentUser) return;

    tacticalAudio.playTargetLock();

    const nowIso = new Date().toISOString();
    const newSquad: SquadGroupChat = {
      id: `squad-${Date.now()}`,
      name: newGroupName.trim(),
      tag: newGroupTag.trim().startsWith('#') ? newGroupTag.trim() : `#${newGroupTag.trim().toUpperCase() || 'SQUAD'}`,
      description: newGroupDesc.trim() || 'Private squad tactical comms channel.',
      creatorCid: currentUser.cid,
      creatorName: currentUser.name,
      createdAt: nowIso,
      isPrivate: true,
      members: [
        {
          cid: currentUser.cid,
          name: currentUser.name,
          rank: currentUser.rank,
          avatarUrl: currentUser.avatarUrl || '/src/assets/images/military_leader_training_1790341999734.jpg',
          joinedAt: nowIso,
          role: 'LEADER'
        }
      ],
      pendingRequests: [],
      messages: [
        {
          id: `msg-welcome-${Date.now()}`,
          senderCid: currentUser.cid,
          senderName: currentUser.name,
          senderRank: currentUser.rank,
          senderAvatar: currentUser.avatarUrl || '/src/assets/images/military_leader_training_1790341999734.jpg',
          content: `Squad channel established by ${currentUser.name}. New members will only see messages from the moment they join.`,
          timestamp: nowIso
        }
      ]
    };

    onUpdateGroups([newSquad, ...groups]);
    setSelectedGroupId(newSquad.id);
    setIsCreateModalOpen(false);
    setNewGroupName('');
    setNewGroupTag('');
    setNewGroupDesc('');
  };

  const handleRequestToJoin = (group: SquadGroupChat) => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    tacticalAudio.playTacticalClick();

    const request: SquadGroupRequest = {
      cid: currentUser.cid,
      name: currentUser.name,
      rank: currentUser.rank,
      avatarUrl: currentUser.avatarUrl || '/src/assets/images/military_leader_training_1790341999734.jpg',
      requestedAt: new Date().toISOString()
    };

    const updated = groups.map(g => {
      if (g.id === group.id) {
        if (g.pendingRequests.some(r => r.cid === currentUser.cid)) return g;
        return {
          ...g,
          pendingRequests: [...g.pendingRequests, request]
        };
      }
      return g;
    });

    onUpdateGroups(updated);
  };

  const handleApproveRequest = (requestCid: string) => {
    if (!currentUser || !activeGroup) return;

    tacticalAudio.playTargetLock();
    const req = activeGroup.pendingRequests.find(r => r.cid === requestCid);
    if (!req) return;

    const joinTimeIso = new Date().toISOString();
    const newMember: SquadGroupMember = {
      cid: req.cid,
      name: req.name,
      rank: req.rank,
      avatarUrl: req.avatarUrl,
      joinedAt: joinTimeIso, // Recorded exact moment of joining!
      role: 'OPERATOR'
    };

    const updated = groups.map(g => {
      if (g.id === activeGroup.id) {
        return {
          ...g,
          members: [...g.members, newMember],
          pendingRequests: g.pendingRequests.filter(r => r.cid !== requestCid),
          messages: [
            ...g.messages,
            {
              id: `msg-join-${Date.now()}`,
              senderCid: 'SYSTEM',
              senderName: 'SQUAD DISPATCH',
              senderRank: 'COMMAND',
              senderAvatar: '/src/assets/images/special_forces_unit_1790346782492.jpg',
              content: `Operator ${req.name} was approved into ${g.name}. Message history prior to this timestamp is isolated.`,
              timestamp: joinTimeIso
            }
          ]
        };
      }
      return g;
    });

    onUpdateGroups(updated);
  };

  const handleInviteOperator = (targetMember: USSFMember) => {
    if (!activeGroup) return;
    tacticalAudio.playTacticalClick();

    const joinTimeIso = new Date().toISOString();
    const newMember: SquadGroupMember = {
      cid: targetMember.cid,
      name: targetMember.name,
      rank: targetMember.rank,
      avatarUrl: targetMember.avatarUrl || '/src/assets/images/military_leader_training_1790341999734.jpg',
      joinedAt: joinTimeIso, // Only see messages AFTER this moment!
      role: 'OPERATOR'
    };

    const updated = groups.map(g => {
      if (g.id === activeGroup.id) {
        if (g.members.some(m => m.cid === targetMember.cid)) return g;
        return {
          ...g,
          members: [...g.members, newMember],
          messages: [
            ...g.messages,
            {
              id: `msg-invite-${Date.now()}`,
              senderCid: 'SYSTEM',
              senderName: 'SQUAD DISPATCH',
              senderRank: 'COMMAND',
              senderAvatar: '/src/assets/images/special_forces_unit_1790346782492.jpg',
              content: `${targetMember.name} has joined the squad by invitation.`,
              timestamp: joinTimeIso
            }
          ]
        };
      }
      return g;
    });

    onUpdateGroups(updated);
    setIsInviteModalOpen(false);
  };

  return (
    <div className="w-full bg-[#080a08] text-neutral-100 min-h-screen pb-16 font-sans">
      {/* Banner */}
      <div className="border-b border-neutral-800 bg-[#0d100d] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-data uppercase tracking-widest text-cyan-400 mb-1">
              <Users className="h-4 w-4" />
              <span>SQUAD COMMS // PRIVATE GROUP CHATROOMS</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-tactical uppercase text-white">
              PERSONAL SQUAD GROUPS
            </h1>
            <p className="text-xs text-neutral-400 font-sans mt-1">
              Members can form private squads with isolated message histories. Non-members cannot see internal comms, and new members only see messages sent after they join.
            </p>
          </div>

          <button
            onClick={() => {
              if (!currentUser) onOpenAuth();
              else setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-tactical font-black text-xs uppercase shadow-xl transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="h-4 w-4" />
            <span>CREATE SQUAD GROUP</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Squad Groups List (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-2 text-xs font-data">
                <span className="text-amber-400 font-bold uppercase tracking-wider">
                  TACTICAL SQUADS ({groups.length})
                </span>
                <span className="text-neutral-500">AES-256 ISOLATED</span>
              </div>

              {/* Group Cards List */}
              <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
                {groups.map(group => {
                  const isMember = currentUser && group.members.some(m => m.cid === currentUser.cid);
                  const isSelected = selectedGroupId === group.id;

                  return (
                    <div
                      key={group.id}
                      onClick={() => {
                        tacticalAudio.playTacticalClick();
                        setSelectedGroupId(group.id);
                      }}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 ${
                        isSelected
                          ? 'border-amber-500 bg-neutral-800/90 shadow-md'
                          : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700 hover:bg-neutral-900/50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-tactical font-bold text-white text-sm">
                              {group.name}
                            </span>
                            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-500/40 px-1.5 py-0.2 rounded font-bold">
                              {group.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 font-sans mt-0.5 line-clamp-1">
                            {group.description}
                          </p>
                        </div>

                        {isMember ? (
                          <span className="px-2 py-0.5 rounded text-[9px] font-data font-bold bg-emerald-950 text-emerald-300 border border-emerald-500/50 shrink-0">
                            MEMBER
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[9px] font-data font-bold bg-neutral-900 text-neutral-500 border border-neutral-700 shrink-0 flex items-center gap-1">
                            <Lock className="h-2.5 w-2.5" />
                            <span>PRIVATE</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-[10px] font-data text-neutral-500 pt-1 border-t border-neutral-800/60">
                        <span>{group.members.length} Operators</span>
                        <span>Lead: {group.creatorName}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Chat Room or Restricted Lock Screen (8 Cols) */}
          <div className="lg:col-span-8">
            {activeGroup && (
              <div className="rounded-2xl border border-neutral-800 bg-[#0a0d0a] overflow-hidden shadow-2xl flex flex-col h-[640px]">
                {/* Chatroom Header */}
                <div className="p-4 border-b border-neutral-800 bg-neutral-950/90 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-400 font-tactical font-black text-lg">
                      {activeGroup.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="font-tactical font-black text-base text-white">
                          {activeGroup.name}
                        </h2>
                        <span className="text-xs font-mono text-cyan-400">
                          {activeGroup.tag}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 font-sans">
                        {activeGroup.description}
                      </p>
                    </div>
                  </div>

                  {/* Leader Controls (Invite, Pending Requests) */}
                  {isUserLeader && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsInviteModalOpen(true)}
                        className="px-3 py-1.5 rounded-lg border border-amber-500/50 bg-amber-500/10 hover:bg-amber-500 hover:text-neutral-950 text-amber-400 text-xs font-data font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        <span>Invite Member</span>
                      </button>

                      {activeGroup.pendingRequests.length > 0 && (
                        <span className="px-2.5 py-1 rounded bg-rose-950 text-rose-300 border border-rose-500/60 text-xs font-data font-bold flex items-center gap-1 animate-pulse">
                          <span>{activeGroup.pendingRequests.length} Pending</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Pending Join Requests Bar for Leader */}
                {isUserLeader && activeGroup.pendingRequests.length > 0 && (
                  <div className="bg-amber-950/40 border-b border-amber-500/40 p-3 text-xs font-data flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-amber-300">
                      <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
                      <span>Operators requesting ingress into this squad:</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {activeGroup.pendingRequests.map(req => (
                        <div key={req.cid} className="flex items-center gap-2 bg-black/80 px-2.5 py-1 rounded border border-neutral-700">
                          <span className="text-white font-bold">{req.name} ({req.rank})</span>
                          <button
                            onClick={() => handleApproveRequest(req.cid)}
                            className="px-2 py-0.5 rounded bg-emerald-500 text-neutral-950 font-bold text-[10px] hover:bg-emerald-400 cursor-pointer"
                          >
                            Approve
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Main Body: If Member -> Chat Messages; If Not Member -> Restricted Lock Screen */}
                {isUserMember ? (
                  <>
                    {/* Information Banner regarding isolated history */}
                    <div className="bg-neutral-950/60 border-b border-neutral-800/80 px-4 py-2 text-[10px] font-data text-neutral-400 flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-emerald-400">
                        <Check className="h-3 w-3" />
                        <span>ISOLATED OPERATOR SESSION // YOU ONLY SEE MESSAGES POSTED AFTER JOINING ({new Date(userMembership.joinedAt).toLocaleTimeString()})</span>
                      </span>
                      <span>ACTIVE MEMBERS: {activeGroup.members.length}</span>
                    </div>

                    {/* Messages Flow */}
                    <div className="flex-1 p-4 overflow-y-auto space-y-3">
                      {visibleMessages.length === 0 ? (
                        <div className="text-center py-16 text-xs font-data text-neutral-500 space-y-2">
                          <MessageSquare className="h-8 w-8 text-neutral-600 mx-auto" />
                          <p>No new messages since you joined this squad.</p>
                          <p className="text-[10px] text-neutral-600">Transmit the first communication below.</p>
                        </div>
                      ) : (
                        visibleMessages.map(msg => {
                          const isMe = currentUser && msg.senderCid === currentUser.cid;
                          const isSystem = msg.senderCid === 'SYSTEM';

                          if (isSystem) {
                            return (
                              <div key={msg.id} className="text-center my-2">
                                <span className="inline-block px-3 py-1 rounded-full bg-neutral-950 border border-neutral-800 text-[10px] font-data text-amber-400">
                                  ⚡ {msg.content}
                                </span>
                              </div>
                            );
                          }

                          return (
                            <div
                              key={msg.id}
                              className={`flex items-start gap-3 ${isMe ? 'flex-row-reverse' : ''}`}
                            >
                              <img
                                src={msg.senderAvatar}
                                alt={msg.senderName}
                                className="h-8 w-8 rounded-full object-cover border border-neutral-700 shrink-0 mt-0.5"
                              />

                              <div className={`max-w-[75%] rounded-2xl p-3 text-xs font-sans space-y-1 ${
                                isMe 
                                  ? 'bg-amber-500/20 border border-amber-500/50 text-neutral-100 rounded-tr-none'
                                  : 'bg-neutral-900 border border-neutral-800 text-neutral-200 rounded-tl-none'
                              }`}>
                                <div className="flex items-center gap-2 text-[10px] font-data text-neutral-400">
                                  <span className="font-bold text-amber-300 font-tactical">{msg.senderName}</span>
                                  <span>· {msg.senderRank}</span>
                                  <span className="text-neutral-500 ml-auto">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <div className="text-xs leading-relaxed break-words">
                                  {msg.content}
                                </div>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    {/* Chat Input */}
                    <form onSubmit={handleSendMessage} className="p-3 border-t border-neutral-800 bg-neutral-950/80 flex items-center gap-2">
                      <input
                        type="text"
                        value={newMessageText}
                        onChange={(e) => setNewMessageText(e.target.value)}
                        placeholder={`Transmit tactical squad message to ${activeGroup.name}...`}
                        className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-neutral-100 placeholder:text-neutral-500 font-sans focus:outline-none focus:border-amber-500"
                      />
                      <button
                        type="submit"
                        disabled={!newMessageText.trim()}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-tactical font-black text-xs uppercase transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">TRANSMIT</span>
                      </button>
                    </form>
                  </>
                ) : (
                  /* Restricted Access Lock Screen */
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                    <div className="h-16 w-16 rounded-2xl bg-neutral-900 border-2 border-neutral-800 flex items-center justify-center text-neutral-500">
                      <Lock className="h-8 w-8 text-amber-500 animate-pulse" />
                    </div>

                    <div className="max-w-md space-y-1">
                      <h3 className="text-lg font-tactical font-black uppercase text-white">
                        CONFIDENTIAL SQUAD ACCESS RESTRICTED
                      </h3>
                      <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                        This is a private special forces squad. Non-members cannot view any squad communications or past messages. Request admission below to receive high command clearance.
                      </p>
                    </div>

                    {currentUser ? (
                      activeGroup.pendingRequests.some(r => r.cid === currentUser.cid) ? (
                        <div className="p-3 rounded-lg bg-amber-950/60 border border-amber-500/60 text-amber-300 text-xs font-data flex items-center gap-2">
                          <Clock className="h-4 w-4 text-amber-400 shrink-0" />
                          <span>Join request pending squad leader review. You will receive access once approved.</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleRequestToJoin(activeGroup)}
                          className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-tactical font-black text-xs uppercase cursor-pointer transition-all shadow-xl"
                        >
                          REQUEST SQUAD INGRESS
                        </button>
                      )
                    ) : (
                      <button
                        onClick={onOpenAuth}
                        className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-tactical font-black text-xs uppercase cursor-pointer"
                      >
                        LOGIN TO REQUEST ACCESS
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Create Squad Group */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-tactical font-black uppercase text-base text-white flex items-center gap-2">
                <Users className="h-4 w-4 text-amber-400" />
                <span>COMMISSION NEW SQUAD</span>
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-neutral-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreateGroup} className="space-y-3 text-xs font-data">
              <div>
                <label className="text-neutral-400 uppercase text-[10px] block mb-1">Squad Name</label>
                <input
                  type="text"
                  required
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  placeholder="e.g. Bravo Night Intercept"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-neutral-400 uppercase text-[10px] block mb-1">Squad Call Tag</label>
                <input
                  type="text"
                  required
                  value={newGroupTag}
                  onChange={(e) => setNewGroupTag(e.target.value)}
                  placeholder="e.g. #BRAVO-NIGHT"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-neutral-400 uppercase text-[10px] block mb-1">Mission Brief / Description</label>
                <textarea
                  rows={2}
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  placeholder="Tactical focus and group objectives..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="p-3 rounded-lg bg-neutral-900/60 border border-neutral-800 text-[10px] text-neutral-400 space-y-1">
                <span className="text-amber-400 font-bold block">SECURITY PROTOCOL:</span>
                <p>• Only approved squad members can read communications.</p>
                <p>• Newcomers will strictly see messages sent AFTER they join.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold font-tactical uppercase"
                >
                  CREATE SQUAD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Invite Operator to Squad */}
      {isInviteModalOpen && activeGroup && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-neutral-950 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-tactical font-black uppercase text-base text-white">
                INVITE TO {activeGroup.name}
              </h3>
              <button onClick={() => setIsInviteModalOpen(false)} className="text-neutral-500 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-xs text-neutral-400 font-sans">
              Invited members will only see messages transmitted after their invitation acceptance.
            </p>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {members
                .filter(m => !activeGroup.members.some(gm => gm.cid === m.cid))
                .map(m => (
                  <div key={m.id} className="p-2.5 rounded-lg border border-neutral-800 bg-neutral-900 flex items-center justify-between">
                    <div>
                      <span className="font-tactical font-bold text-white text-xs block">{m.name}</span>
                      <span className="text-[10px] text-amber-400">{m.rank} · {m.cid}</span>
                    </div>
                    <button
                      onClick={() => handleInviteOperator(m)}
                      className="px-3 py-1 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs cursor-pointer"
                    >
                      Invite
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
