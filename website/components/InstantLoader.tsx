'use client'

import { useEffect, useState } from 'react'
import LoadingPage from './LoadingPage'

export default function InstantLoader() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Show loading immediately
    setIsLoading(true)
    
    // Hide after a very short time to ensure smooth transition
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <LoadingPage 
        title="Loading Nerva Scripts"
        subtitle="Discovering powerful automation tools for you..."
      />
    </div>
  )
}
