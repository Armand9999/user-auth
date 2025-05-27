// app/code-signup/page.js
'use client'

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useSignUp } from "@clerk/nextjs";

const schema = yup.object().shape({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Please enter a valid email format").required("Email is required"),
  password: yup.string().min(8, "Password must be at least 8 characters").max(32, "Password cannot exceed 32 characters").required("Password is required"),
  confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required("Confirm password is required")
});

export default function SignUp() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const { isLoaded, signUp } = useSignUp();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();
  
  if (!isLoaded) return null;

  const onSubmit = async (data) => {
    setLoading(true);
    setErrorMessage("");
    
    const { firstName, lastName, email, password } = data;

    try {
      // Create the user with Clerk
      await signUp.create({
        firstName,
        lastName,
        emailAddress: email,
        password
      });

      // Prepare the email verification with code strategy
      await signUp.prepareEmailAddressVerification({
        strategy: "email_code"
      });

      // Redirect to the verification page
      router.push('/code-signup/verify');
    } catch(err) {
      console.error(JSON.stringify(err, null, 2));
      setLoading(false);

      if (err.errors?.[0].longMessage) {
        setErrorMessage(err.errors[0].longMessage);
      } else {
        setErrorMessage('An error occurred.');
      }
    }
  };

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
}
