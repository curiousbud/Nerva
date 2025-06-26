'use client'

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { NervaLogo } from '@/components/NervaLogo';
import { Home, RefreshCw, AlertTriangle, ArrowLeft } from 'lucide-react';

interface ErrorPageProps {
  title?: string;
  message?: string;
  showRefresh?: boolean;
  showHome?: boolean;
  showBack?: boolean;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  title = "Something went wrong",
  message = "We encountered an unexpected error. Please try again.",
  showRefresh = true,
  showHome = true,
  showBack = true
}) => {
  const handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-background to-orange-500/5"></div>
      
      {/* Floating elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-destructive/10 to-orange-500/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-br from-accent/10 to-primary/10 rounded-full blur-2xl animate-bounce" style={{animationDuration: "3s"}}></div>
      <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-gradient-to-br from-secondary/15 to-accent/15 rounded-full blur-lg animate-pulse" style={{animationDelay: "1s"}}></div>
      
      {/* Theme toggle in top right */}
      <div className="absolute top-6 right-6 z-50">
        <ThemeToggle />
      </div>
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Link href="/" className="transform hover:scale-105 transition-all duration-500">
            <NervaLogo className="w-20 h-20" />
          </Link>
        </div>
        
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-destructive/20 to-orange-500/20 flex items-center justify-center animate-pulse">
              <AlertTriangle className="w-16 h-16 text-destructive/70" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-destructive/30 animate-ping"></div>
          </div>
        </div>
        
        {/* Error Text */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {title}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            {message}
          </p>
          <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-sm text-destructive/80">
              If this problem persists, please check your internet connection or try again later.
            </p>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {showRefresh && (
            <Button onClick={handleRefresh} size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          )}
          
          {showHome && (
            <Button asChild variant="outline" size="lg">
              <Link href="/">
                <Home className="w-4 h-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          )}
          
          {showBack && (
            <Button asChild variant="ghost" size="lg">
              <Link href="/">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Link>
            </Button>
          )}
        </div>
        
        {/* Additional info */}
        <div className="mt-12 text-xs text-muted-foreground/70">
          💡 Tip: Most errors are temporary. A simple refresh often solves the problem!
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
