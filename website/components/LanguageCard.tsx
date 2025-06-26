import React, { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { 
  SiPython, 
  SiJavascript, 
  SiGnubash
} from 'react-icons/si';
import { VscTerminalPowershell } from 'react-icons/vsc';

interface LanguageCardProps {
  name: string;
  count: number;
  color: string;
  repoPath: string;
  index: number;
}

const LanguageCard: React.FC<LanguageCardProps> = ({
  name,
  count,
  color,
  repoPath,
  index
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Get the appropriate icon for each language with theme-aware styling
  const getLanguageIcon = (language: string) => {
    const iconSize = 48;
    const baseClasses = "transition-all duration-300";
    
    switch (language.toLowerCase()) {
      case 'python':
        return <SiPython size={iconSize} className={`${baseClasses} text-[#3776ab] hover:text-[#2d5aa0]`} />;
      case 'javascript':
        return <SiJavascript size={iconSize} className={`${baseClasses} text-[#f7df1e] hover:text-[#f5d914]`} />;
      case 'bash':
        return <SiGnubash size={iconSize} className={`${baseClasses} text-[#4eaa25] hover:text-[#3d8b1f]`} />;
      case 'powershell':
        return <VscTerminalPowershell size={iconSize} className={`${baseClasses} text-[#5391fe] hover:text-[#3d7bd6]`} />;
      default:
        return (
          <div className="w-12 h-12 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary font-bold text-xl transition-all duration-300 hover:bg-primary/30">
            {language.charAt(0).toUpperCase()}
          </div>
        );
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateXValue = (mouseY / rect.height) * -15;
    const rotateYValue = (mouseX / rect.width) * 15;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const handleClick = () => {
    window.open(repoPath, '_blank');
  };

  return (
    <Card 
      ref={cardRef}
      className="language-card text-center bg-card/60 backdrop-blur-xl border border-border/50 hover:bg-card/80 hover:border-border transition-all duration-500 group cursor-pointer relative overflow-hidden"
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
        transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        animationDelay: `${index * 200}ms`,
        transformStyle: 'preserve-3d',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
    >
      {/* Gradient background effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent 
        className="pt-8 pb-6 relative z-10"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Icon container with hover effect */}
        <div 
          className="relative mb-6 flex flex-col items-center"
          style={{
            transform: isHovered ? 'translateZ(30px)' : 'translateZ(0px)',
            transition: isHovered ? 'none' : 'transform 0.5s ease'
          }}
        >
          {/* Icon with theme-aware background */}
          <div className="w-20 h-20 mx-auto mb-3 rounded-2xl flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-all duration-300 bg-background/60 backdrop-blur border border-border/30 group-hover:border-border/60 group-hover:bg-background/80">
            <div 
              className="relative z-10 flex items-center justify-center"
              style={{
                transform: isHovered ? 'translateZ(20px)' : 'translateZ(0px)',
                transition: isHovered ? 'none' : 'transform 0.5s ease'
              }}
            >
              {getLanguageIcon(name)}
            </div>
            
            {/* Language name overlay on hover */}
            <div 
              className={`absolute inset-0 flex items-center justify-center bg-background/95 backdrop-blur-sm transition-all duration-300 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <span className="text-sm font-semibold text-foreground">
                {name}
              </span>
            </div>
          </div>
          
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Script count with enhanced styling */}
        <div 
          className="text-center"
          style={{
            transform: isHovered ? 'translateZ(25px)' : 'translateZ(0px)',
            transition: isHovered ? 'none' : 'transform 0.5s ease'
          }}
        >
          <div className="mb-2">
            <span className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              {count}
            </span>
          </div>
          <p className="text-muted-foreground font-medium text-sm">
            {count === 1 ? 'script' : 'scripts'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LanguageCard;
