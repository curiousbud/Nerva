'use client'

import React from 'react';
import { NervaLogo } from './NervaLogo';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Memoized LoadingSpinner for better performance
export const LoadingSpinner: React.FC<LoadingSpinnerProps> = React.memo(({ 
  size = 'md', 
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} will-change-transform`}>
      <div className="relative">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-primary/20"></div>
        {/* Spinning ring - hardware accelerated */}
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin transform-gpu"></div>
        {/* Inner pulse - hardware accelerated */}
        <div className="absolute inset-1 rounded-full bg-primary/10 animate-pulse transform-gpu"></div>
      </div>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

interface LoadingPageProps {
  title?: string;
  subtitle?: string;
  showLogo?: boolean;
}

// Memoized LoadingPage for better performance
export const LoadingPage: React.FC<LoadingPageProps> = React.memo(({
  title = "Loading...",
  subtitle = "Please wait while we load your content",
  showLogo = true
}) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Optimized background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
      
      {/* Optimized floating elements with hardware acceleration */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-xl animate-pulse transform-gpu"></div>
      <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-2xl animate-bounce transform-gpu" style={{animationDuration: "3s"}}></div>
      <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-gradient-to-br from-secondary/15 to-accent/15 rounded-full blur-lg animate-pulse transform-gpu" style={{animationDelay: "1s"}}></div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-md mx-auto px-6">
        {showLogo && (
          <div className="mb-8 flex justify-center">
            <div className="transform hover:scale-105 transition-all duration-500 will-change-transform">
              <NervaLogo className="w-16 h-16" />
            </div>
          </div>
        )}
        
        {/* Loading spinner */}
        <div className="mb-8 flex justify-center">
          <LoadingSpinner size="lg" />
        </div>
        
        {/* Text with optimized animations */}
        <h2 className="text-2xl font-bold text-foreground mb-4 animate-pulse will-change-transform">
          {title}
        </h2>
        <p className="text-muted-foreground animate-pulse will-change-opacity" style={{animationDelay: "0.5s"}}>
          {subtitle}
        </p>
        
        {/* Progress dots with hardware acceleration */}
        <div className="flex justify-center space-x-2 mt-8">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce transform-gpu"></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce transform-gpu" style={{animationDelay: "0.2s"}}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce transform-gpu" style={{animationDelay: "0.4s"}}></div>
        </div>
      </div>
    </div>
  );
});

LoadingPage.displayName = 'LoadingPage';

export default LoadingPage;
