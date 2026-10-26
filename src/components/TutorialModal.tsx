import React, { useState } from 'react';
import { 
  Compass, ChevronRight, ChevronLeft, CheckCircle2, 
  X, Award, Shield, DollarSign, UserPlus, Link2, Sparkles, 
  Calendar, Settings as SettingsIcon, MessageSquare, BookOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { tacticalAudio } from '../utils/audioSynth';
import { USSFView } from './USSFHeader';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: USSFView) => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({
  isOpen,
  onClose,
  onNavigate
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to Special Forces (USSF)',
      badge: 'Step 1 of 7 · Welcome Guide',
      icon: Shield,
      targetView: 'home' as USSFView,
      viewLabel: 'Go to Homepage',
      description: 'Welcome to our official USSF home! We are a dedicated law enforcement group founded on June 30, 2019. Here you can check our current squad readiness, browse recent field patrols, and catch up on the latest group announcements.',
      keyFeatures: [
        'Live group member count, active duty reports, and group status.',
        'Clear views of our active operations across San Andreas.',
        'Quick links to apply, check rewards, or contact team leaders.'
      ]
    },
    {
      title: 'Member Roster & Service Records',
      badge: 'Step 2 of 7 · Roster & Ranks',
      icon: Award,
      targetView: 'roster' as USSFView,
      viewLabel: 'Open Member Roster',
      description: 'Meet every member of our team! You can see everyone from recruits up to High Command. Click on any member to see their playtime hours, arrested criminals, customized namecard, and service history.',
      keyFeatures: [
        'See who is currently online, in-game, or on duty.',
        'Members can edit their own profile info, motto, and preferred weapons.',
        'Print or view an official military ID badge.'
      ]
    },
    {
      title: 'Financial Rewards & Daily Bonuses',
      badge: 'Step 3 of 7 · Payouts & Claims',
      icon: DollarSign,
      targetView: 'financial' as USSFView,
      viewLabel: 'View Financial Tasks',
      description: 'We reward hard work! Members earn cash for hitting arrest point milestones (up to $50,000,000 for 100k points), hosting patrols, taking down APB suspects, and claiming daily login rewards.',
      keyFeatures: [
        'Submit screenshots of your F5 panel and in-game phone clock to get paid.',
        'Select multiple tasks together for a single combined payout.',
        'Log in daily to claim escalating cash bonuses and rank promotion points.'
      ]
    },
    {
      title: 'Squad Comms & Media Feed',
      badge: 'Step 4 of 7 · Community & Chat',
      icon: MessageSquare,
      targetView: 'social' as USSFView,
      viewLabel: 'Open Media Feed',
      description: 'Stay connected with the crew. Share screenshots, patrol clips, and funny moments with likes and comments. You can also send private direct messages to fellow operators.',
      keyFeatures: [
        'Share screenshots and field clips directly with the group.',
        'Like, comment, and celebrate victories together.',
        'Private squad chat for coordinating patrols in real time.'
      ]
    },
    {
      title: 'Operator Birthdays & Celebrations',
      badge: 'Step 5 of 7 · Birthday Vault',
      icon: Calendar,
      targetView: 'birthdays' as USSFView,
      viewLabel: 'Open Birthday Calendar',
      description: 'We celebrate our brothers! Check the birthday calendar so you never miss a teammate\'s special day. You can send them congratulations and even surprise them with a cash gift.',
      keyFeatures: [
        'Easily set your own birthday date so the team can celebrate with you.',
        'Special birthday highlights when someone has a birthday today.',
        'Send direct cash or promotion point gifts to honor teammates.'
      ]
    },
    {
      title: 'Our Group History & Code of Conduct',
      badge: 'Step 6 of 7 · Group Info',
      icon: BookOpen,
      targetView: 'groupInfo' as USSFView,
      viewLabel: 'Read Group Info',
      description: 'Learn what USSF stands for. We follow strict CIT2 law rules, respect each other, and maintain the highest standards of discipline. Read about our founding, our leaders, and our official uniforms.',
      keyFeatures: [
        'Meet our Founders and leadership team.',
        'Our official motto: "May God Have Mercy Upon Our Enemies Cause We Won\'t".',
        'Details on group level L4 and our official skin IDs and car shaders.'
      ]
    },
    {
      title: 'Custom Profiles & Over 150 Languages',
      badge: 'Step 7 of 7 · Personalize',
      icon: SettingsIcon,
      targetView: 'settings' as USSFView,
      viewLabel: 'Open Settings',
      description: 'Make the site your own! Pick custom glowing name styles, choose beautiful namecards inspired by Genshin, Wuwa, and NTE, or switch the entire website into Arabic, Spanish, Russian, or any other language.',
      keyFeatures: [
        'Over 150 languages with full Arabic right-to-left layout support.',
        'Unique animated name glows and Genshin/Wuwa style namecards.',
        'Dark tactical theme with night vision mode options.'
      ]
    }
  ];

  const step = steps[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    tacticalAudio.playTacticalClick();
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    tacticalAudio.playTacticalClick();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    localStorage.setItem('ussf_tutorial_seen', 'true');
    if (dontShowAgain) {
      localStorage.setItem('ussf_tutorial_disabled', 'true');
    }
    onClose();
  };

  const handleGoToView = (view: USSFView) => {
    tacticalAudio.playTargetLock();
    handleFinish();
    onNavigate(view);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl border-2 border-amber-500/60 bg-[#0d100d] p-6 sm:p-8 shadow-2xl text-neutral-100 font-sans">
        {/* Close Button */}
        <button
          onClick={handleFinish}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-800 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Top Kicker */}
        <div className="flex items-center gap-2 text-xs font-data uppercase tracking-widest text-amber-400 font-bold mb-2">
          <Compass className="h-4 w-4" />
          <span>{step.badge}</span>
        </div>

        {/* Header with Animated Icon */}
        <div className="flex items-start gap-4 pb-4 border-b border-neutral-800">
          <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-500/50 text-amber-400 shrink-0 shadow-lg shadow-amber-500/10">
            <StepIcon className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-tactical font-black uppercase text-white leading-tight">
              {step.title}
            </h3>
            <p className="text-xs text-neutral-300 font-sans mt-2 leading-relaxed">
              {step.description}
            </p>
          </div>
        </div>

        {/* Bullet Points with checkmarks */}
        <div className="py-4 space-y-2.5">
          {step.keyFeatures.map((feat, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-neutral-200 bg-neutral-950/70 p-3 rounded-xl border border-neutral-800">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{feat}</span>
            </div>
          ))}
        </div>

        {/* Bottom Options & Navigation Bar */}
        <div className="space-y-4 pt-3 border-t border-neutral-800">
          {/* Don't show again toggle */}
          <div className="flex items-center justify-between text-xs font-data text-neutral-400">
            <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="h-4 w-4 accent-amber-500 cursor-pointer"
              />
              <span>Don't show this tutorial again (can re-enable in Settings)</span>
            </label>
          </div>

          <div className="flex items-center justify-between">
            {/* Step Dots */}
            <div className="flex items-center gap-1.5">
              {steps.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentStep(idx)}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentStep ? 'w-6 bg-amber-400' : 'w-2 bg-neutral-700 hover:bg-neutral-500'
                  }`}
                />
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-3 py-1.5 rounded text-xs font-data text-neutral-400 hover:text-white border border-neutral-800 cursor-pointer"
                >
                  BACK
                </button>
              )}

              <button
                onClick={() => handleGoToView(step.targetView)}
                className="px-3.5 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-amber-400 text-xs font-tactical font-bold uppercase transition-colors cursor-pointer"
              >
                {step.viewLabel}
              </button>

              <button
                onClick={handleNext}
                className="flex items-center gap-1 px-4 py-1.5 rounded bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-tactical font-black uppercase transition-colors cursor-pointer shadow-md"
              >
                <span>{currentStep === steps.length - 1 ? 'FINISH' : 'NEXT'}</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
