import React, { useRef, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code, Star, GitFork, ExternalLink } from 'lucide-react';

interface ScriptCardProps {
  name: string;
  description: string;
  language: string;
  tags: string[];
  category: string;
  status: 'available' | 'in-progress';
  onViewScript?: () => void;
}

const ScriptCard: React.FC<ScriptCardProps> = ({
  name,
  description,
  language,
  tags,
  category,
  status,
  onViewScript
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const getLanguageColor = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'python': return '#3776ab';
      case 'javascript': return '#f7df1e';
      case 'bash': return '#4eaa25';
      case 'powershell': return '#5391fe';
      default: return '#8b5cf6';
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
    
    const rotateXValue = (mouseY / rect.height) * -20;
    const rotateYValue = (mouseX / rect.width) * 20;
    
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

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when button is clicked
    if (onViewScript && status === 'available') {
      onViewScript();
    }
  };

  return (
    <div 
      ref={cardRef}
      className="script-card"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: isHovered 
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)',
        transition: isHovered ? 'none' : 'transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}
    >
      <div className="top-section">
        <div className="border" />
        <div className="icons">
          <div className="logo">
            <Code size={20} />
          </div>
          <div className="actions">
            <Star size={16} />
            <GitFork size={16} />
            <ExternalLink size={16} />
          </div>
        </div>
      </div>
      
      <div className="content-section" style={{
        transform: isHovered ? 'translateZ(30px)' : 'translateZ(0px)',
        transition: isHovered ? 'none' : 'transform 0.5s ease'
      }}>
        <span className="script-title">{name}</span>
        <p className="script-description">{description}</p>
        
        <div className="script-tags">
          {tags.slice(0, 3).map((tag, index) => (
            <span 
              key={index} 
              className="script-tag"
              style={{
                transform: isHovered ? `translateZ(${20 + index * 5}px)` : 'translateZ(0px)',
                transition: isHovered ? 'none' : 'transform 0.5s ease'
              }}
            >
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span 
              className="script-tag"
              style={{
                transform: isHovered ? 'translateZ(35px)' : 'translateZ(0px)',
                transition: isHovered ? 'none' : 'transform 0.5s ease'
              }}
            >
              +{tags.length - 3}
            </span>
          )}
        </div>
      </div>
      
      <div className="bottom-section" style={{
        transform: isHovered ? 'translateZ(25px)' : 'translateZ(0px)',
        transition: isHovered ? 'none' : 'transform 0.5s ease'
      }}>
        <div className="language-info">
          <div 
            className="language-dot" 
            style={{ 
              backgroundColor: getLanguageColor(language),
              transform: isHovered ? 'translateZ(10px)' : 'translateZ(0px)',
              transition: isHovered ? 'none' : 'transform 0.5s ease'
            }}
          />
          <span className="language-name">{language}</span>
        </div>
        
        <button 
          className="view-button"
          onClick={handleButtonClick}
          disabled={status === 'in-progress'}
          style={{
            transform: isHovered ? 'translateZ(40px)' : 'translateZ(0px)',
            transition: isHovered ? 'none' : 'transform 0.5s ease'
          }}
        >
          {status === 'available' ? 'View Script' : 'Coming Soon'}
        </button>
      </div>
    </div>
  );
};

export default ScriptCard;
