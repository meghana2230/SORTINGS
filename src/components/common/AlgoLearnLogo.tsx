import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  variant?: 'full' | 'icon-only' | 'horizontal';
  onClick?: () => void;
}

export const AlgoLearnIcon: React.FC<{ className?: string; size?: number | string }> = ({
  className = 'w-9 h-9',
  size,
}) => {
  const style = size ? { width: size, height: size } : undefined;

  return (
    <svg
      viewBox="0 0 100 86"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 ${className}`}
      style={style}
      aria-label="AlgoLearn Cap Logo"
    >
      <defs>
        {/* Top diamond gradient - deep royal blue to indigo/purple */}
        <linearGradient id="capTopGrad" x1="12" y1="10" x2="88" y2="46" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e3a8a" />
          <stop offset="35%" stopColor="#2563eb" />
          <stop offset="70%" stopColor="#4f46e5" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>

        {/* Lower base gradient - royal blue with vibrant purple shift */}
        <linearGradient id="capBaseGrad" x1="18" y1="36" x2="74" y2="72" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1e40af" />
          <stop offset="35%" stopColor="#3b82f6" />
          <stop offset="70%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>

        {/* Cap rim/depth gradient */}
        <linearGradient id="capRimGrad" x1="8" y1="30" x2="88" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="50%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>

        {/* Tassel gradient */}
        <linearGradient id="tasselGrad" x1="72" y1="28" x2="82" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563eb" />
          <stop offset="50%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>

        {/* Soft shadow filter */}
        <filter id="capShadow" x="0" y="0" width="100" height="90" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#6366f1" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* 1. Base / Skull Box (Glowing rounded 3D lower structure) */}
      <g filter="url(#capShadow)">
        {/* Left side depth of base */}
        <path
          d="M 20 40 
             L 20 54 
             C 20 63 31 70 48 70 
             C 65 70 76 63 76 54 
             L 76 40 
             C 70 44 59 47 48 47 
             C 37 47 26 44 20 40 Z"
          fill="url(#capBaseGrad)"
        />
      </g>

      {/* 2. Mortarboard Diamond Cap 3D Thickness Rim */}
      <path
        d="M 8 30 
           L 48 51 
           L 88 30 
           L 88 33 
           L 48 54 
           L 8 33 Z"
        fill="url(#capRimGrad)"
      />

      {/* 3. Top Mortarboard Diamond Surface */}
      <path
        d="M 48 8 
           L 88 30 
           L 48 51 
           L 8 30 Z"
        fill="url(#capTopGrad)"
      />

      {/* 4. Tassel String, Bead & Drop Bulb on the Right */}
      {/* Tassel cord drape */}
      <path
        d="M 74 24 
           C 77 28 80 34 80 43 
           L 80 47"
        stroke="url(#tasselGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Tassel small ring/bead */}
      <circle cx="80" cy="48" r="2" fill="#4338ca" />
      {/* Tassel droplet bulb */}
      <path
        d="M 80 49 
           C 77.5 52 76 55 76 58 
           C 76 62 77.8 64 80 64 
           C 82.2 64 84 62 84 58 
           C 84 55 82.5 52 80 49 Z"
        fill="url(#tasselGrad)"
      />
    </svg>
  );
};

export const AlgoLearnLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showSubtitle = true,
  variant = 'full',
  onClick,
}) => {
  const sizeMap = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', sub: 'text-[8px] tracking-[0.25em]' },
    md: { icon: 'w-9 h-9', text: 'text-xl sm:text-2xl', sub: 'text-[9px] sm:text-[10px] tracking-[0.28em]' },
    lg: { icon: 'w-11 h-11', text: 'text-2xl sm:text-3xl', sub: 'text-[10px] sm:text-[11px] tracking-[0.3em]' },
    xl: { icon: 'w-14 h-14', text: 'text-3xl sm:text-4xl', sub: 'text-xs tracking-[0.32em]' },
  };

  const currentSize = sizeMap[size];

  if (variant === 'icon-only') {
    return (
      <div
        onClick={onClick}
        className={`inline-flex items-center justify-center ${onClick ? 'cursor-pointer' : ''} ${className}`}
      >
        <AlgoLearnIcon className={currentSize.icon} />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 sm:gap-3 select-none ${
        onClick ? 'cursor-pointer group' : ''
      } ${className}`}
    >
      <div className="transition-transform group-hover:scale-105 duration-200">
        <AlgoLearnIcon className={currentSize.icon} />
      </div>

      <div className="flex flex-col justify-center">
        <div className={`font-black tracking-tight leading-none ${currentSize.text} flex items-baseline`}>
          <span className="text-slate-900 dark:text-white font-extrabold">Algo</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-black">L</span>
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 bg-clip-text text-transparent font-black">
            earn
          </span>
        </div>

        {showSubtitle && (
          <div
            className={`font-extrabold uppercase text-slate-500 dark:text-slate-400 font-sans mt-0.5 sm:mt-1 leading-tight ${currentSize.sub}`}
          >
            YOUR DSA JOURNEY
          </div>
        )}
      </div>
    </div>
  );
};
