import React, { useState } from 'react';
import { 
  SiPython, 
  SiJavascript, 
  SiGnubash 
} from 'react-icons/si';
import { VscTerminalPowershell } from 'react-icons/vsc';
import { FaTerminal } from 'react-icons/fa';

interface LanguageIconProps {
  language: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const LanguageIcon: React.FC<LanguageIconProps> = ({ 
  language, 
  size = 'md', 
  showLabel = false,
  className = '' 
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const getLanguageConfig = (lang: string) => {
    const normalizedLang = lang.toLowerCase();
    
    const configs: Record<string, {
      icon: React.ComponentType<any>;
      color: string;
      name: string;
    }> = {
      python: {
        icon: SiPython,
        color: '#3776ab',
        name: 'Python'
      },
      javascript: {
        icon: SiJavascript,
        color: '#f7df1e',
        name: 'JavaScript'
      },
      bash: {
        icon: SiGnubash,
        color: '#4eaa25',
        name: 'Bash'
      },
      powershell: {
        icon: VscTerminalPowershell,
        color: '#5391fe',
        name: 'PowerShell'
      }
    };

    return configs[normalizedLang] || {
      icon: FaTerminal,
      color: '#8b5cf6',
      name: lang.charAt(0).toUpperCase() + lang.slice(1)
    };
  };

  const config = getLanguageConfig(language);
  const IconComponent = config.icon;
  
  const sizeClasses = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-8 h-8 text-base',
    lg: 'w-12 h-12 text-xl'
  };

  const iconSizes = {
    sm: 'text-xs',
    md: 'text-sm', 
    lg: 'text-lg'
  };

  return (
    <div className="relative inline-block">
      <div
        className={`
          ${sizeClasses[size]} 
          bg-background/60 
          backdrop-blur 
          border border-border/30
          hover:border-border/60
          hover:bg-background/80
          rounded-full 
          flex items-center justify-center 
          transition-all duration-300 ease-in-out
          hover:scale-110 hover:shadow-lg
          cursor-pointer
          ${className}
        `}
        style={{ 
          boxShadow: isHovered ? `0 4px 20px ${config.color}20` : undefined
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        title={config.name}
        role="img"
        aria-label={`${config.name} language`}
      >
        <IconComponent 
          className={iconSizes[size]} 
          style={{ color: config.color }} 
        />
      </div>
      
      {/* Hover Label */}
      {isHovered && (
        <div 
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50"
          style={{ animation: 'fadeInUp 0.2s ease-out' }}
        >
          <div 
            className="px-2 py-1 rounded-md text-xs font-medium text-white shadow-lg whitespace-nowrap"
            style={{ backgroundColor: config.color }}
          >
            {config.name}
            <div 
              className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent"
              style={{ borderTopColor: config.color }}
            />
          </div>
        </div>
      )}
      
      {/* Always Visible Label (optional) */}
      {showLabel && !isHovered && (
        <span className="ml-2 text-sm font-medium text-muted-foreground">
          {config.name}
        </span>
      )}
      
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px) translateX(-50%);
          }
          to {
            opacity: 1;
            transform: translateY(0) translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};

export default LanguageIcon;
