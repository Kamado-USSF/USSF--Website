import React, { useState } from 'react';
import { 
  Terminal, Shield, Plus, CheckCircle2, ThumbsUp, ThumbsDown, 
  MessageSquare, Flame, Clock, Award, Users, Filter, X, Send, Crown
} from 'lucide-react';
import { USSFMember, StudioFeaturePlan } from '../data/ussfData';
import { tacticalAudio } from '../utils/audioSynth';
import { USSFLogo } from './USSFLogo';

interface USSFAdminStudioViewProps {
  currentUser: USSFMember | null;
  members: USSFMember[];
  plans: StudioFeaturePlan[];
  onUpdatePlans: (plans: StudioFeaturePlan[]) => void;
  onOpenAuth: () => void;
}

export const USSFAdminStudioView: React.FC<USSFAdminStudioViewProps> = ({
  currentUser,
  members,
  plans,
  onUpdatePlans,
  onOpenAuth
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [activePlanId, setActivePlanId] = useState<string | null>(plans[0]?.id || null);
  const [noteInput, setNoteInput] = useState('');

  // New Feature Form
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<StudioFeaturePlan['domain']>('Operations');
  const [priority, setPriority] = useState<StudioFeaturePlan['priority']>('DEFCON 1 (High)');
  const [description, setDescription] = useState('');

  const isLeaderOrAdmin = currentUser && (
    currentUser.rankLevel >= 15 || 
    currentUser.isOwner || 
    currentUser.rankCategory === 'High Command' || 
    currentUser.rankCategory === 'Field Command'
  );

  const filteredPlans = selectedDomain === 'ALL'
    ? plans
    : plans.filter(p => p.domain === selectedDomain);

  const activePlan = plans.find(p => p.id === activePlanId) || plans[0];

  const handleVote = (planId: string, type: 'support' | 'revision') => {
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    tacticalAudio.playTacticalClick();
    const updated = plans.map(p => {
      if (p.id === planId) {
        const hasVoted = p.votedMembers.includes(currentUser.cid);
        if (hasVoted) return p; // prevent double vote

        return {
          ...p,
          votesSupport: type === 'support' ? p.votesSupport + 1 : p.votesSupport,
          votesRevision: type === 'revision' ? p.votesRevision + 1 : p.votesRevision,
          votedMembers: [...p.votedMembers, currentUser.cid]
        };
      }
      return p;
    });

    onUpdatePlans(updated);
  };

  const handleStatusChange = (planId: string, newStatus: StudioFeaturePlan['status']) => {
    tacticalAudio.playTargetLock();
    const updated = plans.map(p => {
      if (p.id === planId) {
        return { ...p, status: newStatus };
      }
      return p;
    });
    onUpdatePlans(updated);
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim() || !currentUser || !activePlan) return;

    tacticalAudio.playRadioSquelch();
    const newNote = {
      author: `${currentUser.name} (${currentUser.rank})`,
      text: noteInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updated = plans.map(p => {
      if (p.id === activePlan.id) {
        return {
          ...p,
          notes: [...p.notes, newNote]
        };
      }
      return p;
    });

    onUpdatePlans(updated);
    setNoteInput('');
  };

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !currentUser) return;

    tacticalAudio.playTargetLock();
    const newPlan: StudioFeaturePlan = {
      id: `plan-${Date.now()}`,
      title: title.trim(),
      domain,
      priority,
      status: 'PROPOSED',
      proposerName: currentUser.name,
      proposerRank: currentUser.rank,
      description: description.trim() || 'Planned strategic feature concept.',
      votesSupport: 1,
      votesRevision: 0,
      votedMembers: [currentUser.cid],
      createdAt: new Date().toISOString().substring(0, 10),
      notes: [
        {
          author: currentUser.name,
          text: `Proposed by ${currentUser.name} for tactical high command review.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    onUpdatePlans([newPlan, ...plans]);
    setActivePlanId(newPlan.id);
    setIsCreateModalOpen(false);
    setTitle('');
    setDescription('');
  };

  const getStatusBadge = (status: StudioFeaturePlan['status']) => {
    switch (status) {
      case 'PROPOSED': return 'bg-amber-950/80 border-amber-500/50 text-amber-300';
      case 'UNDER_REVIEW': return 'bg-sky-950/80 border-sky-500/50 text-sky-300';
      case 'IN_DEVELOPMENT': return 'bg-purple-950/80 border-purple-500/50 text-purple-300';
      case 'DEPLOYED': return 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300';
    }
  };

  const getPriorityBadge = (priority: StudioFeaturePlan['priority']) => {
    switch (priority) {
      case 'DEFCON 1 (High)': return 'text-rose-400 border-rose-500/40 bg-rose-950/40';
      case 'DEFCON 2 (Medium)': return 'text-amber-400 border-amber-500/40 bg-amber-950/40';
      default: return 'text-neutral-400 border-neutral-700 bg-neutral-900';
    }
  };

  return (
    <div className="w-full bg-[#080a08] text-neutral-100 min-h-screen pb-20 font-sans">
      {/* Banner */}
      <div className="border-b border-neutral-800 bg-[#0d100d] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-data uppercase tracking-widest text-amber-400 mb-1">
              <Crown className="h-4 w-4" />
              <span>COMMAND WORKBENCH // ADMIN & LEADER PLANNING STUDIO</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-tactical uppercase text-white flex items-center gap-3">
              <USSFLogo size="md" />
              <span>CUSTOM STUDIO FOR ADMIN & LEADERS</span>
            </h1>
            <p className="text-xs text-neutral-400 font-sans mt-1">
              Strategic planning deck where High Command and group leaders decide roadmap features, submit tactical proposals, and deliberate upcoming initiatives.
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
            <span>SUBMIT FEATURE PROPOSAL</span>
          </button>
        </div>
      </div>

      {/* Main Studio View */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        {/* Domain Filter Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs font-data text-neutral-400 uppercase tracking-wider mr-2">
            STRATEGY DOMAIN:
          </span>
          {['ALL', 'Operations', 'Law Enforcement', 'Treasury', 'Squad Comms', 'CIT2 Tech'].map(d => (
            <button
              key={d}
              onClick={() => setSelectedDomain(d)}
              className={`px-3 py-1 rounded-lg text-xs font-data uppercase tracking-wider transition-colors cursor-pointer ${
                selectedDomain === d
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Two-Column Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Feature Roadmap Cards (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {filteredPlans.map(plan => {
              const isSelected = activePlanId === plan.id;
              const hasVoted = Boolean(currentUser && plan.votedMembers.includes(currentUser.cid));

              return (
                <div
                  key={plan.id}
                  onClick={() => {
                    tacticalAudio.playTacticalClick();
                    setActivePlanId(plan.id);
                  }}
                  className={`rounded-2xl border-2 p-5 transition-all cursor-pointer flex flex-col justify-between gap-3 shadow-xl ${
                    isSelected
                      ? 'border-amber-500 bg-neutral-900/90'
                      : 'border-neutral-800 bg-[#0c0f0c] hover:border-neutral-700 hover:bg-neutral-900/50'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-data font-bold border ${getStatusBadge(plan.status)}`}>
                          {plan.status.replace('_', ' ')}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-data font-semibold border ${getPriorityBadge(plan.priority)}`}>
                          {plan.priority}
                        </span>
                      </div>
                      <span className="text-[10px] font-data text-neutral-500">
                        {plan.domain} · {plan.createdAt}
                      </span>
                    </div>

                    <h3 className="font-tactical font-black text-lg text-white group-hover:text-amber-300">
                      {plan.title}
                    </h3>

                    <p className="text-xs font-sans text-neutral-300 leading-relaxed">
                      {plan.description}
                    </p>
                  </div>

                  {/* Leader Controls & Voting Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-800/80 text-xs font-data">
                    <span className="text-neutral-400">
                      Proposed by: <strong className="text-amber-400">{plan.proposerName}</strong> ({plan.proposerRank})
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVote(plan.id, 'support');
                        }}
                        disabled={hasVoted}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-data transition-colors cursor-pointer ${
                          hasVoted
                            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400 opacity-80 cursor-default'
                            : 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:border-emerald-500 hover:text-emerald-400'
                        }`}
                        title="Cast Leader Support Vote"
                      >
                        <ThumbsUp className="h-3.5 w-3.5" />
                        <span>Support ({plan.votesSupport})</span>
                      </button>

                      {/* Admin/Leader Quick Status Transition */}
                      {isLeaderOrAdmin && (
                        <select
                          value={plan.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => handleStatusChange(plan.id, e.target.value as any)}
                          className="bg-neutral-950 border border-neutral-700 text-amber-300 rounded px-2 py-1 text-[11px] font-data focus:outline-none cursor-pointer"
                        >
                          <option value="PROPOSED">PROPOSED</option>
                          <option value="UNDER_REVIEW">UNDER REVIEW</option>
                          <option value="IN_DEVELOPMENT">IN DEVELOPMENT</option>
                          <option value="DEPLOYED">DEPLOYED</option>
                        </select>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Strategic Deliberation & Leader Whiteboard (5 Cols) */}
          <div className="lg:col-span-5 sticky top-24">
            {activePlan ? (
              <div className="rounded-2xl border-2 border-neutral-800 bg-[#0d100d] p-5 space-y-4 shadow-2xl">
                <div className="border-b border-neutral-800 pb-3">
                  <div className="flex items-center gap-2 text-xs font-data uppercase tracking-wider text-amber-400 font-bold mb-1">
                    <MessageSquare className="h-4 w-4" />
                    <span>LEADERSHIP STRATEGY WHITEBOARD</span>
                  </div>
                  <h3 className="font-tactical font-black text-base text-white">
                    {activePlan.title}
                  </h3>
                  <span className="text-[10px] font-data text-neutral-400">
                    Collaborative debate thread for High Command & Group Leaders.
                  </span>
                </div>

                {/* Notes Feed */}
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  {activePlan.notes.map((note, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-neutral-800 bg-neutral-950/70 text-xs space-y-1">
                      <div className="flex items-center justify-between text-[10px] font-data">
                        <span className="font-bold text-amber-400">{note.author}</span>
                        <span className="text-neutral-500">{note.time}</span>
                      </div>
                      <p className="font-sans text-neutral-200 leading-relaxed">
                        {note.text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="space-y-2 pt-2 border-t border-neutral-800">
                  <textarea
                    rows={3}
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Enter leader strategic input or development notes..."
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-xl p-3 text-xs text-neutral-100 placeholder:text-neutral-500 font-sans focus:outline-none focus:border-amber-500 leading-relaxed"
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-data text-neutral-500">
                      Logged in: {currentUser ? currentUser.name : 'Guest (Auth Req)'}
                    </span>
                    <button
                      type="submit"
                      disabled={!noteInput.trim()}
                      className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold font-tactical text-xs uppercase cursor-pointer disabled:opacity-40 flex items-center gap-1.5"
                    >
                      <Send className="h-3.5 w-3.5" />
                      <span>POST STRATEGY NOTE</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="p-8 text-center rounded-xl border border-neutral-800 bg-neutral-900/40 text-neutral-500 text-xs font-data">
                Select a feature proposal to view leadership whiteboard deliberations.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Propose New Feature */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-neutral-950 border-2 border-amber-500/80 rounded-2xl p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <h3 className="font-tactical font-black uppercase text-lg text-white flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-400" />
                <span>SUBMIT FEATURE PROPOSAL TO HIGH COMMAND</span>
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-neutral-500 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePlan} className="space-y-4 text-xs font-data">
              <div>
                <label className="text-neutral-400 uppercase text-[10px] block mb-1">
                  Feature Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. In-Game Radio Audio Scanner Integration"
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-neutral-400 uppercase text-[10px] block mb-1">
                    Strategy Domain
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Operations">Operations</option>
                    <option value="Law Enforcement">Law Enforcement</option>
                    <option value="Treasury">Treasury</option>
                    <option value="Squad Comms">Squad Comms</option>
                    <option value="CIT2 Tech">CIT2 Tech</option>
                  </select>
                </div>

                <div>
                  <label className="text-neutral-400 uppercase text-[10px] block mb-1">
                    Priority Level
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="DEFCON 1 (High)">DEFCON 1 (High)</option>
                    <option value="DEFCON 2 (Medium)">DEFCON 2 (Medium)</option>
                    <option value="Routine">Routine</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-neutral-400 uppercase text-[10px] block mb-1">
                  Detailed Operational Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain why this feature matters for Special Forces members, leaders, and CIT2 gameplay..."
                  className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500 font-sans leading-relaxed"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold font-tactical uppercase shadow"
                >
                  SUBMIT TO LEADERS
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
