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
          <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#78d800" />
            <stop offset="100%" stopColor="#58a700" />
          </linearGradient>
          <linearGradient id="bellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#a3f52a" />
            <stop offset="100%" stopColor="#78d800" />
          </linearGradient>
          <linearGradient id="beakGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffb300" />
            <stop offset="100%" stopColor="#ff8c00" />
          </linearGradient>
          <linearGradient id="hatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1cb0f6" />
            <stop offset="100%" stopColor="#0b84cb" />
          </linearGradient>
          <filter id="dropShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* Soft shadow base */}
        <ellipse cx="100" cy="180" rx="60" ry="12" fill="#000000" fillOpacity="0.1" />

        {/* Little Owl Feet */}
        <ellipse cx="75" cy="176" rx="14" ry="7" fill="#ff8c00" />
        <ellipse cx="125" cy="176" rx="14" ry="7" fill="#ff8c00" />
        <ellipse cx="68" cy="178" rx="5" ry="4" fill="#e07900" />
        <ellipse cx="75" cy="179" rx="5" ry="4" fill="#e07900" />
        <ellipse cx="82" cy="178" rx="5" ry="4" fill="#e07900" />
        <ellipse cx="118" cy="178" rx="5" ry="4" fill="#e07900" />
        <ellipse cx="125" cy="179" rx="5" ry="4" fill="#e07900" />
        <ellipse cx="132" cy="178" rx="5" ry="4" fill="#e07900" />

        {/* Main Body */}
        <ellipse cx="100" cy="115" rx="72" ry="62" fill="url(#bodyGrad)" filter="url(#dropShadow)" />

        {/* Owl Ear Tufts */}
        <path d="M42 75 C30 50, 48 35, 62 60 Z" fill="#58a700" />
        <path d="M158 75 C170 50, 152 35, 138 60 Z" fill="#58a700" />

        {/* Inner Belly */}
        <ellipse cx="100" cy="128" rx="46" ry="38" fill="url(#bellyGrad)" />
        {/* Subtle Belly Feathers */}
        <path d="M85 125 Q100 135 115 125" stroke="#58a700" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />
        <path d="M90 138 Q100 146 110 138" stroke="#58a700" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6" />

        {/* Left & Right Wings */}
        {mood === 'celebrating' ? (
          <>
            {/* Raised Wings in Joy */}
            <path d="M35 115 C20 80, 25 50, 45 45 C50 65, 45 95, 38 115 Z" fill="#4fa000" />
            <path d="M165 115 C180 80, 175 50, 155 45 C150 65, 155 95, 162 115 Z" fill="#4fa000" />
          </>
        ) : mood === 'waving' ? (
          <>
            <path d="M38 120 C18 100, 20 70, 35 60 C42 80, 42 105, 40 120 Z" fill="#4fa000" />
            <path d="M162 125 C175 135, 178 150, 160 155 C150 145, 152 135, 160 125 Z" fill="#4fa000" />
          </>
        ) : (
          <>
            {/* Resting wings */}
            <path d="M36 120 C22 135, 25 155, 42 155 C48 145, 46 130, 40 120 Z" fill="#4fa000" />
            <path d="M164 120 C178 135, 175 155, 158 155 C152 145, 154 130, 160 120 Z" fill="#4fa000" />
          </>
        )}

        {/* Large Expressive Eyes (Outer White Rings) */}
        <circle cx="68" cy="98" r="26" fill="#ffffff" filter="url(#dropShadow)" />
        <circle cx="132" cy="98" r="26" fill="#ffffff" filter="url(#dropShadow)" />

        {/* Iris / Pupils based on mood */}
        {mood === 'happy' || mood === 'celebrating' || mood === 'waving' ? (
          <>
            {/* Sparkling Happy Eyes */}
            <circle cx="72" cy="98" r="14" fill="#3b2b1a" />
            <circle cx="128" cy="98" r="14" fill="#3b2b1a" />
            {/* Eye Highlights */}
            <circle cx="68" cy="93" r="5" fill="#ffffff" />
            <circle cx="76" cy="103" r="2.5" fill="#ffffff" />
            <circle cx="124" cy="93" r="5" fill="#ffffff" />
            <circle cx="132" cy="103" r="2.5" fill="#ffffff" />
          </>
        ) : mood === 'encouraging' ? (
          <>
            {/* Determined / Focused Eyes */}
            <circle cx="70" cy="96" r="13" fill="#3b2b1a" />
            <circle cx="130" cy="96" r="13" fill="#3b2b1a" />
            <circle cx="68" cy="92" r="4.5" fill="#ffffff" />
            <circle cx="128" cy="92" r="4.5" fill="#ffffff" />
          </>
        ) : mood === 'thinking' ? (
          <>
            {/* Looking upward in thought */}
            <circle cx="70" cy="90" r="12" fill="#3b2b1a" />
            <circle cx="130" cy="90" r="12" fill="#3b2b1a" />
            <circle cx="68" cy="87" r="4" fill="#ffffff" />
            <circle cx="128" cy="87" r="4" fill="#ffffff" />
          </>
        ) : mood === 'crying' ? (
          <>
            {/* Sad / Tearful Eyes */}
            <path d="M56 102 Q68 90 80 102" stroke="#3b2b1a" strokeWidth="5" strokeLinecap="round" fill="none" />
            <path d="M120 102 Q132 90 144 102" stroke="#3b2b1a" strokeWidth="5" strokeLinecap="round" fill="none" />
            {/* Blue Tear Drops */}
            <ellipse cx="60" cy="115" rx="4" ry="7" fill="#1cb0f6" />
            <ellipse cx="140" cy="115" rx="4" ry="7" fill="#1cb0f6" />
          </>
        ) : (
          <>
            {/* Studying / Glasses */}
            <circle cx="70" cy="98" r="13" fill="#3b2b1a" />
            <circle cx="130" cy="98" r="13" fill="#3b2b1a" />
            <circle cx="67" cy="94" r="4.5" fill="#ffffff" />
            <circle cx="127" cy="94" r="4.5" fill="#ffffff" />
          </>
        )}

        {/* Orange Beak */}
        <polygon points="100,104 88,118 112,118" fill="url(#beakGrad)" filter="url(#dropShadow)" />
        <path d="M92 114 Q100 119 108 114" stroke="#d97706" strokeWidth="2" fill="none" />

        {/* Blush Cheeks */}
        {(mood === 'happy' || mood === 'celebrating' || mood === 'waving') && (
          <>
            <ellipse cx="48" cy="112" rx="9" ry="5" fill="#ff7676" fillOpacity="0.45" />
            <ellipse cx="152" cy="112" rx="9" ry="5" fill="#ff7676" fillOpacity="0.45" />
          </>
        )}

        {/* Academic IELTS Graduation Cap for Academic Vibe */}
        <g transform="translate(100, 52)">
          {/* Mortarboard Diamond Top */}
          <polygon points="0,-18 42,0 0,14 -42,0" fill="#1e293b" />
          <polygon points="0,-18 42,0 0,-8 -42,0" fill="#334155" />
          {/* Cap Skull base */}
          <path d="M-22 1 C-22 12, 22 12, 22 1 Z" fill="#0f172a" />
          {/* Golden Button & Tassel */}
          <circle cx="0" cy="-2" r="3" fill="#ffc800" />
          <path d="M0 -2 Q24 2 28 20" stroke="#ffc800" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <polygon points="26,18 30,18 31,27 25,27" fill="#e5a500" />
        </g>
      </svg>
    </div>
  );
};
