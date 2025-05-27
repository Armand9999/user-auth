'use client'

import { useSignUp, useClerk } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EmailLinkErrorCodeStatus, isEmailLinkError } from '@clerk/nextjs/dist/types/errors'

export default function VerifyPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [verificationStatus, setVerificationStatus] = useState('loading') 
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const { handleEmailLinkVerification, loaded } = useClerk()

    async function verify() {
      try {
        // Dynamically set the host domain for dev and prod
        // You could instead use an environment variable or other source for the host domain
        const protocol = window.location.protocol
        const host = window.location.host

        await handleEmailLinkVerification({
          // URL to navigate to if sign-up flow needs more requirements, such as MFA
          redirectUrl: `${protocol}//${host}/sign-up`,
        })

        // If not redirected at this point,
        // the flow has completed
        setVerificationStatus('verified')
      } catch (err) {
        let status = 'failed'

      if (isEmailLinkError(err)) {
        // If link expired, set status to expired
        if (err.code === EmailLinkErrorCodeStatus.Expired) {
          status = 'expired'
          setErrorMessage('This link has expired. Please try again.')
        } else if (err.code === EmailLinkErrorCodeStatus.ClientMismatch) {
          // OPTIONAL: This check is only required if you have
          // the 'Require the same device and browser' setting
          // enabled in the Clerk Dashboard
          status = 'client_mismatch'
          setErrorMessage('This link must be verified in on the same device and browser.')
        }
      }
     setVerificationStatus(status)
     setErrorMessage(err?.errors?.[0]?.longMessage || 'An error occurred during verification.')
    }
  }

  useEffect(() => {
    if(!loaded) return

    verify()
  }, [handleEmailLinkVerification, loaded])

  // useEffect(() => {
  //   if (!isLoaded) return

  //   // Attempt to complete the sign-up process
  //   const completeSignUp = async () => {
  //     try {
  //       // This verifies that the user completed email verification
  //       // from the same device/browser
  //       const completeSignUpResponse = await signUp.attemptEmailAddressVerification({
          
  //       })

  //       if (completeSignUpResponse.status === 'complete') {
  //         // Set the user session active
  //         await setActive({ session: completeSignUpResponse.createdSessionId })
  //         setVerificationStatus('success')
          
  //         // Redirect to profile after a short delay
  //         setTimeout(() => {
  //           router.push('/profile')
  //         }, 2000)
  //       } else {
  //         console.error('Verification status:', completeSignUpResponse.status)
  //         setVerificationStatus('error')
  //         setErrorMessage('Verification failed. Please try again.')
  //       }
  //     } catch (err) {
  //       console.error('Error during verification:', err)
  //       setVerificationStatus('error')
  //       setErrorMessage(err?.errors?.[0]?.longMessage || 'An error occurred during verification.')
  //     }
  //   }

  //   completeSignUp()
  // }, [isLoaded, signUp, setActive, router])


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Email Verification</h2>
        </div>

        {verificationStatus === 'loading' && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 border-t-4 border-rose-500 border-solid rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Verifying your email address...</p>
          </div>
        )}

        {verificationStatus === 'verified' && (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Verification Successful!</h3>
            <p className="mt-2 text-sm text-gray-500">
              Your email has been verified. You will be redirected to your profile shortly.
            </p>
            <div className="mt-5">
              <Link
                href="/profile"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                Go to Profile
              </Link>
            </div>
          </div>
        )}

        {verificationStatus === 'failed' && (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Verification Failed</h3>
            <p className="mt-2 text-sm text-gray-500">
              {errorMessage || 'There was an error verifying your email. Please try again.'}
            </p>
            <div className="mt-5 space-y-3">
              <Link
                href="/sign-up"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                Try Again
              </Link>
              <div>
                <Link
                  href="/sign-in"
                  className="text-sm font-medium text-rose-600 hover:text-rose-500"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}