import React, { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { NervaLogo } from '@/components/NervaLogo';

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

  const getGradientColors = (color: string) => {
    switch (color) {
      case 'bg-blue-500':
        return 'from-blue-400 to-blue-600';
      case 'bg-yellow-500':
        return 'from-yellow-400 to-orange-500';
      case 'bg-green-500':
        return 'from-green-400 to-emerald-600';
      case 'bg-purple-500':
        return 'from-purple-400 to-purple-600';
      default:
        return 'from-primary to-secondary';
    }
  };

  return (
    <Card 
      ref={cardRef}
      className="language-card text-center bg-card border border-border backdrop-blur-xl hover:bg-card/80 transition-all duration-500 group cursor-pointer"
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
      onClick={() => window.open(repoPath, '_blank')}
    >
      <CardContent 
        className="pt-8 pb-6"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        <div 
          className="relative mb-6"
          style={{
            transform: isHovered ? 'translateZ(30px)' : 'translateZ(0px)',
            transition: isHovered ? 'none' : 'transform 0.5s ease'
          }}
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-300">
            <div className={`absolute inset-0 bg-gradient-to-br ${getGradientColors(color)} rounded-2xl`}></div>
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            <div 
              className="relative z-10"
              style={{
                transform: isHovered ? 'translateZ(20px)' : 'translateZ(0px)',
                transition: isHovered ? 'none' : 'transform 0.5s ease'
              }}
            >
              <NervaLogo size={32} />
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <h4 
          className="font-bold text-xl text-foreground mb-2"
          style={{
            transform: isHovered ? 'translateZ(25px)' : 'translateZ(0px)',
            transition: isHovered ? 'none' : 'transform 0.5s ease'
          }}
        >
          {name}
        </h4>
        <p 
          className="text-muted-foreground font-medium"
          style={{
            transform: isHovered ? 'translateZ(20px)' : 'translateZ(0px)',
            transition: isHovered ? 'none' : 'transform 0.5s ease'
          }}
        >
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {count}
          </span>
          <span className="ml-1">scripts</span>
        </p>
      </CardContent>
    </Card>
  );
};

export default LanguageCard;
