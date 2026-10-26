import React, { useState } from 'react';
import { 
  MessageSquare, Heart, Repeat, Share2, Image, Film, Send, 
  Hash, AtSign, Search, Shield, Award, Users, ChevronRight, 
  Sparkles, CheckCircle2, MessageCircle, X, ExternalLink, Flame
} from 'lucide-react';
import { SocialPost, SocialComment, DirectMessage, USSFMember } from '../data/ussfData';
import { tacticalAudio } from '../utils/audioSynth';

interface USSFSocialViewProps {
  currentUser: USSFMember | null;
  members: USSFMember[];
  posts: SocialPost[];
  dms: DirectMessage[];
  onAddPost: (newPost: SocialPost) => void;
  onAddComment: (postId: string, comment: SocialComment) => void;
  onSendDm: (dm: DirectMessage) => void;
  onOpenAuth: () => void;
  onToggleLikePost: (postId: string) => void;
  onRepostPost: (postId: string) => void;
}

export const USSFSocialView: React.FC<USSFSocialViewProps> = ({
  currentUser,
  members,
  posts,
  dms,
  onAddPost,
  onAddComment,
  onSendDm,
  onOpenAuth,
  onToggleLikePost,
  onRepostPost
}) => {
  const [activeFilterTag, setActiveFilterTag] = useState<string>('ALL');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostHashtags, setNewPostHashtags] = useState('');
  const [newPostMediaUrl, setNewPostMediaUrl] = useState('');
  const [newPostMediaType, setNewPostMediaType] = useState<'image' | 'video'>('image');
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [replyPostId, setReplyPostId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // Direct Messaging State
  const [activeDmPartner, setActiveDmPartner] = useState<USSFMember | null>(null);
  const [dmInput, setDmInput] = useState('');

  const trendingHashtags = [
    { tag: 'USSF', postsCount: 168 },
    { tag: 'SpecialForces', postsCount: 142 },
    { tag: 'NightPatrol', postsCount: 89 },
    { tag: 'CIT2Law', postsCount: 65 },
    { tag: 'APBTarget', postsCount: 54 },
    { tag: 'CombinedArms', postsCount: 38 }
  ];

  const filteredPosts = activeFilterTag === 'ALL'
    ? posts
    : posts.filter(p => p.hashtags.some(h => h.toLowerCase() === activeFilterTag.toLowerCase()));

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostContent.trim()) return;

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    tacticalAudio.playTargetLock();

    const tags = newPostHashtags
      .split(',')
      .map(t => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const post: SocialPost = {
      id: `post-${Date.now()}`,
      authorName: currentUser.name,
      authorCid: currentUser.cid,
      authorRank: currentUser.rank,
      authorAvatar: currentUser.avatarUrl || '/src/assets/images/military_leader_training_1790341999734.jpg',
      authorFrame: currentUser.avatarFrame,
      authorNameStyle: currentUser.nameStyle,
      content: newPostContent,
      hashtags: tags.length ? tags : ['USSF', 'CIT2Law'],
      mediaUrl: newPostMediaUrl.trim() ? newPostMediaUrl.trim() : undefined,
      mediaType: newPostMediaType,
      timestamp: 'Just now',
      likes: 1,
      reposts: 0,
      comments: []
    };

    onAddPost(post);
    setNewPostContent('');
    setNewPostHashtags('');
    setNewPostMediaUrl('');
    setShowMediaInput(false);
  };

  const handleCreateComment = (postId: string) => {
    if (!replyContent.trim()) return;
    if (!currentUser) {
      onOpenAuth();
      return;
    }

    tacticalAudio.playTacticalClick();
    const comment: SocialComment = {
      id: `comm-${Date.now()}`,
      authorName: currentUser.name,
      authorCid: currentUser.cid,
      authorRank: currentUser.rank,
      authorAvatar: currentUser.avatarUrl || '/src/assets/images/military_leader_training_1790341999734.jpg',
      authorFrame: currentUser.avatarFrame,
      content: replyContent,
      timestamp: 'Just now',
      likes: 0
    };

    onAddComment(postId, comment);
    setReplyContent('');
  };

  const handleSendDirectMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dmInput.trim() || !activeDmPartner) return;

    if (!currentUser) {
      onOpenAuth();
      return;
    }

    tacticalAudio.playRadioSquelch();

    const dm: DirectMessage = {
      id: `dm-${Date.now()}`,
      senderCid: currentUser.cid,
      senderName: currentUser.name,
      receiverCid: activeDmPartner.cid,
      message: dmInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false
    };

    onSendDm(dm);
    setDmInput('');
  };

  const conversationDms = activeDmPartner && currentUser
    ? dms.filter(d => 
        (d.senderCid === currentUser.cid && d.receiverCid === activeDmPartner.cid) ||
        (d.senderCid === activeDmPartner.cid && d.receiverCid === currentUser.cid)
      )
    : [];

  return (
    <div className="w-full bg-[#080a08] text-neutral-100 min-h-screen pb-16 font-sans">
      {/* Top Banner */}
      <div className="border-b border-neutral-800 bg-[#0d100d] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-data uppercase tracking-widest text-emerald-400 mb-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>MEDIA // SPECIAL FORCES TACTICAL NETWORK</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-tactical uppercase text-white">
              SOCIAL MEDIA & OPERATIONAL DISPATCH
            </h1>
            <p className="text-xs text-neutral-300 font-sans mt-1">
              Real-time field intelligence sharing, patrol clips, user mentions, working likes and reposts, and private direct messaging.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2 bg-neutral-900 border border-neutral-700/80 px-3 py-1.5 rounded-lg text-xs font-data">
                <span className="text-neutral-400">LOGGED AS:</span>
                <span className="text-emerald-400 font-bold">{currentUser.name} ({currentUser.cid})</span>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 font-tactical font-black text-xs uppercase cursor-pointer"
              >
                LOGIN TO POST & DM
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Hashtags & Online Operators Directory (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            {/* Trending Tactical Hashtags */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-4 space-y-3">
              <div className="flex items-center gap-2 text-xs font-data uppercase text-neutral-400 font-bold border-b border-neutral-800 pb-2">
                <Flame className="h-4 w-4 text-amber-400" />
                <span>TRENDING TOPICS</span>
              </div>
              <div className="space-y-1">
                <button
                  onClick={() => setActiveFilterTag('ALL')}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-data flex items-center justify-between cursor-pointer ${
                    activeFilterTag === 'ALL'
                      ? 'bg-amber-500 text-neutral-950 font-bold'
                      : 'text-neutral-300 hover:bg-neutral-800'
                  }`}
                >
                  <span>All Transmissions</span>
                  <span className="text-[10px] opacity-70">{posts.length}</span>
                </button>
                {trendingHashtags.map(item => (
                  <button
                    key={item.tag}
                    onClick={() => setActiveFilterTag(item.tag)}
                    className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-data flex items-center justify-between cursor-pointer ${
                      activeFilterTag.toLowerCase() === item.tag.toLowerCase()
                        ? 'bg-amber-500 text-neutral-950 font-bold'
                        : 'text-neutral-300 hover:bg-neutral-800'
                    }`}
                  >
                    <span>#{item.tag}</span>
                    <span className="text-[10px] opacity-70">{item.postsCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Messaging Contacts */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-data uppercase text-neutral-400 font-bold border-b border-neutral-800 pb-2">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 text-cyan-400" />
                  <span>DIRECT MESSAGING (DM)</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">E2EE SECURE</span>
              </div>

              <div className="space-y-1.5">
                {members.slice(0, 6).map(member => (
                  <div
                    key={member.id}
                    onClick={() => {
                      tacticalAudio.playTacticalClick();
                      setActiveDmPartner(member);
                    }}
                    className={`p-2 rounded-lg flex items-center justify-between cursor-pointer transition-colors ${
                      activeDmPartner?.id === member.id
                        ? 'bg-cyan-950/60 border border-cyan-500/50'
                        : 'hover:bg-neutral-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <img
                          src={member.avatarUrl || '/src/assets/images/military_leader_training_1790341999734.jpg'}
                          alt={member.name}
                          className="h-7 w-7 rounded-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-neutral-900" />
                      </div>
                      <div>
                        <div className="text-xs font-data font-semibold text-neutral-200">{member.name}</div>
                        <div className="text-[10px] font-data text-neutral-500">{member.rank}</div>
                      </div>
                    </div>
                    <span className="text-[10px] font-data text-cyan-400">CHAT</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER COLUMN: Feed & Create Post (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Create Post Card */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={currentUser?.avatarUrl || '/src/assets/images/military_leader_training_1790341999734.jpg'}
                    alt="My avatar"
                    className="h-10 w-10 rounded-full object-cover border border-amber-500/40"
                  />
                  <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-400 rounded-full ring-2 ring-neutral-900" />
                </div>
                <div className="flex-1">
                  <textarea
                    rows={2}
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    placeholder={currentUser ? "Broadcast tactical dispatch, patrol debrief, or media..." : "Login to broadcast on USSF Social Media..."}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500 resize-none font-sans"
                  />
                </div>
              </div>

              {/* Extra Inputs (Hashtags & Media) */}
              <div className="space-y-2">
                <input
                  type="text"
                  value={newPostHashtags}
                  onChange={(e) => setNewPostHashtags(e.target.value)}
                  placeholder="Hashtags (e.g. USSF, NightPatrol, CIT2Law, APBTarget)"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1 text-xs text-neutral-300 placeholder:text-neutral-600 font-data focus:outline-none focus:border-amber-500"
                />

                {showMediaInput && (
                  <div className="p-2.5 rounded bg-neutral-950 border border-neutral-800 space-y-2 text-xs font-data">
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="mediaType"
                          checked={newPostMediaType === 'image'}
                          onChange={() => setNewPostMediaType('image')}
                        />
                        <span>Image URL</span>
                      </label>
                      <label className="flex items-center gap-1.5 cursor-pointer">
                        <input
                          type="radio"
                          name="mediaType"
                          checked={newPostMediaType === 'video'}
                          onChange={() => setNewPostMediaType('video')}
                        />
                        <span>Video / Clip URL</span>
                      </label>
                    </div>
                    <input
                      type="url"
                      value={newPostMediaUrl}
                      onChange={(e) => setNewPostMediaUrl(e.target.value)}
                      placeholder="Paste image or direct video URL (e.g. Imgur, Streamable)"
                      className="w-full bg-neutral-900 border border-neutral-700 rounded px-2 py-1 text-xs text-neutral-200 focus:outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Bottom Actions Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                <div className="flex items-center gap-2 text-neutral-400">
                  <button
                    type="button"
                    onClick={() => setShowMediaInput(!showMediaInput)}
                    className="p-1.5 rounded hover:bg-neutral-800 text-amber-400 transition-colors flex items-center gap-1 text-xs font-data cursor-pointer"
                  >
                    <Image className="h-4 w-4" />
                    <span>Attach Media</span>
                  </button>
                </div>

                <button
                  onClick={handleCreatePost}
                  disabled={!newPostContent.trim()}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 font-tactical font-black text-xs uppercase transition-colors cursor-pointer disabled:opacity-40"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>PUBLISH DISPATCH</span>
                </button>
              </div>
            </div>

            {/* Posts Stream */}
            <div className="space-y-4">
              {filteredPosts.map(post => {
                const isReplying = replyPostId === post.id;
                return (
                  <div key={post.id} className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-3">
                    {/* Post Author Info */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={post.authorAvatar}
                            alt={post.authorName}
                            className={`h-10 w-10 rounded-full object-cover ${post.authorFrame ? 'border-2 border-amber-400' : ''}`}
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-tactical font-bold text-neutral-100 text-sm">
                              {post.authorName}
                            </span>
                            <span className="text-xs font-data text-emerald-400">
                              @{post.authorCid}
                            </span>
                            <span className="text-[10px] font-data text-neutral-500">
                              · {post.timestamp}
                            </span>
                          </div>
                          <div className="text-[10px] font-data text-amber-400">
                            {post.authorRank}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="text-xs font-sans text-neutral-200 leading-relaxed">
                      {post.content}
                    </div>

                    {/* Hashtags */}
                    {post.hashtags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {post.hashtags.map((tag, idx) => (
                          <span
                            key={idx}
                            onClick={() => setActiveFilterTag(tag)}
                            className="text-[11px] font-data text-cyan-400 hover:text-cyan-300 cursor-pointer"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Media Attachment (Image or Video) */}
                    {post.mediaUrl && (
                      <div className="rounded-lg overflow-hidden border border-neutral-800 max-h-96 bg-black">
                        {post.mediaType === 'video' ? (
                          <video
                            src={post.mediaUrl}
                            controls
                            className="w-full max-h-80 object-cover"
                          />
                        ) : (
                          <img
                            src={post.mediaUrl}
                            alt="Post attachment"
                            className="w-full max-h-80 object-cover filter brightness-95 contrast-110"
                          />
                        )}
                      </div>
                    )}

                    {/* Engagement Actions Bar - FULLY FUNCTIONAL LIKES AND REPOSTS */}
                    <div className="flex items-center justify-between text-xs font-data text-neutral-400 pt-2 border-t border-neutral-800/70">
                      <button
                        onClick={() => {
                          tacticalAudio.playTacticalClick();
                          setReplyPostId(isReplying ? null : post.id);
                        }}
                        className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>{post.comments.length} Replies</span>
                      </button>

                      <button
                        onClick={() => {
                          tacticalAudio.playTacticalClick();
                          onRepostPost(post.id);
                        }}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                          post.isRepostedByMe ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
                        }`}
                        title="Repost this dispatch"
                      >
                        <Repeat className={`h-4 w-4 ${post.isRepostedByMe ? 'rotate-180 transition-transform' : ''}`} />
                        <span>{post.reposts} Reposts</span>
                      </button>

                      <button
                        onClick={() => {
                          tacticalAudio.playTacticalClick();
                          onToggleLikePost(post.id);
                        }}
                        className={`flex items-center gap-1.5 transition-colors cursor-pointer ${
                          post.isLikedByMe ? 'text-rose-500 font-bold' : 'hover:text-rose-400'
                        }`}
                        title="Like this dispatch"
                      >
                        <Heart className={`h-4 w-4 ${post.isLikedByMe ? 'fill-rose-500 text-rose-500' : ''}`} />
                        <span>{post.likes} Likes</span>
                      </button>

                      <button
                        onClick={() => {
                          tacticalAudio.playTacticalClick();
                          navigator.clipboard.writeText(window.location.href);
                          setCopiedPostId(post.id);
                          setTimeout(() => setCopiedPostId(null), 2500);
                        }}
                        className="hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
                        title="Share this dispatch link"
                      >
                        <Share2 className="h-4 w-4" />
                        {copiedPostId === post.id && (
                          <span className="text-[10px] text-amber-400 font-data">Copied!</span>
                        )}
                      </button>
                    </div>

                    {/* Interactive Thread Replies */}
                    <div className="space-y-2 pt-2 border-t border-neutral-800/40">
                      {post.comments.map(c => (
                        <div key={c.id} className="flex items-start gap-2.5 p-2 rounded bg-neutral-950/60 border border-neutral-800/60 text-xs">
                          <img
                            src={c.authorAvatar}
                            alt={c.authorName}
                            className="h-6 w-6 rounded-full object-cover shrink-0 mt-0.5"
                          />
                          <div className="flex-1">
                            <div className="flex items-center justify-between text-[11px] font-data">
                              <span className="font-bold text-neutral-200">{c.authorName}</span>
                              <span className="text-neutral-500">{c.timestamp}</span>
                            </div>
                            <p className="text-neutral-300 font-sans mt-0.5">{c.content}</p>
                          </div>
                        </div>
                      ))}

                      {/* Reply Input Form */}
                      {isReplying && (
                        <div className="flex items-center gap-2 pt-2 animate-in fade-in">
                          <input
                            type="text"
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Write a field reply..."
                            className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-2.5 py-1.5 text-xs text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-cyan-500 font-sans"
                          />
                          <button
                            onClick={() => handleCreateComment(post.id)}
                            className="px-3 py-1.5 rounded bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-tactical font-black uppercase transition-colors cursor-pointer"
                          >
                            REPLY
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: Active Direct Messaging Drawer (3 cols) */}
          <div className="lg:col-span-3">
            {activeDmPartner ? (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-4 flex flex-col h-[520px] justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={activeDmPartner.avatarUrl || '/src/assets/images/military_leader_training_1790341999734.jpg'}
                        alt={activeDmPartner.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <div>
                        <div className="text-xs font-tactical font-bold text-neutral-100">
                          {activeDmPartner.name}
                        </div>
                        <div className="text-[10px] font-data text-emerald-400">
                          {activeDmPartner.cid} · {activeDmPartner.status}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveDmPartner(null)}
                      className="text-neutral-400 hover:text-white p-1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Message History */}
                  <div className="space-y-2 overflow-y-auto max-h-[350px] pr-1">
                    {conversationDms.length === 0 ? (
                      <div className="text-center py-8 text-neutral-500 text-xs font-data">
                        Secure terminal open. Send encrypted transmission to {activeDmPartner.name}.
                      </div>
                    ) : (
                      conversationDms.map(m => {
                        const isMe = currentUser && m.senderCid === currentUser.cid;
                        return (
                          <div
                            key={m.id}
                            className={`p-2.5 rounded-lg text-xs max-w-[85%] font-sans ${
                              isMe
                                ? 'ml-auto bg-amber-500 text-neutral-950 font-medium'
                                : 'mr-auto bg-neutral-950 border border-neutral-800 text-neutral-200'
                            }`}
                          >
                            <p>{m.message}</p>
                            <span className={`block text-[9px] font-data mt-1 text-right ${
                              isMe ? 'text-neutral-800' : 'text-neutral-500'
                            }`}>
                              {m.timestamp}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* DM Input Form */}
                <form onSubmit={handleSendDirectMessage} className="mt-3 pt-3 border-t border-neutral-800 flex items-center gap-2">
                  <input
                    type="text"
                    value={dmInput}
                    onChange={(e) => setDmInput(e.target.value)}
                    placeholder="Type encrypted message..."
                    className="flex-1 bg-neutral-950 border border-neutral-800 rounded px-2.5 py-2 text-xs text-neutral-100 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="p-2 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 cursor-pointer"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-6 text-center text-xs font-data text-neutral-400 space-y-3">
                <Shield className="h-10 w-10 text-neutral-600 mx-auto" />
                <h4 className="font-tactical uppercase font-bold text-neutral-200">
                  TACTICAL SECURE COMMS
                </h4>
                <p className="text-neutral-500">
                  Select an active group operator from the list to initiate a private direct messaging frequency.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
