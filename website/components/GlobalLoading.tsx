"use client"

import { useEffect, useState, useCallback, useRef } from "react"
import { usePathname, useSearchParams } from "next/navigation"

export default function TopLoadingBar() {
  const [isLoading, setIsLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const pathname = usePathname()
  const searchParams = useSearchParams()
  
  // Use refs to prevent memory leaks and improve cleanup
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const completionTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Optimized progress calculation with better performance
  const updateProgress = useCallback(() => {
    setProgress(prev => {
      if (prev >= 88) return prev // Stop slightly earlier
      // More responsive progress curve
      const increment = prev < 30 ? Math.random() * 20 : 
                       prev < 60 ? Math.random() * 12 : 
                       Math.random() * 6
      return Math.min(prev + increment, 88)
    })
  }, [])

  // Cleanup function to prevent memory leaks
  const cleanup = useCallback(() => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }
    if (loadingTimeoutRef.current) {
      clearTimeout(loadingTimeoutRef.current)
      loadingTimeoutRef.current = null
    }
    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current)
      completionTimeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    // Clean up any existing timers first
    cleanup()
    
    // Start loading immediately with better initial progress
    setIsLoading(true)
    setProgress(25) // Start with more progress for better perception

    // More efficient progress updates
    progressIntervalRef.current = setInterval(updateProgress, 120) // Slightly faster updates

    // Even faster completion for snappier feel
    loadingTimeoutRef.current = setTimeout(() => {
      setProgress(100)
      // Quicker fade out
      completionTimeoutRef.current = setTimeout(() => {
        setIsLoading(false)
        setProgress(0)
      }, 120)
    }, 250) // Reduced from 300ms to 250ms

    return cleanup
  }, [pathname, searchParams, updateProgress, cleanup])

  if (!isLoading) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-muted/20">
      <div 
        className="h-full bg-gradient-to-r from-primary via-primary/80 to-secondary transition-all duration-150 ease-out will-change-transform"
        style={{ 
          width: `${progress}%`,
          transform: 'translateZ(0)', // Hardware acceleration
          boxShadow: '0 0 8px rgba(var(--primary), 0.4)' 
        }}
      />
    </div>
  )
}
