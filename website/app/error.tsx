'use client'

import React from 'react'
import ErrorPage from '@/components/ErrorPage'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  React.useEffect(() => {
    console.error('Runtime Error:', error)
  }, [error])

  return (
    <ErrorPage
      title="Oops! Something went wrong"
      message="We encountered an unexpected error. This is usually temporary."
      showRefresh={true}
      showHome={true}
      showBack={false}
    />
  )
}
