import React from 'react';
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
  const getLanguageColor = (lang: string) => {
    switch (lang.toLowerCase()) {
      case 'python': return '#3776ab';
      case 'javascript': return '#f7df1e';
      case 'bash': return '#4eaa25';
      case 'powershell': return '#5391fe';
      default: return '#8b5cf6';
    }
  };

  return (
    <div className="script-card">
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
      
      <div className="content-section">
        <span className="script-title">{name}</span>
        <p className="script-description">{description}</p>
        
        <div className="script-tags">
          {tags.slice(0, 3).map((tag, index) => (
            <span key={index} className="script-tag">
              {tag}
            </span>
          ))}
          {tags.length > 3 && (
            <span className="script-tag">
              +{tags.length - 3}
            </span>
          )}
        </div>
      </div>
      
      <div className="bottom-section">
        <div className="language-info">
          <div 
            className="language-dot" 
            style={{ backgroundColor: getLanguageColor(language) }}
          />
          <span className="language-name">{language}</span>
        </div>
        
        <button 
          className="view-button"
          onClick={onViewScript}
          disabled={status === 'in-progress'}
        >
          {status === 'available' ? 'View Script' : 'Coming Soon'}
        </button>
      </div>
    </div>
  );
};

export default ScriptCard;
