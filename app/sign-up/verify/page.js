// app/code-signup/verify/page.js
'use client'

import { useState } from 'react'
import { useSignUp } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function VerifyPage() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const [code, setCode] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  if (!isLoaded) return null

  // If there's no sign-up attempt in progress, redirect to sign-up
  if (!signUp.status) {
    router.push('/code-signup')
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setVerifying(true)
    setError('')

    try {
      // Attempt to verify the email with the code
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code
      })

      if (completeSignUp.status === 'complete') {
        // Set the user session active
        await setActive({ session: completeSignUp.createdSessionId })
        setSuccess(true)
        
        // Redirect to profile after a short delay
        setTimeout(() => {
          router.push('/profile')
        }, 2000)
      } else {
        console.error('Verification status:', completeSignUp.status)
        setError('Verification failed. Please try again.')
      }
    } catch (err) {
      console.error('Error during verification:', err)
      setError(err?.errors?.[0]?.longMessage || 'An error occurred during verification.')
    } finally {
      setVerifying(false)
    }
  }

  const resendCode = async () => {
    try {
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code"
      })
      setError('')
    } catch (err) {
      setError('Failed to resend code. Please try again.')
      console.error('Error resending code:', err)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
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
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification code to your email. Please enter it below.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label htmlFor="code" className="block text-sm font-medium text-gray-700">
              Verification Code
            </label>
            <input
              id="code"
              name="code"
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 6-digit code"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={resendCode}
              className="text-sm font-medium text-rose-600 hover:text-rose-500"
            >
              Resend Code
            </button>
            <button
              type="submit"
              disabled={verifying || !code}
              className={`bg-rose-500 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 ${
                verifying || !code ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {verifying ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <Link href="/code-signup" className="text-sm font-medium text-rose-600 hover:text-rose-500">
            Back to Sign Up
          </Link>
        </div>
      </div>
    </div>
  )
}
