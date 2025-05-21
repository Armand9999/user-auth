'use client'

import * as React from 'react'
import { useUser, useReverification } from '@clerk/nextjs'
import { EmailAddressResource } from '@clerk/types'
import Link from 'next/link'
import { isClerkAPIResponseError } from '@clerk/nextjs/errors'

export default function Page() {
  const { isLoaded, user } = useUser()
  const [email, setEmail] = React.useState('')
  const [code, setCode] = React.useState('')
  const [isVerifying, setIsVerifying] = React.useState(false)
  const [successful, setSuccessful] = React.useState(false)
  const [error, setError] = React.useState('')
  const [emailObj, setEmailObj] = React.useState<EmailAddressResource | undefined>()
  const createEmailAddress = useReverification((email: string) =>
    user?.createEmailAddress({ email }),
  )


  if (!isLoaded) return null

  if (isLoaded && !user?.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-700 font-medium">You must be logged in to access this page</p>
      </div>
    )
  }

  // Handle addition of the email address
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      // Add an unverified email address to user
      const res = await createEmailAddress(email)
      // Reload user to get updated User object
      await user.reload()

      // Find the email address that was just added
      const emailAddress = user.emailAddresses.find((a) => a.id === res?.id)
      // Create a reference to the email address that was just added
      setEmailObj(emailAddress)

      // Send the user an email with the verification code
      emailAddress?.prepareVerification({ strategy: 'email_code' })

      // Set to true to display second form
      // and capture the OTP code
      setIsVerifying(true)
      
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      if(isClerkAPIResponseError(err)) {
        setError(err?.errors?.[0].longMessage || "An error occured. Please try again")
      }
      console.error(JSON.stringify(err, null, 2))
      // setError(err?.errors?.[0]?.longMessage || 'An error occurred. Please try again.')
    }
  }

  // Handle the submission of the verification form
  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      // Verify that the code entered matches the code sent to the user
      const emailVerifyAttempt = await emailObj?.attemptVerification({ code })

      if (emailVerifyAttempt?.verification.status === 'verified') {
        setSuccessful(true)
       
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        console.error(JSON.stringify(emailVerifyAttempt, null, 2))
        setError('Verification failed. Please check the code and try again.')
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      setError(err?.errors?.[0]?.longMessage || 'An error occurred during verification.')
    }
  }

  // Display a success message if the email was added successfully
  if (successful) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Email Added Successfully!</h1>
        <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
          <p className="text-green-700 text-center">Your email has been verified and added to your account.</p>
        </div>
        <div className="flex justify-center">
          <Link 
            href="/profile" 
            className="bg-rose-500 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
          >
            Return to Profile
          </Link>
        </div>
      </div>
    )
  }

  // Display the verification form to capture the OTP code
  if (isVerifying) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Verify Email</h1>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        <div>
          <form onSubmit={(e) => verifyCode(e)}>
            <div className="mb-4">
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Enter verification code
              </label>
              <input
                onChange={(e) => setCode(e.target.value)}
                id="code"
                name="code"
                type="text"
                value={code}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
                placeholder="Enter the 6-digit code"
              />
              <p className="mt-1 text-sm text-gray-500">
                We've sent a verification code to your email. Please check your inbox.
              </p>
            </div>
            <div className="flex justify-between mt-6">
              <button
                type="button"
                onClick={() => setIsVerifying(false)}
                className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                Back
              </button>
              <button 
                type="submit"
                className="bg-rose-500 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
              >
                Verify
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  }

  // Display the initial form to capture the email address
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Add Email Address</h1>
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}
      <div>
        <form onSubmit={(e) => handleSubmit(e)}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              id="email"
              name="email"
              type="email"
              value={email}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-rose-500 focus:border-rose-500"
              placeholder="Enter your email address"
              required
            />
          </div>
          <div className="flex justify-between mt-6">
            <Link
              href="/profile"
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              Cancel
            </Link>
            <button 
              type="submit"
              className="bg-rose-500 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}