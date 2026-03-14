import React from 'react';

// Minimalist line illustrations inspired by the reference UI
// Each illustration is a simple SVG that feels hand-drawn and playful

export function PlantIllustration({ className = '', size = 120 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
      {/* Pot */}
      <path d="M40 85 L50 105 L70 105 L80 85" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" fill="#fff9c4" />
      <ellipse cx="60" cy="85" rx="20" ry="4" fill="#fffde7" stroke="#1a1a2e" strokeWidth="1.5" />
      {/* Stem */}
      <path d="M60 85 C60 65 55 55 60 40" stroke="#66bb6a" strokeWidth="2" strokeLinecap="round" fill="none" />
      {/* Left leaf */}
      <path d="M60 60 C45 50 40 55 38 48 C36 41 42 36 55 50" stroke="#66bb6a" strokeWidth="1.5" fill="#c8e6c9" />
      {/* Right leaf */}
      <path d="M60 50 C72 38 78 40 80 35 C82 30 76 26 65 42" stroke="#66bb6a" strokeWidth="1.5" fill="#c8e6c9" />
      {/* Top leaf */}
      <path d="M60 40 C55 28 58 20 60 15 C62 20 65 28 60 40" stroke="#66bb6a" strokeWidth="1.5" fill="#e8f5e9" />
    </svg>
  );
}

export function QRScanIllustration({ className = '', size = 120 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
      {/* Phone body */}
      <rect x="35" y="15" width="50" height="90" rx="8" stroke="#1a1a2e" strokeWidth="2" fill="#f5f0e8" />
      <rect x="40" y="25" width="40" height="65" rx="4" fill="white" stroke="#1a1a2e" strokeWidth="1" />
      {/* QR code pattern */}
      <rect x="48" y="35" width="10" height="10" fill="#1a1a2e" rx="1" />
      <rect x="62" y="35" width="10" height="10" fill="#1a1a2e" rx="1" />
      <rect x="48" y="55" width="10" height="10" fill="#1a1a2e" rx="1" />
      <rect x="55" y="48" width="10" height="10" fill="#d4c5f9" rx="1" />
      <rect x="62" y="55" width="10" height="10" fill="#9c7ce6" rx="1" />
      {/* Scan lines */}
      <line x1="38" y1="58" x2="82" y2="58" stroke="#ef8e73" strokeWidth="2" strokeDasharray="3,3" opacity="0.8" />
      {/* Camera dot */}
      <circle cx="60" cy="19" r="2" fill="#5a5a72" />
    </svg>
  );
}

export function FoundItemIllustration({ className = '', size = 140 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 140 140" fill="none" className={className}>
      {/* Character body */}
      <circle cx="70" cy="45" r="18" fill="#fffde7" stroke="#1a1a2e" strokeWidth="2" />
      {/* Eyes */}
      <circle cx="63" cy="42" r="2" fill="#1a1a2e" />
      <circle cx="77" cy="42" r="2" fill="#1a1a2e" />
      {/* Smile */}
      <path d="M65 50 Q70 55 75 50" stroke="#1a1a2e" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      {/* Body */}
      <path d="M55 63 Q70 68 85 63 L82 100 Q70 105 58 100 Z" fill="#d4c5f9" stroke="#1a1a2e" strokeWidth="1.5" />
      {/* Arms holding box */}
      <path d="M55 72 L40 82" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
      <path d="M85 72 L100 82" stroke="#1a1a2e" strokeWidth="2" strokeLinecap="round" />
      {/* Box */}
      <rect x="38" y="82" width="64" height="35" rx="4" fill="#c8e6c9" stroke="#1a1a2e" strokeWidth="1.5" />
      <line x1="38" y1="92" x2="102" y2="92" stroke="#1a1a2e" strokeWidth="1" />
      {/* Box opening flaps */}
      <path d="M38 82 L50 74 L70 80 L90 74 L102 82" stroke="#1a1a2e" strokeWidth="1.5" fill="#e8f5e9" />
      {/* Stars */}
      <circle cx="25" cy="40" r="3" fill="#f5c842" opacity="0.7" />
      <circle cx="115" cy="35" r="2" fill="#ef8e73" opacity="0.6" />
      <circle cx="110" cy="55" r="3" fill="#bbdefb" opacity="0.5" />
    </svg>
  );
}

export function EmptyStateIllustration({ className = '', size = 160 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 160 160" fill="none" className={className}>
      {/* Magnifying glass */}
      <circle cx="68" cy="65" r="28" stroke="#9c7ce6" strokeWidth="3" fill="none" opacity="0.4" />
      <circle cx="68" cy="65" r="22" stroke="#d4c5f9" strokeWidth="2" fill="#ede7fb" opacity="0.3" />
      <line x1="88" y1="85" x2="110" y2="107" stroke="#9c7ce6" strokeWidth="3" strokeLinecap="round" opacity="0.4" />
      {/* Question mark */}
      <text x="60" y="74" fontFamily="Inter" fontSize="24" fontWeight="700" fill="#9c7ce6" opacity="0.5">?</text>
      {/* Decorative dots */}
      <circle cx="30" cy="40" r="4" fill="#c8e6c9" opacity="0.4" />
      <circle cx="130" cy="50" r="6" fill="#fff9c4" opacity="0.5" />
      <circle cx="120" cy="120" r="5" fill="#ffcdd2" opacity="0.4" />
      <circle cx="35" cy="120" r="3" fill="#bbdefb" opacity="0.5" />
    </svg>
  );
}

export function SuccessIllustration({ className = '', size = 120 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" className={className}>
      {/* Circle */}
      <circle cx="60" cy="60" r="40" fill="#e8f5e9" stroke="#66bb6a" strokeWidth="2" />
      {/* Checkmark */}
      <path d="M40 60 L52 72 L80 44" stroke="#66bb6a" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Sparkles */}
      <circle cx="20" cy="30" r="3" fill="#f5c842" opacity="0.7" />
      <circle cx="100" cy="25" r="2" fill="#ef8e73" opacity="0.6" />
      <circle cx="95" cy="95" r="4" fill="#d4c5f9" opacity="0.5" />
      <circle cx="15" cy="85" r="2.5" fill="#bbdefb" opacity="0.6" />
    </svg>
  );
}

export function ShieldIllustration({ className = '', size = 48 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M24 4 L40 12 L40 24 C40 34 32 42 24 44 C16 42 8 34 8 24 L8 12 Z"
        fill="#e8f5e9"
        stroke="#66bb6a"
        strokeWidth="1.5"
      />
      <path d="M17 24 L22 29 L31 19" stroke="#66bb6a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

export function MapPinIllustration({ className = '', size = 48 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" className={className}>
      <path
        d="M24 4 C15.2 4 8 11.2 8 20 C8 32 24 44 24 44 C24 44 40 32 40 20 C40 11.2 32.8 4 24 4Z"
        fill="#fce4ec"
        stroke="#ef8e73"
        strokeWidth="1.5"
      />
      <circle cx="24" cy="20" r="6" fill="white" stroke="#ef8e73" strokeWidth="1.5" />
    </svg>
  );
}
