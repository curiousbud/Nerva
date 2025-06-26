'use client'

import React from 'react';
import { NervaLogo } from './NervaLogo';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="relative">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
        {/* Spinning ring */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"></div>
        {/* Inner pulse */}
        <div className="absolute inset-1 rounded-full bg-primary/10 animate-pulse"></div>
      </div>
    </div>
  );
};

interface LoadingPageProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
}

export const LoadingPage: React.FC<LoadingPageProps> = ({
  title = "Loading...",
  subtitle = "Please wait while we load your content",
  showLogo = true
}) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-2xl animate-bounce" style={{animationDuration: "3s"}}></div>
      <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-gradient-to-br from-secondary/15 to-accent/15 rounded-full blur-lg animate-pulse" style={{animationDelay: "1s"}}></div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {showLogo && (
          <div className="mb-8 flex justify-center">
            <div className="transform hover:scale-105 transition-all duration-500">
              <NervaLogo className="w-16 h-16" />
            </div>
          </div>
        )}
        
        {/* Loading spinner */}
        <div className="mb-8 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
        
        {/* Text */}
        <h2 className="text-2xl font-bold text-foreground mb-4 animate-pulse">
          {title}
        </h2>
        <p className="text-muted-foreground animate-pulse" style={{animationDelay: "0.5s"}}>
          {subtitle}
        </p>
        
        {/* Progress dots */}
        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: "0.2s"}}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{animationDelay: "0.4s"}}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingPage;
