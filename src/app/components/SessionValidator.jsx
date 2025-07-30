// components/SessionValidator.tsx
'use client'

import { useEffect } from 'react'
import { useUser, useClerk } from '@clerk/nextjs'

export default function SessionValidator() {
  const { user, isSignedIn, isLoaded } = useUser()
  const { signOut } = useClerk()

  useEffect(() => {
    if (isLoaded && isSignedIn && !user) {
      // Session is invalid or user is deleted
      signOut()
    }
  }, [user, isSignedIn, isLoaded, signOut])

  return null
}
