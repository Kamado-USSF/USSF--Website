import React, { useState } from 'react';
import { 
  UserPlus, Link2, ShieldCheck, CheckCircle2, Clock, 
  AlertCircle, AlertTriangle, FileText, ChevronRight, Upload, ArrowRight, Shield, 
  Copy, Check, ExternalLink, HelpCircle
} from 'lucide-react';
import { AccountLinkRequest, RecruitmentApplication } from '../data/ussfData';
import { tacticalAudio } from '../utils/audioSynth';
import { USSFLogo } from './USSFLogo';

interface USSFRecruitmentViewProps {
  applications: RecruitmentApplication[];
  linkRequests: AccountLinkRequest[];
  onSubmitApplication: (app: RecruitmentApplication) => Promise<void>;
  onSubmitLinkRequest: (req: AccountLinkRequest) => Promise<void>;
}

export const USSFRecruitmentView: React.FC<USSFRecruitmentViewProps> = ({
  applications,
  linkRequests,
  onSubmitApplication,
  onSubmitLinkRequest
}) => {
  const [activeTab, setActiveTab] = useState<'recruitment' | 'linking' | 'requirements'>('recruitment');

  // Form Fields - 1. In-Game Information
  const [ingameName, setIngameName] = useState('');
  const [ingameAccountName, setIngameAccountName] = useState('');
  const [ingamePlaytime, setIngamePlaytime] = useState('');
  const [policeLevel, setPoliceLevel] = useState('');
  const [serialF8, setSerialF8] = useState('');
  const [previousGroups, setPreviousGroups] = useState('');
  const [leaveReason, setLeaveReason] = useState('');

  // Form Fields - 2. Personal Information
  const [realName, setRealName] = useState('');
  const [age, setAge] = useState('');
  const [nationality, setNationality] = useState('');
  const [whyJoin, setWhyJoin] = useState('');

  // Form Fields - 3. Agreements
  const [agreeA1, setAgreeA1] = useState(false);
  const [agreeA2, setAgreeA2] = useState(false);
  const [agreeA3, setAgreeA3] = useState(false);
  const [agreeA4, setAgreeA4] = useState(false);

  // Form Fields - 4. Additional Information
  const [punishlog, setPunishlog] = useState('');
  const [myhistoryJoined, setMyhistoryJoined] = useState('');
  const [screenshotF5, setScreenshotF5] = useState('');
  const [statsInfo, setStatsInfo] = useState('');

  // Link Form
  const [linkUsername, setLinkUsername] = useState('');
  const [linkInGameName, setLinkInGameName] = useState('');
  const [linkCid, setLinkCid] = useState('SF-');
  const [linkRank, setLinkRank] = useState('Private');
  const [linkScreenshotUrl, setLinkScreenshotUrl] = useState('');

  const [submittedApp, setSubmittedApp] = useState(false);
  const [submittedLink, setSubmittedLink] = useState(false);
  const [isSubmittingApp, setIsSubmittingApp] = useState(false);
  const [isSubmittingLink, setIsSubmittingLink] = useState(false);
  const [copiedFormat, setCopiedFormat] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const REQUIREMENTS_16 = [
    "You should complete your application using your own knowledge.",
    "Do not lie in your application.",
    "Do not provide fake screenshots or screenshots taken from other accounts.",
    "You must have at least 300 hours of gameplay.",
    "You must be at least Law Level 20.",
    "You should know all CIT rules.",
    "You should be familiar with all internal law rules.",
    "You must not have received any punishment in the past 30 days.",
    "You should not have a reputation as a group hopper.",
    "You should occasionally join Discord to improve teamwork and communication.",
    "You must be able to follow internal rules.",
    "You must be able to follow orders.",
    "You should be a disciplined individual.",
    "Your in-game account should be linked to your forum account.",
    "You should be able to control yourself and demonstrate professionalism."
  ];

  const handleApplicationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeA1 || !agreeA2 || !agreeA3 || !agreeA4) {
      setFormError("You must agree to all 4 USSF Agreements (A1, A2, A3, A4) to submit your application.");
      tacticalAudio.playAlertWarning();
      return;
    }

    setFormError(null);
    tacticalAudio.playTargetLock();

    const newApp: RecruitmentApplication = {
      id: `app-${Date.now()}`,
      applicantName: ingameName || realName || 'Recruit',
      discordTag: nationality ? `${ingameAccountName} (${nationality})` : ingameAccountName,
      age: parseInt(age) || 18,
      playtimeHours: parseInt(ingamePlaytime) || 300,
      lawExperience: `Police Level: ${policeLevel} | Previous: ${previousGroups} | Why USSF: ${whyJoin}`,
      rulesAccepted: true,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending Review'
    };

    setIsSubmittingApp(true);
    try {
      await onSubmitApplication(newApp);
      setSubmittedApp(true);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to submit enlistment application.');
    } finally {
      setIsSubmittingApp(false);
    }
  };

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkUsername || !linkInGameName || !linkScreenshotUrl) return;

    tacticalAudio.playTargetLock();

    const newLink: AccountLinkRequest = {
      id: `req-link-${Date.now()}`,
      username: linkUsername,
      inGameName: linkInGameName,
      inGameCid: linkCid,
      ingameRank: linkRank,
      f5ScreenshotUrl: linkScreenshotUrl,
      submissionDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'Pending',
      adminNote: 'Submitted via official account linking portal.'
    };

    setIsSubmittingLink(true);
    setFormError(null);
    try {
      await onSubmitLinkRequest(newLink);
      setSubmittedLink(true);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to submit account-link request.');
    } finally {
      setIsSubmittingLink(false);
    }
  };

  const copyApplicationTemplate = () => {
    const template = `USSF Application Form
1. In-Game Information
Ingame Name: ${ingameName || ''}
Ingame Account Name: ${ingameAccountName || ''}
Ingame Playtime: ${ingamePlaytime || ''}
Police Level: ${policeLevel || ''}
Serial (F8:Serial): ${serialF8 || ''}
Previous Groups/Squads: ${previousGroups || ''}
Why did you leave your previous Groups/Squads?: ${leaveReason || ''}

2. Personal Information
Real Name: ${realName || ''}
Age: ${age || ''}
Nationality (for flag): ${nationality || ''}
Why do you want to join USSF?: ${whyJoin || ''}

3. Agreements
A1. I agree to remain loyal to USSF. [X]
A2. I agree to follow CIT/USSF rules. [X]
A3. I agree to obey my higher ranks and follow their orders. [X]
A4. I agree that I will not receive any serious punishments. [X]

4. Additional Information
Punishlog: ${punishlog || ''}
Myhistory Joined: ${myhistoryJoined || ''}
Screenshot (F5): ${screenshotF5 || ''}
Stats: ${statsInfo || ''}`;

    navigator.clipboard.writeText(template);
    setCopiedFormat(true);
    tacticalAudio.playTacticalClick();
    setTimeout(() => setCopiedFormat(false), 2000);
  };

  return (
    <div className="w-full bg-[#080a08] text-neutral-100 min-h-screen pb-16 font-sans">
      {/* Header Banner */}
      <div className="border-b border-neutral-800 bg-[#0d100d] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-data uppercase tracking-widest text-neutral-400 mb-2">
            <span className="flex items-center gap-1.5 text-amber-400 font-bold bg-amber-950/70 border border-amber-500/40 px-2.5 py-1 rounded backdrop-blur">
              <Shield className="h-3.5 w-3.5" />
              <span>USSF COMMAND PORTAL</span>
            </span>
            <span className="text-neutral-600">/</span>
            <span className="text-neutral-200">CIT2 LAW GROUP SELECTION</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black font-tactical uppercase text-white">
            ENLISTMENT & APPLICATION CENTER
          </h1>
          <p className="text-xs sm:text-sm text-neutral-300 font-sans mt-2 max-w-3xl leading-relaxed">
            Welcome to the official United States Special Forces (USSF) application portal. Read the 16 mandatory recruitment requirements carefully, complete the 4-section application form truthfully, and submit for High Command evaluation.
          </p>

          {/* Navigation Sub-Tabs */}
          <div className="flex flex-wrap gap-2 mt-6">
            <button
              onClick={() => setActiveTab('recruitment')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-tactical uppercase font-bold transition-all cursor-pointer ${
                activeTab === 'recruitment'
                  ? 'bg-amber-500 text-neutral-950 shadow-lg'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white'
              }`}
            >
              <UserPlus className="h-4 w-4" />
              <span>OFFICIAL APPLICATION FORM</span>
            </button>

            <button
              onClick={() => setActiveTab('requirements')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-tactical uppercase font-bold transition-all cursor-pointer ${
                activeTab === 'requirements'
                  ? 'bg-amber-500 text-neutral-950 shadow-lg'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white'
              }`}
            >
              <ShieldCheck className="h-4 w-4" />
              <span>RECRUITMENT REQUIREMENTS (16 RULES)</span>
            </button>

            <button
              onClick={() => setActiveTab('linking')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-tactical uppercase font-bold transition-all cursor-pointer ${
                activeTab === 'linking'
                  ? 'bg-amber-500 text-neutral-950 shadow-lg'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-300 hover:text-white'
              }`}
            >
              <Link2 className="h-4 w-4" />
              <span>ACCOUNT LINKING PORTAL</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 mt-8">
        {/* TAB 1: OFFICIAL APPLICATION FORM */}
        {activeTab === 'recruitment' && (
          <div className="space-y-8">
            {submittedApp ? (
              <div className="p-8 rounded-2xl border-2 border-emerald-500 bg-emerald-950/20 text-center space-y-4 shadow-2xl">
                <CheckCircle2 className="h-14 w-14 text-emerald-400 mx-auto animate-bounce" />
                <h2 className="text-2xl font-tactical font-black uppercase text-white">
                  APPLICATION SUBMITTED TO HIGH COMMAND
                </h2>
                <p className="text-sm text-neutral-300 max-w-xl mx-auto font-sans leading-relaxed">
                  Thank you for applying to Special Forces (USSF). Your application has been logged into the review queue. High Command will inspect your in-game punishment log, playtime, and legal record.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => setSubmittedApp(false)}
                    className="px-6 py-2 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-200 text-xs font-tactical font-bold uppercase cursor-pointer"
                  >
                    SUBMIT ANOTHER APPLICATION
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplicationSubmit} className="space-y-8">
                {/* Requirements Reminder Bar */}
                <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-data">
                  <div className="flex items-center gap-2 text-amber-300">
                    <AlertCircle className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>Minimum Qualifications: 300+ Playtime Hours · Law Level 20+ · Clean 30-Day Record</span>
                  </div>
                  <button
                    type="button"
                    onClick={copyApplicationTemplate}
                    className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    {copiedFormat ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedFormat ? 'COPIED TO CLIPBOARD' : 'COPY RAW FORMAT'}</span>
                  </button>
                </div>

                {/* SECTION 1: IN-GAME INFORMATION */}
                <div className="rounded-2xl border border-neutral-800 bg-[#0d100d] p-6 space-y-4">
                  <div className="border-b border-neutral-800 pb-3">
                    <h3 className="text-lg font-tactical font-bold uppercase text-white flex items-center gap-2">
                      <span className="h-6 w-6 rounded bg-amber-500 text-neutral-950 flex items-center justify-center font-black text-xs">1</span>
                      <span>IN-GAME INFORMATION</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-data">
                    <div>
                      <label className="text-neutral-400 uppercase text-[11px] block mb-1">
                        Ingame Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={ingameName}
                        onChange={(e) => setIngameName(e.target.value)}
                        placeholder="e.g. John_Doe"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-400 uppercase text-[11px] block mb-1">
                        Ingame Account Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={ingameAccountName}
                        onChange={(e) => setIngameAccountName(e.target.value)}
                        placeholder="e.g. JOHNDOE123"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-400 uppercase text-[11px] block mb-1">
                        Ingame Playtime (Hours) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={ingamePlaytime}
                        onChange={(e) => setIngamePlaytime(e.target.value)}
                        placeholder="e.g. 350 (Must be at least 300 hrs)"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-400 uppercase text-[11px] block mb-1">
                        Police Level (Law Level) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={policeLevel}
                        onChange={(e) => setPoliceLevel(e.target.value)}
                        placeholder="e.g. 24 (Must be at least Level 20)"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-neutral-400 uppercase text-[11px] block mb-1">
                        Serial (F8:Serial) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={serialF8}
                        onChange={(e) => setSerialF8(e.target.value)}
                        placeholder="Type 'serial' into F8 in-game and paste the 32-character serial here"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-400 uppercase text-[11px] block mb-1">
                        Previous Groups / Squads
                      </label>
                      <input
                        type="text"
                        value={previousGroups}
                        onChange={(e) => setPreviousGroups(e.target.value)}
                        placeholder="e.g. None / State Police / FBI"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="text-neutral-400 uppercase text-[11px] block mb-1">
                        Why did you leave your previous Groups/Squads?
                      </label>
                      <textarea
                        rows={2}
                        value={leaveReason}
                        onChange={(e) => setLeaveReason(e.target.value)}
                        placeholder="Explain departure reasons (or state N/A if USSF is your first group)..."
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white font-sans focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: PERSONAL INFORMATION */}
                <div className="rounded-2xl border border-neutral-800 bg-[#0d100d] p-6 space-y-4">
                  <div className="border-b border-neutral-800 pb-3">
                    <h3 className="text-lg font-tactical font-bold uppercase text-white flex items-center gap-2">
                      <span className="h-6 w-6 rounded bg-amber-500 text-neutral-950 flex items-center justify-center font-black text-xs">2</span>
                      <span>PERSONAL INFORMATION</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-data">
                    <div>
                      <label className="text-neutral-400 uppercase text-[11px] block mb-1">
                        Real Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={realName}
                        onChange={(e) => setRealName(e.target.value)}
                        placeholder="Your first name"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-400 uppercase text-[11px] block mb-1">
                        Age <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="13"
                        required
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="e.g. 19"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-400 uppercase text-[11px] block mb-1">
                        Nationality (For Flag) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={nationality}
                        onChange={(e) => setNationality(e.target.value)}
                        placeholder="e.g. United States, Germany, Brazil"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="text-neutral-400 uppercase text-[11px] block mb-1">
                        Why do you want to join USSF? <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        required
                        value={whyJoin}
                        onChange={(e) => setWhyJoin(e.target.value)}
                        placeholder="Explain your motivation, how you will benefit the group, and your commitment to tactical law enforcement..."
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white font-sans focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 3: AGREEMENTS */}
                <div className="rounded-2xl border border-neutral-800 bg-[#0d100d] p-6 space-y-4">
                  <div className="border-b border-neutral-800 pb-3">
                    <h3 className="text-lg font-tactical font-bold uppercase text-white flex items-center gap-2">
                      <span className="h-6 w-6 rounded bg-amber-500 text-neutral-950 flex items-center justify-center font-black text-xs">3</span>
                      <span>AGREEMENTS & MILITARY CODE</span>
                    </h3>
                  </div>

                  <div className="space-y-3 font-data text-xs">
                    <label className="flex items-start gap-3 p-3 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-950 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeA1}
                        onChange={(e) => setAgreeA1(e.target.checked)}
                        className="mt-0.5 rounded text-amber-500"
                      />
                      <span className="text-neutral-200">
                        <strong className="text-amber-400 font-bold">A1.</strong> I agree to remain loyal to USSF.
                      </span>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-950 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeA2}
                        onChange={(e) => setAgreeA2(e.target.checked)}
                        className="mt-0.5 rounded text-amber-500"
                      />
                      <span className="text-neutral-200">
                        <strong className="text-amber-400 font-bold">A2.</strong> I agree to follow CIT/USSF rules.
                      </span>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-950 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeA3}
                        onChange={(e) => setAgreeA3(e.target.checked)}
                        className="mt-0.5 rounded text-amber-500"
                      />
                      <span className="text-neutral-200">
                        <strong className="text-amber-400 font-bold">A3.</strong> I agree to obey my higher ranks and follow their orders.
                      </span>
                    </label>

                    <label className="flex items-start gap-3 p-3 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-950 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeA4}
                        onChange={(e) => setAgreeA4(e.target.checked)}
                        className="mt-0.5 rounded text-amber-500"
                      />
                      <span className="text-neutral-200">
                        <strong className="text-amber-400 font-bold">A4.</strong> I agree that I will not receive any serious punishments.
                      </span>
                    </label>
                  </div>
                </div>

                {/* SECTION 4: ADDITIONAL INFORMATION */}
                <div className="rounded-2xl border border-neutral-800 bg-[#0d100d] p-6 space-y-4">
                  <div className="border-b border-neutral-800 pb-3">
                    <h3 className="text-lg font-tactical font-bold uppercase text-white flex items-center gap-2">
                      <span className="h-6 w-6 rounded bg-amber-500 text-neutral-950 flex items-center justify-center font-black text-xs">4</span>
                      <span>ADDITIONAL INFORMATION & PROOFS</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-data">
                    <div>
                      <label className="text-neutral-400 uppercase text-[11px] block mb-1">
                        Punishlog (Image URL / Paste) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={punishlog}
                        onChange={(e) => setPunishlog(e.target.value)}
                        placeholder="Link to Imgur / screenshot of your in-game punishlog"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-400 uppercase text-[11px] block mb-1">
                        Myhistory Joined
                      </label>
                      <input
                        type="text"
                        value={myhistoryJoined}
                        onChange={(e) => setMyhistoryJoined(e.target.value)}
                        placeholder="Date or screenshot of account creation history"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-400 uppercase text-[11px] block mb-1">
                        Screenshot (F5) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={screenshotF5}
                        onChange={(e) => setScreenshotF5(e.target.value)}
                        placeholder="Direct link to unedited F5 scoreboard with playtime & level"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="text-neutral-400 uppercase text-[11px] block mb-1">
                        Stats (Arrests / Kills / AP)
                      </label>
                      <input
                        type="text"
                        value={statsInfo}
                        onChange={(e) => setStatsInfo(e.target.value)}
                        placeholder="Summary of arrests, kills, or arrest points"
                        className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                  </div>
                </div>

                {formError && (
                  <div className="p-3.5 rounded-xl border border-rose-500/80 bg-rose-950/50 text-rose-300 text-xs font-data flex items-center gap-2 animate-in fade-in">
                    <AlertTriangle className="h-4 w-4 text-rose-400 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                  <div className="text-xs text-neutral-400 font-data">
                    By clicking submit, you confirm that every statement is truthful and compliant with USSF internal military regulations.
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmittingApp}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-tactical font-black text-sm uppercase tracking-wider transition-all cursor-pointer shadow-xl shadow-amber-500/20"
                  >
                    {isSubmittingApp ? 'SUBMITTING...' : 'SUBMIT APPLICATION FOR REVIEW'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: 16 RECRUITMENT REQUIREMENTS */}
        {activeTab === 'requirements' && (
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-neutral-800 bg-[#0d100d] space-y-4">
              <div className="border-b border-neutral-800 pb-3">
                <h3 className="text-xl font-tactical font-black uppercase text-white flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-amber-400" />
                  <span>USSF APPLICATION REQUIREMENTS</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-1">
                  Compliance with all 16 articles is strictly mandatory. Violations result in permanent blacklist.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-data text-xs">
                {REQUIREMENTS_16.map((rule, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl border border-neutral-800 bg-neutral-950 flex items-start gap-3"
                  >
                    <span className="h-5 w-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="text-neutral-200 leading-relaxed font-sans">{rule}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  onClick={() => setActiveTab('recruitment')}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-tactical font-bold text-xs uppercase cursor-pointer"
                >
                  PROCEED TO APPLICATION FORM
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: ACCOUNT LINKING PORTAL */}
        {activeTab === 'linking' && (
          <div className="space-y-6">
            {submittedLink ? (
              <div className="p-8 rounded-2xl border-2 border-emerald-500 bg-emerald-950/20 text-center space-y-4">
                <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
                <h3 className="text-xl font-tactical font-bold uppercase text-white">
                  ACCOUNT LINKING REQUEST DISPATCHED
                </h3>
                <p className="text-xs text-neutral-300 font-sans max-w-md mx-auto">
                  High Command will verify your in-game identity and badge credentials.
                </p>
                <button
                  onClick={() => setSubmittedLink(false)}
                  className="px-4 py-2 rounded bg-neutral-900 text-xs text-white uppercase font-bold"
                >
                  NEW LINK REQUEST
                </button>
              </div>
            ) : (
              <form onSubmit={handleLinkSubmit} className="p-6 rounded-2xl border border-neutral-800 bg-[#0d100d] space-y-4">
                <div className="border-b border-neutral-800 pb-3">
                  <h3 className="text-lg font-tactical font-bold uppercase text-white flex items-center gap-2">
                    <Link2 className="h-5 w-5 text-amber-400" />
                    <span>LINK IN-GAME ACCOUNT TO OFFICIAL ROSTER</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-1">
                    Connect your in-game citizen serial and account name to sync promotion points and live duty rewards.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-data">
                  <div>
                    <label className="text-neutral-400 uppercase text-[11px] block mb-1">
                      Web Profile Username
                    </label>
                    <input
                      type="text"
                      required
                      value={linkUsername}
                      onChange={(e) => setLinkUsername(e.target.value)}
                      placeholder="Your website username"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 uppercase text-[11px] block mb-1">
                      CIT2 In-Game Character Name
                    </label>
                    <input
                      type="text"
                      required
                      value={linkInGameName}
                      onChange={(e) => setLinkInGameName(e.target.value)}
                      placeholder="e.g. John_Doe"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 uppercase text-[11px] block mb-1">
                      Assigned USSF CID
                    </label>
                    <input
                      type="text"
                      required
                      value={linkCid}
                      onChange={(e) => setLinkCid(e.target.value)}
                      placeholder="e.g. SF-022"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-neutral-400 uppercase text-[11px] block mb-1">
                      Current Rank
                    </label>
                    <input
                      type="text"
                      required
                      value={linkRank}
                      onChange={(e) => setLinkRank(e.target.value)}
                      placeholder="e.g. Sergeant"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="text-neutral-400 uppercase text-[11px] block mb-1">
                      F5 In-Game Scoreboard Screenshot URL
                    </label>
                    <input
                      type="text"
                      required
                      value={linkScreenshotUrl}
                      onChange={(e) => setLinkScreenshotUrl(e.target.value)}
                      placeholder="Imgur link demonstrating your in-game name & group membership"
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  {formError && <p role="alert" className="mr-auto text-xs text-rose-400">{formError}</p>}
                  <button
                    type="submit"
                    disabled={isSubmittingLink}
                    className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-tactical font-black text-xs uppercase cursor-pointer"
                  >
                    {isSubmittingLink ? 'SUBMITTING...' : 'DISPATCH LINK REQUEST'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
