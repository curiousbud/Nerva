import React from 'react'

interface ScriptHubLogoProps {
  className?: string
  size?: number
}

export const ScriptHubLogo: React.FC<ScriptHubLogoProps> = ({ 
  className = "", 
  size = 32 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Outer circle with gradient */}
      <circle
        cx="32"
        cy="32"
        r="30"
        fill="url(#logoGradient)"
        stroke="url(#strokeGradient)"
        strokeWidth="2"
      />
      
      {/* Code brackets */}
      <path
        d="M18 24L12 32L18 40"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M46 24L52 32L46 40"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      
      {/* Central script/code symbol */}
      <path
        d="M28 22L36 42"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      
      {/* Network nodes (representing hub) */}
      <circle cx="24" cy="16" r="2" fill="white" opacity="0.8" />
      <circle cx="40" cy="16" r="2" fill="white" opacity="0.8" />
      <circle cx="48" cy="32" r="2" fill="white" opacity="0.8" />
      <circle cx="40" cy="48" r="2" fill="white" opacity="0.8" />
      <circle cx="24" cy="48" r="2" fill="white" opacity="0.8" />
      <circle cx="16" cy="32" r="2" fill="white" opacity="0.8" />
      
      {/* Connection lines (subtle) */}
      <path
        d="M24 16L32 24M40 16L32 24M48 32L40 32M40 48L32 40M24 48L32 40M16 32L24 32"
        stroke="white"
        strokeWidth="1"
        opacity="0.3"
      />

      {/* Gradient definitions */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="50%" stopColor="#a855f7" />
          <stop offset="100%" stopColor="#c084fc" />
        </linearGradient>
        <linearGradient id="strokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#9333ea" />
        </linearGradient>
      </defs>
    </svg>
  )
}
