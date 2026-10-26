import React from 'react';

interface USSFLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export const USSFLogo: React.FC<USSFLogoProps> = ({
  className = '',
  size = 'md',
  showText = false
}) => {
  const sizeMap = {
    sm: 'h-6 w-6',
    md: 'h-9 w-9',
    lg: 'h-13 w-13',
    xl: 'h-20 w-20'
  };

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className={`relative ${sizeMap[size]} shrink-0 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] group`}>
        {/* Official USSF Beret Skull & Crossed Daggers Crest */}
        <div className="h-full w-full rounded-full overflow-hidden border-2 border-amber-500/80 shadow-lg bg-[#070b08] p-0.5 relative transition-transform duration-300 group-hover:scale-105">
          <img
            src="/src/assets/images/ussf_official_seal_1790594742015.jpg"
            alt="Official USSF Special Forces Crest"
            className="h-full w-full object-cover rounded-full"
            loading="eager"
          />
          {/* Subtle radar sweep overlay */}
          <div className="absolute inset-0 rounded-full border border-amber-400/30 pointer-events-none" />
        </div>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="font-tactical font-black text-sm tracking-wider uppercase text-white flex items-center gap-1.5">
            <span>SPECIAL FORCES</span>
            <span className="text-[10px] font-data text-amber-400 bg-amber-950/70 border border-amber-500/50 px-1 py-0.2 rounded font-bold">
              USSF
            </span>
          </span>
          <span className="text-[9px] font-data text-neutral-400 uppercase tracking-widest mt-0.5">
            CIT2 LAW GROUP · EST. 2019
          </span>
        </div>
      )}
    </div>
  );
};

