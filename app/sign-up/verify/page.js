'use client'

import {  useClerk } from '@clerk/nextjs'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EmailLinkErrorCodeStatus, isEmailLinkError } from '@clerk/nextjs/errors'

export default function VerifyPage() {
  const [verificationStatus, setVerificationStatus] = useState('loading') 
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()
  const { handleEmailLinkVerification, loaded } = useClerk()

  // Handler for verification on another device
  const handleVerifiedOnOtherDevice = () => {
    setVerificationStatus('verified')
    setTimeout(() => {
      router.push('/sign-in')
    }, 2000)
  }

  async function verify() {
    try {
      // Dynamically set the host domain for dev and prod
      const protocol = window.location.protocol
      const host = window.location.host

      await handleEmailLinkVerification({
        // URL to navigate to if sign-up flow needs more requirements, such as MFA
        // redirectUrl: `${protocol}//${host}/sign-up`,
        onVerifiedOnOtherDevice: handleVerifiedOnOtherDevice
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
          setErrorMessage('This link must be verified on the same device and browser.')
        } else {
          setErrorMessage(err?.errors?.[0]?.longMessage || 'An error occurred during verification.')
        }
      } else {
        setErrorMessage(err?.errors?.[0]?.longMessage || 'An error occurred during verification.')
      }
      setVerificationStatus(status)
    }
  }

  useEffect(() => {
    if(!loaded) return
    verify()
  }, [handleEmailLinkVerification, loaded])

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
              Your email has been verified. You will be redirected to the sign in page shortly.
            </p>
            <div className="mt-5">
              <Link
                href="/sign-in"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-rose-500 hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                Go to Sign In
              </Link>
            </div>
          </div>
        )}

        {verificationStatus === 'client_mismatch' && (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100">
              <svg className="h-6 w-6 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Device Mismatch</h3>
            <p className="mt-2 text-sm text-gray-500">
              This verification link must be opened on the same device and browser that you used to sign up.
            </p>
            <div className="mt-5 space-y-3">
              <p className="text-sm text-gray-600">
                Please return to the original device and browser you used during sign-up and click the verification link again.
              </p>
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

        {verificationStatus === 'expired' && (
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100">
              <svg className="h-6 w-6 text-orange-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mt-3 text-lg font-medium text-gray-900">Link Expired</h3>
            <p className="mt-2 text-sm text-gray-500">
              This verification link has expired.
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