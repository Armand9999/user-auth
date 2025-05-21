import { useUser, useReverification } from '@clerk/clerk-react'
import { isClerkRuntimeError, isReverificationCancelledError } from '@clerk/clerk-react/errors'
import { SessionVerificationLevel } from '@clerk/types'
import { useState } from 'react'
import React from 'react'
import { VerificationComponent } from './VerificationComponent'

export function UpdateUserEmail({
  onClick,
  isSetChanging,
}: {
  onClick?: (isSetChanging: () => void) => void
  isSetChanging?: (value: boolean) => void
}) {
  const { user } = useUser()
 
  const [verificationState, setVerificationState] = useState<
  | {
      complete: () => void
      cancel: () => void
      level: SessionVerificationLevel | undefined
      inProgress: boolean
    }
  | undefined
>(undefined)

    const changePrimaryEmail = useReverification(
        (emailAddressId: string) => user?.update({ primaryEmailAddressId: emailAddressId }),
        {
        onNeedsReverification: ({ complete, cancel, level }) => {
            setVerificationState({
            complete,
            cancel,
            level,
            inProgress: true,
            })
        },
        },
    )

  const handleClick = async (emailAddressId: string) => {
    
    try {
      await changePrimaryEmail(emailAddressId)
    } catch (e) {
        if (isClerkRuntimeError(e) && isReverificationCancelledError(e)) {
            console.error('User cancelled reverification', e.code);
        }
        
      console.error('Error updating email:', e)
    }
  }

  return (
    <div className="fixed inset-0 flex flex-col shadow-lg rounded-lg bg-white h-fit w-96 mx-auto mt-36 z-50">
      <div className="flex justify-end p-2">
        <button
          className="text-gray-600 hover:text-red-500"
          onClick={() => onClick?.(() => isSetChanging?.(false))}
        >
          &#x2715;
        </button>
      </div>

      <div className="p-6">
        <p className="text-center w-full bg-rose-500 text-white py-2 px-4 rounded-md font-bold mt-4">
          Change Primary Email
        </p>

        <div className="flex flex-col space-y-3">
        
          <div className="mt-4">
            <p className="text-sm text-gray-600 font-medium mb-2">Your email addresses:</p>
            <ul className="space-y-2">
              {user?.emailAddresses.map((email) => (
                <li
                  key={email.id}
                  className="flex items-center justify-between p-2 border border-gray-200 rounded-md"
                >
                  <span className="text-gray-800">{email.emailAddress}</span>
                  {user?.primaryEmailAddressId !== email.id ? (
                    <button 
                      onClick={() => handleClick(email.id)}
                      className="text-xs bg-gray-100 text-gray-600 hover:bg-gray-300 px-2 py-1 rounded-full">
                      Make primary
                    </button>
                  ) : (
                    <span className="text-xs bg-green-200 text-green-600 px-2 py-1 rounded-full">
                      Primary
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {verificationState?.inProgress && (
        <VerificationComponent
          level={verificationState?.level}
          onComplete={() => {
            verificationState.complete()
            setVerificationState(undefined)
          }}
          onCancel={() => {
            verificationState.cancel()
            setVerificationState(undefined)
          }}
        />
      )}
    </div>
  )
}
