import React from 'react';

export type MascotMood = 'happy' | 'encouraging' | 'celebrating' | 'thinking' | 'crying' | 'studying' | 'waving';

interface MascotProps {
  mood?: MascotMood;
  className?: string;
  size?: number;
}

export const MascotSvg: React.FC<MascotProps> = ({
  mood = 'happy',
  className = '',
  size = 120,
}) => {
  return (
    <div className={`relative inline-block select-none ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 200 200"
        width={size}
        height={size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="transition-transform duration-300 transform hover:scale-105"
      >
        <defs>
          <linearGradient id="dogBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f5b041" />
            <stop offset="100%" stopColor="#e67e22" />
          </linearGradient>
          <linearGradient id="dogBelly" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef9e7" />
            <stop offset="100%" stopColor="#fad7a1" />
          </linearGradient>
          <linearGradient id="dogEar" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#d35400" />
            <stop offset="100%" stopColor="#a04000" />
          </linearGradient>
          <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Soft shadow base */}
        <ellipse cx="100" cy="180" rx="60" ry="12" fill="#000000" fillOpacity="0.1" />

        {/* Tail (wagging if happy/celebrating/waving) */}
        {mood === 'happy' || mood === 'celebrating' || mood === 'waving' ? (
          <path d="M140 140 Q170 120 160 90 Q150 110 130 130 Z" fill="url(#dogBody)" className="origin-[140px_140px] animate-[wiggle_1s_ease-in-out_infinite]" />
        ) : mood === 'crying' ? (
          <path d="M140 140 Q160 160 150 175 Q135 160 125 145 Z" fill="url(#dogBody)" />
        ) : (
          <path d="M140 140 Q165 145 160 120 Q145 130 130 135 Z" fill="url(#dogBody)" />
        )}

        {/* Back legs */}
        <ellipse cx="65" cy="165" rx="18" ry="24" fill="url(#dogBody)" filter="url(#dropShadow)" />
        <ellipse cx="135" cy="165" rx="18" ry="24" fill="url(#dogBody)" filter="url(#dropShadow)" />
        {/* Paws */}
        <ellipse cx="60" cy="180" rx="14" ry="8" fill="#fef9e7" />
        <ellipse cx="140" cy="180" rx="14" ry="8" fill="#fef9e7" />

        {/* Main Body */}
        <ellipse cx="100" cy="125" rx="55" ry="60" fill="url(#dogBody)" filter="url(#dropShadow)" />
        
        {/* Inner Belly */}
        <ellipse cx="100" cy="135" rx="35" ry="45" fill="url(#dogBelly)" />

        {/* Front legs */}
        {mood === 'celebrating' || mood === 'waving' ? (
          <>
            <path d="M85 110 Q70 80 50 70 Q40 90 75 120 Z" fill="url(#dogBody)" />
            <path d="M115 110 Q130 80 150 70 Q160 90 125 120 Z" fill="url(#dogBody)" />
          </>
        ) : (
          <>
            <path d="M85 130 Q80 170 75 180 Q95 180 95 140 Z" fill="url(#dogBody)" />
            <path d="M115 130 Q120 170 125 180 Q105 180 105 140 Z" fill="url(#dogBody)" />
            <ellipse cx="85" cy="182" rx="12" ry="6" fill="#fef9e7" />
            <ellipse cx="115" cy="182" rx="12" ry="6" fill="#fef9e7" />
          </>
        )}

        {/* Head */}
        <ellipse cx="100" cy="80" rx="50" ry="45" fill="url(#dogBody)" filter="url(#dropShadow)" />
        
        {/* Snout Area */}
        <ellipse cx="100" cy="95" rx="25" ry="18" fill="url(#dogBelly)" />

        {/* Floppy Ears */}
        {mood === 'celebrating' ? (
          <>
            <path d="M60 55 C40 40, 20 60, 35 95 C45 80, 55 70, 60 55 Z" fill="url(#dogEar)" />
            <path d="M140 55 C160 40, 180 60, 165 95 C155 80, 145 70, 140 55 Z" fill="url(#dogEar)" />
          </>
        ) : mood === 'crying' ? (
          <>
            <path d="M55 70 C30 80, 25 110, 45 125 C55 100, 60 85, 55 70 Z" fill="url(#dogEar)" />
            <path d="M145 70 C170 80, 175 110, 155 125 C145 100, 140 85, 145 70 Z" fill="url(#dogEar)" />
          </>
        ) : (
          <>
            <path d="M55 60 C30 65, 30 105, 45 115 C55 90, 60 75, 55 60 Z" fill="url(#dogEar)" />
            <path d="M145 60 C170 65, 170 105, 155 115 C145 90, 140 75, 145 60 Z" fill="url(#dogEar)" />
          </>
        )}

        {/* Nose */}
        <ellipse cx="100" cy="90" rx="8" ry="5" fill="#3b2b1a" />
        <path d="M100 95 Q100 105 92 105 M100 95 Q100 105 108 105" stroke="#3b2b1a" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        
        {/* Tongue sticking out for happy/celebrating */}
        {(mood === 'happy' || mood === 'celebrating' || mood === 'waving') && (
          <path d="M96 104 Q100 115 104 104 Z" fill="#ff7676" />
        )}

        {/* Eyes (Outer White) */}
        <circle cx="78" cy="72" r="14" fill="#ffffff" />
        <circle cx="122" cy="72" r="14" fill="#ffffff" />

        {/* Iris / Pupils based on mood */}
        {mood === 'happy' || mood === 'celebrating' || mood === 'waving' ? (
          <>
            <circle cx="80" cy="72" r="8" fill="#3b2b1a" />
            <circle cx="120" cy="72" r="8" fill="#3b2b1a" />
            <circle cx="78" cy="69" r="3" fill="#ffffff" />
            <circle cx="118" cy="69" r="3" fill="#ffffff" />
          </>
        ) : mood === 'encouraging' ? (
          <>
            <circle cx="80" cy="72" r="8" fill="#3b2b1a" />
            <circle cx="120" cy="72" r="8" fill="#3b2b1a" />
            <path d="M68 62 Q78 58 88 62" stroke="#3b2b1a" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M112 62 Q122 58 132 62" stroke="#3b2b1a" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        ) : mood === 'thinking' ? (
          <>
            <circle cx="78" cy="68" r="7" fill="#3b2b1a" />
            <circle cx="122" cy="68" r="7" fill="#3b2b1a" />
            <path d="M70 60 Q80 55 90 65" stroke="#3b2b1a" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        ) : mood === 'crying' ? (
          <>
            <path d="M70 75 Q78 68 86 75" stroke="#3b2b1a" strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M114 75 Q122 68 130 75" stroke="#3b2b1a" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* Blue Tear Drops */}
            <ellipse cx="78" cy="85" rx="3" ry="5" fill="#1cb0f6" />
            <ellipse cx="122" cy="85" rx="3" ry="5" fill="#1cb0f6" />
          </>
        ) : (
          <>
            <circle cx="78" cy="72" r="8" fill="#3b2b1a" />
            <circle cx="122" cy="72" r="8" fill="#3b2b1a" />
            {/* Glasses */}
            <circle cx="78" cy="72" r="16" stroke="#1cb0f6" strokeWidth="3" fill="none" />
            <circle cx="122" cy="72" r="16" stroke="#1cb0f6" strokeWidth="3" fill="none" />
            <line x1="94" y1="72" x2="106" y2="72" stroke="#1cb0f6" strokeWidth="3" />
          </>
        )}

        {/* Academic Cap */}
        <g transform="translate(100, 35)">
          <polygon points="0,-16 38,0 0,12 -38,0" fill="#1e293b" />
          <polygon points="0,-16 38,0 0,-7 -38,0" fill="#334155" />
          <path d="M-20 1 C-20 10, 20 10, 20 1 Z" fill="#0f172a" />
          <circle cx="0" cy="-2" r="2.5" fill="#ffc800" />
          <path d="M0 -2 Q22 2 25 18" stroke="#ffc800" strokeWidth="2" strokeLinecap="round" fill="none" />
          <polygon points="23,16 27,16 28,24 22,24" fill="#e5a500" />
        </g>
      </svg>
    </div>
  );
};
