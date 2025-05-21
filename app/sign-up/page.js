'use client'

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSignUp, useUser } from "@clerk/nextjs";

const schema = yup.object().shape({
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    email: yup.string().email("Please enter a valid email format").required("Email is required"),
    password: yup.string().min(8, "Password must be at least 8 characters").max(32, "Password cannot exceed 32 characters").required("Password is required"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required("Confirm password is required")
});

const SignUp = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const { isLoaded, signUp } = useSignUp();
    const { isSignedIn } = useUser();
    const [verified, setVerified] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
    
    if (!isLoaded) return null;

    const { startEmailLinkFlow } = signUp.createEmailLinkFlow();

    const onSubmit = async (data) => {
        setVerified(false);
        setLoading(true);
        setErrorMessage("");
        setVerifying(true);
        
        const { firstName, lastName, email, password } = data;

        try {
            await signUp.create({
                firstName,
                lastName,
                emailAddress: email,
                password
            });

            const protocol = window.location.protocol;
            const host = window.location.host;
            
            const signUpAttempt = await startEmailLinkFlow({
                redirectUrl: `${protocol}//${host}/sign-up/verify`,
            });

            const verification = signUpAttempt.verifications.emailAddress;

            if(verification.verifiedFromTheSameClient()) {
                setVerifying(false);
                setVerified(true);
            }
        } catch(err) {
            console.error(JSON.stringify(err, null, 2));
            setVerifying(false);
            setLoading(false);

            if (err.errors?.[0].longMessage) {
              console.log('Clerk error:', err.errors[0].longMessage);
              setErrorMessage(err.errors[0].longMessage);
            } else {
              setErrorMessage('An error occurred.');
            }
        }
    };

    async function reset(e) {
        e.preventDefault();
        setVerifying(false);
        setLoading(false);
    }
    
    if (errorMessage) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-96 bg-white shadow-lg rounded-lg p-6">
              <p className="text-red-500 mb-4">Error: {errorMessage}</p>
              <button 
                onClick={() => setErrorMessage('')}
                className="w-full bg-rose-500 text-white py-2 px-4 rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
              >
                Try again
              </button>
            </div>
          </div>
        );
    }
    
    if (verifying) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-96 bg-white shadow-lg rounded-lg p-6">
              <p className="text-center text-gray-700 mb-4">Check your email and visit the link that was sent to you.</p>
              <form onSubmit={reset}>
                <button 
                  type="submit"
                  className="w-full bg-rose-500 text-white py-2 px-4 rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                >
                  Restart
                </button>
              </form>
            </div>
          </div>
        );
    }
    
    if (verified) {
        return (
          <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="w-96 bg-white shadow-lg rounded-lg p-6">
              <p className="text-center text-green-600 font-semibold">Signed up successfully! Now close this tab!</p>
            </div>
          </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-rose-50">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="w-96 bg-white shadow-lg rounded-lg p-6"
            >
                <div className="bg-rose-500 text-white text-center py-3 rounded-t-lg">
                    <h2 className="text-lg font-semibold">Sign Up</h2>
                </div>

                <p className="text-center text-gray-700 mt-4">Create an account</p>
                {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
                <div className="mt-6 space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="firstName" className="text-gray-700 font-medium">First Name</label>
                        <input
                            placeholder="Enter your first name"
                            name="firstName"
                            type="text"
                            {...register("firstName")}
                            className={`mt-1 p-2 border ${errors.firstName ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500`}
                        />
                        {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="lastName" className="text-gray-700 font-medium">Last Name</label>
                        <input
                            placeholder="Enter your last name"
                            name="lastName"
                            type="text"
                            {...register("lastName")}
                            className={`mt-1 p-2 border ${errors.lastName ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500`}
                        />
                        {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
                        <input
                            placeholder="Enter your email"
                            name="email"
                            type="email"
                            {...register("email")}
                            className={`mt-1 p-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="password" className="text-gray-700 font-medium">Password</label>
                        <input
                            placeholder="Enter your password"
                            name="password"
                            type="password"
                            {...register("password")}
                            className={`mt-1 p-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500`}
                        />
                        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirm Password</label>
                        <input
                            placeholder="Confirm your password"
                            name="confirmPassword"
                            type="password"
                            {...register("confirmPassword")}
                            className={`mt-1 p-2 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500`}
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{" "}
                                <Link href="/sign-in" className="text-rose-500 hover:text-rose-600">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </div>
                    <div id="clerk-captcha"></div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-rose-500 text-white py-2 px-4 rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Signing up...' : 'Sign Up'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SignUp;