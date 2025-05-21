import { useEffect, useRef, useState } from 'react'
import { useSession } from '@clerk/clerk-react'
import {
  EmailCodeFactor,
  SessionVerificationLevel,
  SessionVerificationResource,
} from '@clerk/types'
import React from 'react'

export function VerificationComponent({
  level = 'first_factor',
  onComplete,
  onCancel,
}: {
  level: SessionVerificationLevel | undefined
  onComplete: () => void
  onCancel: () => void
}) {
  const { session } = useSession()
  const [code, setCode] = useState<string>('')
  const reverificationRef = useRef<SessionVerificationResource | undefined>(undefined)
  const [determinedStartingFirstFactor, setDeterminedStartingFirstFactor] = useState<
    EmailCodeFactor | undefined
  >()

  useEffect(() => {
    if (reverificationRef.current) {
      return
    }

    session?.startVerification({ level }).then(async (response) => {
      reverificationRef.current = response
      await prepareEmailVerification(response)
    })
  }, [])

  const prepareEmailVerification = async (verificationResource: SessionVerificationResource) => {
    
    if (verificationResource.status === 'needs_first_factor') {
      
      const determinedStartingFirstFactor = verificationResource.supportedFirstFactors?.filter(
        (factor) => factor.strategy === 'email_code',
      )[0]

      if (determinedStartingFirstFactor) {
        setDeterminedStartingFirstFactor(determinedStartingFirstFactor)
        
        await session?.prepareFirstFactorVerification({
          strategy: determinedStartingFirstFactor.strategy,
          emailAddressId: determinedStartingFirstFactor?.emailAddressId,
        })
      }
    }
  }

  const handleVerificationAttempt = async () => {
    try {
      
      await session?.attemptFirstFactorVerification({
        strategy: 'email_code',
        code
      })
      onComplete()
    } catch (e) {
      
      console.error('Error verifying session', e)
    }
  }

  if (!determinedStartingFirstFactor) {
    return null
  }

  return (
    <div>
      <p>Enter verification code sent to {determinedStartingFirstFactor.safeIdentifier || ''}</p>
      <input type="number" name="code" onChange={(e) => setCode(e.target.value)} />
      <button onClick={async () => handleVerificationAttempt()}>Complete</button>
      <button onClick={() => onCancel()}>Cancel</button>
    </div>
  )
}