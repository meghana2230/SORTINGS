import React from 'react';

interface ChatbotLogoProps {
  className?: string;
  size?: number | string;
  onClick?: () => void;
}

export const ChatbotLogo: React.FC<ChatbotLogoProps> = ({
  className = '',
  size = 40,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative inline-flex items-center justify-center select-none cursor-pointer group transition-transform duration-200 hover:scale-105 active:scale-95 ${className}`}
      style={{ width: size, height: size }}
      role="button"
      aria-label="AlgoLearn AI Chatbot"
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm group-hover:drop-shadow-md transition-all duration-300"
      >
        <defs>
          {/* Blue-to-purple circular gradient matching reference image */}
          <linearGradient id="aiCircleGradient" x1="10%" y1="10%" x2="88%" y2="88%">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="35%" stopColor="#3b82f6" />
            <stop offset="70%" stopColor="#7c3aed" />
            <stop offset="100%" stopColor="#9333ea" />
          </linearGradient>
        </defs>

        {/* Outer Circular Gradient Background */}
        <circle cx="50" cy="50" r="48" fill="url(#aiCircleGradient)" />

        {/* White Chat-Bubble Icon with bottom-left pointer */}
        <path
          d="M 30.1 57.3
             A 22 22 0 1 1 38.3 66.7
             C 34.8 69.8 30.5 73.0 27.5 73.0
             C 25.5 73.0 24.8 70.8 26.2 67.2
             C 27.5 63.8 28.9 60.5 30.1 57.3 Z"
          fill="none"
          stroke="#ffffff"
          strokeWidth="5.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
