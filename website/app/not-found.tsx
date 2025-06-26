'use client'

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { NervaLogo } from '@/components/NervaLogo';
import { Home, ArrowLeft, Search, FileX } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5"></div>
      
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
        <div className="mb-16 flex justify-center">
          <Link href="/" className="transform hover:scale-105 transition-all duration-500">
            <NervaLogo className="w-24 h-24" />
          </Link>
        </div>
        
        {/* 404 Icon */}
        <div className="mb-12 flex justify-center">
          <div className="relative">
            <div className="w-36 h-36 rounded-full bg-gradient-to-br from-destructive/20 to-orange-500/20 flex items-center justify-center animate-pulse">
              <FileX className="w-18 h-18 text-destructive/70" />
            </div>
            <div className="absolute inset-0 rounded-full border-2 border-destructive/30 animate-spin" style={{animationDuration: "3s"}}></div>
          </div>
        </div>
        
        {/* 404 Text */}
        <div className="mb-12">
          <h1 className="text-8xl font-black text-transparent bg-gradient-to-r from-destructive via-orange-500 to-destructive bg-clip-text mb-4 animate-pulse">
            404
          </h1>
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground mb-2">
            The script you're looking for seems to have vanished into the digital void.
          </p>
          <p className="text-muted-foreground">
            Don't worry, even the best developers encounter 404s. Let's get you back on track!
          </p>
        </div>
        
        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90">
            <Link href="/">
              <Home className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          
          <Button asChild variant="outline" size="lg">
            <Link href="/scripts">
              <Search className="w-4 h-4 mr-2" />
              Browse Scripts
            </Link>
          </Button>
          
          <Button asChild variant="ghost" size="lg">
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Link>
          </Button>
        </div>
        
        {/* Additional info */}
        <div className="mt-12 p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border/50">
          <h3 className="text-lg font-semibold text-foreground mb-3">
            What can you do instead?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Explore our script collection</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-secondary rounded-full"></div>
              <span>Check out featured automation tools</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full"></div>
              <span>Contribute your own scripts</span>
            </div>
          </div>
        </div>
        
        {/* Fun fact */}
        <div className="mt-8 text-xs text-muted-foreground/70">
          💡 Fun fact: The 404 error was named after room 404 at CERN, where the World Wide Web was born!
        </div>
      </div>
    </div>
  );
}
