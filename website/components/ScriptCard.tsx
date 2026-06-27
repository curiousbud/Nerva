import React, { useRef, useState } from 'react';
import { Code, Star, GitFork, ExternalLink } from 'lucide-react';
import LanguageIcon from '@/components/LanguageIcon';
import { GITHUB_CONFIG } from '@/lib/github-config';
import type { ScriptVariant } from '@/lib/group';

interface ScriptCardProps {
  title: string;
  description: string;
  tags: string[];
  category: string;
  status?: 'available' | 'in-progress';
  /** Path to the tool folder (shows every language on GitHub). */
  repoPath: string;
  /** One entry per language this tool is available in (index 0 = primary). */
  variants: ScriptVariant[];
}

const ScriptCard: React.FC<ScriptCardProps> = ({
  title,
  description,
  tags,
  category,
  status = 'available',
  repoPath,
  variants,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const primary = variants[0];
  const isMultiLanguage = variants.length > 1;

  const resolveUrl = (path: string) =>
    path.includes('github.com')
      ? path
      : GITHUB_CONFIG.getScriptPath(path.replace(/\\/g, '/'));

  const openVariant = (e: React.MouseEvent, path: string) => {
    e.stopPropagation();
    window.open(resolveUrl(path), '_blank');
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const mouseX = e.clientX - (rect.left + rect.width / 2);
    const mouseY = e.clientY - (rect.top + rect.height / 2);
    setRotateX((mouseY / rect.height) * -16);
    setRotateY((mouseX / rect.width) * 16);
  };

  const handleMouseEnter = () => setIsHovered(true);

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const handleAction = (e: React.MouseEvent, action: 'star' | 'fork' | 'external') => {
    e.stopPropagation();
    if (action === 'star') window.open(GITHUB_CONFIG.BASE_URL, '_blank');
    else if (action === 'fork') window.open(GITHUB_CONFIG.FORK_URL, '_blank');
    else window.open(resolveUrl(repoPath), '_blank'); // open the tool folder
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
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(18px)`
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
            <div
              onClick={(e) => handleAction(e, 'star')}
              title="Star this repository"
              role="button"
              tabIndex={0}
              aria-label="Star repository"
              className="action-button"
            >
              <Star size={16} />
            </div>
            <div
              onClick={(e) => handleAction(e, 'fork')}
              title="Fork this repository"
              role="button"
              tabIndex={0}
              aria-label="Fork repository"
              className="action-button"
            >
              <GitFork size={16} />
            </div>
            <div
              onClick={(e) => handleAction(e, 'external')}
              title="View source code"
              role="button"
              tabIndex={0}
              aria-label="View source code"
              className="action-button"
            >
              <ExternalLink size={16} />
            </div>
          </div>
        </div>
      </div>

      <div
        className="content-section"
        style={{
          transform: isHovered ? 'translateZ(28px)' : 'translateZ(0px)',
          transition: isHovered ? 'none' : 'transform 0.5s ease',
        }}
      >
        <span className="script-title">{title}</span>
        <p className="script-description">{description}</p>

        <div className="script-tags">
          {category && <span className="script-tag">{category}</span>}
          {tags.slice(0, 2).map((tag, index) => (
            <span key={index} className="script-tag">
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div
        className="bottom-section"
        style={{
          transform: isHovered ? 'translateZ(24px)' : 'translateZ(0px)',
          transition: isHovered ? 'none' : 'transform 0.5s ease',
        }}
      >
        <div className="language-info">
          {/* Language tray: primary on top, the rest fan out on hover */}
          <div className="lang-tray" aria-label={`Available in ${variants.length} language(s)`}>
            {variants.map((variant, index) => (
              <button
                key={`${variant.language}-${index}`}
                className="lang-chip"
                style={{ zIndex: variants.length - index }}
                onClick={(e) => openVariant(e, variant.path)}
                title={`Open the ${variant.language} version`}
                aria-label={`Open the ${variant.language} version`}
              >
                <LanguageIcon language={variant.language} size="sm" />
              </button>
            ))}
          </div>
          <span className="language-name">
            {isMultiLanguage ? `${variants.length} languages` : primary.language}
          </span>
        </div>

        <button
          className="view-button"
          onClick={(e) => openVariant(e, repoPath)}
          disabled={status === 'in-progress'}
          style={{
            transform: isHovered ? 'translateZ(38px)' : 'translateZ(0px)',
            transition: isHovered ? 'none' : 'transform 0.5s ease',
          }}
        >
          {status === 'available' ? 'View Script' : 'Coming Soon'}
        </button>
      </div>
    </div>
  );
};

export default ScriptCard;
