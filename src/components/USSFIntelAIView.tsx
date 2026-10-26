import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, Send, Sparkles, User, Terminal, Trash2, Copy, 
  Check, RefreshCw, Shield, AlertCircle, Compass, Zap
} from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { tacticalAudio } from '../utils/audioSynth';
import { USSFLogo } from './USSFLogo';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const USSFIntelAIView: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: "Special Forces AI online. Welcome, Operator! I am your tactical operations assistant. Ask me anything, or choose a directive below to learn how to apply, link your in-game account, earn promotion points, or claim financial rewards.",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating]);

  // Exact 4 Quick Prompts as explicitly requested by user
  const QUICK_PROMPTS = [
    { title: "How to apply for USSF", prompt: "How to apply for USSF" },
    { title: "Already joined USSF then how to link in", prompt: "Already joined USSF then how to link in" },
    { title: "How to get promotion points", prompt: "How to get promotion points" },
    { title: "How to apply for financial", prompt: "How to apply for financial" }
  ];

  // Natural ChatGPT-like dynamic tactical conversational response generator
  const getSpecialForcesAIResponse = (q: string): string => {
    const raw = q.trim();
    const query = raw.toLowerCase();

    // Natural Greetings & Conversational check-ins (like ChatGPT)
    if (/^(hey|hello|hi|yo|sup|greetings|howdy|good\s*(morning|afternoon|evening))\b/i.test(query)) {
      return `Hey there! How's your day going? 👋\n\nI'm the **Special Forces AI** assistant. How can I help you out today?\n\nIf you're looking for guidance, here are the most common things operators ask me about:\n- 📝 **How to apply for USSF**\n- 🔗 **Already joined USSF? How to link your account**\n- 🎖️ **How to get promotion points** (Financial tasks, hosting, or participating in patrols/trainings)\n- 💰 **How to apply for financial reward claims**\n\nFeel free to ask me anything in plain English!`;
    }

    // "How are you" / "What are you doing"
    if (query.includes('how are you') || query.includes("how's it going") || query.includes("what's up")) {
      return `I'm doing great and ready for action! Thanks for asking. How are things on your end in San Andreas? Let me know if you need any help with USSF enlistment, rankings, or financial payout claims.`;
    }

    // Who are you / Identity
    if (query.includes('who are you') || query.includes('what are you') || query.includes('your name')) {
      return `I'm **Special Forces AI**, the smart operations assistant for the United States Special Forces (USSF) on CIT2.\n\nThink of me like your personal tactical advisor — here to answer your questions, help you apply, guide you through earning promotion points, and make sure your treasury payouts and in-game credentials are taken care of!`;
    }

    // Thank you / Gratitude
    if (query.includes('thank') || query.includes('thx') || query.includes('appreciate')) {
      return `You're very welcome! Always glad to help an operator out. Stay safe on the streets, and let me know if you need anything else! 🫡`;
    }

    // Help / What can you do
    if (query === 'help' || query.includes('can you help') || query.includes('what can you do')) {
      return `I'd be happy to help! Here are the core things I can assist you with right now:\n\n1. **How to apply for USSF**: Requirements, law level, playtime hours, and where to apply.\n2. **How to link your in-game account**: Step-by-step instructions for members already in the group.\n3. **How to get promotion points**: Daily financial tasks (up to 50 pts/day), participating (+10 pts), or hosting (+20 pts).\n4. **How to apply for financial rewards**: How to submit arrest point proofs, patrol claims, and bounties.\n\nJust ask me about any of these!`;
    }

    // 1. How to apply for USSF
    if (query.includes('how to apply') || (query.includes('apply') && query.includes('ussf')) || query.includes('enlist') || query.includes('recruit')) {
      return `### HOW TO APPLY FOR USSF (SPECIAL FORCES ENLISTMENT PROTOCOL)\n\nTo join the United States Special Forces on CIT2, follow these official steps:\n\n1. **Check Minimum Qualifications**:\n   - **Gameplay Hours**: 300+ verified in-game hours on CIT2.\n   - **Law Level**: Minimum Police/Law Enforcement Level 20.\n   - **Clean Record**: No admin punishments or group infractions in the last 30 days.\n   - **Conduct**: Respectful, disciplined demeanor and adherence to group orders.\n\n2. **Navigate to the Recruitment Portal**:\n   - Click **"ENLIST & LINKING"** in the top navigation bar.\n   - Select the **"Enlistment Application"** form.\n\n3. **Fill in Your Information**:\n   - Your exact in-game CIT2 account name & serial CID.\n   - Discord tag (e.g. \`username#0000\`).\n   - Current law level and total playtime hours.\n   - Upload an unedited screenshot of your in-game stats scoreboard (\`F5\` or \`/scores\`).\n\n4. **Command Review**:\n   - High Command will review your dossier in the Admin Deck. Once approved, you will be commissioned to the official USSF roster!`;
    }

    // 2. Already joined USSF then how to link in
    if (query.includes('link') || query.includes('already joined') || query.includes('link in') || query.includes('in-game account')) {
      return `### ALREADY JOINED USSF IN-GAME? HOW TO LINK YOUR ACCOUNT\n\nIf you are already an active member of Special Forces on CIT2 and want your official rank, namecard, and stats displayed on this website:\n\n1. **Head to the Linking Portal**:\n   - Open the **"ENLIST & LINKING"** tab from the main menu.\n   - Switch to the **"In-Game Account Linking"** tab.\n\n2. **Submit Your In-Game Credentials**:\n   - **In-Game Username**: Your exact CIT2 character name.\n   - **Account CID**: Your in-game serial identification number.\n   - **Current Rank**: Select the exact rank you currently hold in the group (e.g. Sergeant First Class, Lieutenant, Commander).\n\n3. **Provide Verification Proof**:\n   - Provide an unedited screenshot showing your in-game squad tag (\`[USSF]\`) and phone clock (\`B+Clock\`).\n\n4. **Admin Confirmation**:\n   - An Administrator will verify your submission in the Admin Deck. Upon approval, your account is linked and you gain full member privileges across the site!`;
    }

    // 3. How to get promotion points
    if (query.includes('promotion point') || query.includes('get point') || query.includes('promotion') || query.includes('rank up')) {
      return `### OFFICIAL USSF PROMOTION POINT DOCTRINE\n\nHere are the exact ways operators earn promotion points to climb through the 20 ranks of USSF:\n\n- 💰 **Financial Tasks**: Earn up to **50 Promotion Points everyday**.\n  - Higher Money Payout = Higher Points awarded!\n  - *Daily Financial Cap*: You can claim a maximum of **50 points per day** from Financial Tasks.\n\n- 🛡️ **Participate in Patrol or Training**: **+10 Points** per verified session.\n  - Join any squad patrol or group training and get logged on the field report.\n\n- ⭐ **Host Patrol or Training**: **+20 Points** per verified session hosted.\n  - Lead and coordinate a quality patrol or training (Sergeant Major+ rank).\n\n- 📅 **Daily Login Streak**: Bonus points awarded every day for maintaining your active duty streak!\n\n**Point Banking Rule**:\nWhen you submit a promotion request, only the points required for your next rank are deducted. Any extra surplus points remain safely banked in your career ledger!`;
    }

    // 4. How to apply for financial
    if (query.includes('financial') || query.includes('claim') || query.includes('money') || query.includes('payout') || query.includes('treasury')) {
      return `### HOW TO APPLY FOR FINANCIAL REWARD PAYOUTS\n\nUSSF rewards active operators with substantial cash payouts from the group treasury. Here is how to submit a claim:\n\n1. **Go to the Financial Section**:\n   - Click **"FINANCE & CAREER ➔ FINANCIAL REWARDS"** in the top header.\n\n2. **Select Your Task**:\n   - **Arrest Points**: Daily claims from 5,000 AP ($750K) up to 100,000 AP ($50,000,000 Cash!).\n   - **Patrol & Training**: Participation ($500K) or Hosting ($1M to $7M).\n   - **Combat & Tactical**: Bounty blip arrests ($1M), APB kills ($2M), 2,000+ Damage in AR/CE ($800K). (Supports quantity multipliers!)\n   - **Daily Specialist**: Top Cop ($2M), Bomb Disposal ($2M), Detective cases ($2M).\n\n3. **Click "Claim Reward"**:\n   - Provide your unedited screenshot proof showing the in-game phone clock (\`B+Clock\`).\n   - Enter the quantity if submitting multiple bounty/APB arrests.\n\n4. **Receive Payout & Promotion Points**:\n   - The financial manager will verify and disburse the cash to your dossier, awarding up to **50 Promotion Points** daily!`;
    }

    // Natural ChatGPT-style helpful fallback for any other question
    return `I understand! Regarding "${raw}":\n\nAs the Special Forces AI, I'm here to support you with everything in USSF and CIT2 law enforcement.\n\nHere are quick shortcuts to key operations:\n- 📝 **Apply for USSF**: Head to the Recruitment tab to submit your enlistment dossier.\n- 🔗 **Link Your Account**: Link your verified in-game CIT2 account to sync rank and profile.\n- 🎖️ **Promotion Points**: Earn up to 50 pts/day from financial tasks, +10 for participating in patrols, and +20 for hosting.\n- 💰 **Financial Payouts**: Claim cash bounties for AP, arrests, and patrols directly from the treasury.\n\nLet me know if you want me to explain any of these in detail or if you have any other questions!`;
  };

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputText).trim();
    if (!query || isGenerating) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsGenerating(true);
    tacticalAudio.playTacticalClick();

    let responseText = '';

    try {
      // Attempt Google Gemini API with seamless local fallback
      const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || (typeof process !== 'undefined' ? process.env?.GEMINI_API_KEY : '');

      if (apiKey) {
        try {
          const ai = new GoogleGenAI({ apiKey });
          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: [
              {
                role: 'user',
                parts: [{ text: query }]
              }
            ],
            config: {
              systemInstruction: `You are the Special Forces AI assistant for the United States Special Forces (CIT2 Law Group, established June 30, 2019 on CIT2).
Speak naturally, conversationally, and intelligently like ChatGPT, with a sharp, disciplined tactical tone. Never output rigid canned templates for simple greetings like "hey" or "hello". Answer questions helpfully, conversationally, and directly.
Motto: "May God Have Mercy Upon Our Enemies Cause We Won't".`
            }
          });
          responseText = response.text || getSpecialForcesAIResponse(query);
        } catch {
          // Fallback to local tactical engine on quota limit or rate limit
          responseText = getSpecialForcesAIResponse(query);
        }
      } else {
        await new Promise(r => setTimeout(r, 600));
        responseText = getSpecialForcesAIResponse(query);
      }
    } catch {
      responseText = getSpecialForcesAIResponse(query);
    } finally {
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: responseText || getSpecialForcesAIResponse(query),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, assistantMsg]);
      tacticalAudio.playRadioSquelch();
      setIsGenerating(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClear = () => {
    tacticalAudio.playTacticalClick();
    setMessages([
      {
        id: 'init-reset',
        sender: 'assistant',
        text: "Terminal reset. Special Forces AI ready for next directive.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="w-full bg-[#080a08] text-neutral-100 min-h-screen pb-16 font-sans flex flex-col">
      {/* Top Header */}
      <div className="border-b border-neutral-800 bg-[#0d100d] px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="h-12 w-12 rounded-full border-2 border-amber-500 bg-black p-0.5 relative flex items-center justify-center shrink-0">
              <USSFLogo size="md" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-black animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black font-tactical uppercase text-white">
                  SPECIAL FORCES AI // TACTICAL COMMAND INTELLIGENCE
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-data font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                  GPT-STYLE ENGINE
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-data mt-0.5">
                Special Forces CIT2 Tactical Operations & Enlistment Assistant
              </p>
            </div>
          </div>

          <button
            onClick={handleClear}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 bg-neutral-900 text-xs font-data text-neutral-400 hover:text-white transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>CLEAR TERMINAL</span>
          </button>
        </div>
      </div>

      {/* Main Terminal Window */}
      <div className="mx-auto max-w-5xl w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 flex flex-col justify-between">
        {/* Quick Suggestion Prompts */}
        {messages.length <= 2 && (
          <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {QUICK_PROMPTS.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q.prompt)}
                className="p-3 rounded-xl border border-neutral-800 hover:border-amber-500 bg-neutral-900/60 hover:bg-neutral-900 text-left transition-all cursor-pointer group"
              >
                <div className="text-xs font-tactical font-bold text-amber-400 group-hover:text-amber-300 mb-1 flex items-center justify-between">
                  <span>{q.title}</span>
                  <Zap className="h-3 w-3 text-amber-400" />
                </div>
                <div className="text-[11px] font-sans text-neutral-400 line-clamp-1">
                  {q.prompt}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Message Thread */}
        <div className="space-y-4 mb-6">
          {messages.map(msg => {
            const isAI = msg.sender === 'assistant';
            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isAI ? 'items-start' : 'items-start flex-row-reverse'}`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border ${
                  isAI
                    ? 'border-amber-500/80 bg-neutral-900 text-amber-400'
                    : 'border-emerald-500/80 bg-neutral-900 text-emerald-400'
                }`}>
                  {isAI ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                </div>

                <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-1.5 shadow-xl relative group ${
                  isAI
                    ? 'bg-neutral-900/90 border border-neutral-800 text-neutral-100'
                    : 'bg-amber-500/15 border border-amber-500/40 text-amber-100'
                }`}>
                  <div className="flex items-center justify-between gap-4 text-[10px] font-data text-neutral-400 border-b border-neutral-800/80 pb-1 mb-1">
                    <span className="font-bold uppercase tracking-wider text-amber-400">
                      {isAI ? 'SPECIAL FORCES AI' : 'OPERATOR'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span>{msg.timestamp}</span>
                      <button
                        onClick={() => handleCopy(msg.id, msg.text)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </div>
                  </div>

                  <div className="text-xs sm:text-sm font-sans leading-relaxed whitespace-pre-wrap">
                    {msg.text}
                  </div>
                </div>
              </div>
            );
          })}

          {isGenerating && (
            <div className="flex gap-3.5 items-start">
              <div className="h-8 w-8 rounded-full border border-amber-500/80 bg-neutral-900 text-amber-400 flex items-center justify-center shrink-0">
                <Bot className="h-4 w-4 animate-spin" />
              </div>
              <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-4 text-xs font-data text-amber-400 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping" />
                <span>SYNTHESIZING TACTICAL REPORT...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="sticky bottom-4 w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2 rounded-2xl border-2 border-neutral-700 bg-neutral-950 p-2 shadow-2xl focus-within:border-amber-500 transition-all"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask Special Forces AI about promotions, linking, applications, or financial tasks..."
              disabled={isGenerating}
              className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm font-sans text-neutral-100 placeholder:text-neutral-500 focus:outline-none"
            />

            <button
              type="submit"
              disabled={!inputText.trim() || isGenerating}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-neutral-950 font-tactical font-black text-xs uppercase tracking-wider transition-colors cursor-pointer shadow-md"
            >
              <span>SEND</span>
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
          <div className="text-[10px] font-data text-center text-neutral-500 mt-2">
            Special Forces AI provides tactical assistance. Always verify in-game actions with official USSF High Command directives.
          </div>
        </div>
      </div>
    </div>
  );
};
