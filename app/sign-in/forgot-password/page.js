'use client'

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import Link from "next/link";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

const schema = yup.object().shape({
    email: yup.string().email("Please enter a valid email format").required("Email is required"),
});

const ForgotPassword = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const { isLoaded, signIn } = useSignIn();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [sent, isSent] = useState(false);

    const onSubmit = async (data) => {
        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");
        if (!isLoaded) return;

        try {
            await signIn.create({
                strategy: "reset_password_email_code",
                identifier: data.email
            });
            setSuccessMessage("Password reset email sent successfully. Please check your inbox.");
            isSent(true);
        } catch (err) {
            if(isClerkAPIResponseError(err)) {
                setErrorMessage(err.errors[0].longMessage)
            } 
            //setErrorMessage("Failed to send password reset email. Please try again.");
            console.error(JSON.stringify(err, null, 2));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-rose-50">
            <form 
                className="w-96 bg-white shadow-lg rounded-lg p-6"
                onSubmit={handleSubmit(onSubmit)}
            >
                <div className="bg-rose-500 text-white text-center py-3 rounded-t-lg">
                    <h2 className="text-lg font-semibold">Forgot Password</h2>
                </div>

                <p className="text-center text-gray-700 mt-4">Enter your email to receive a password reset link</p>
                {successMessage && <p className="text-green-500 text-sm mt-1">{successMessage}</p>}
                {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
                <div className="mt-6 space-y-4">
                    <div className="flex flex-col">
                        <label htmlFor="email" className="text-gray-700 font-medium">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            className={`mt-1 p-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500`}
                            {...register("email")}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-rose-500 text-white py-2 px-4 rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                        disabled={loading}
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </div>
                {sent && (
                    <div className="mt-6 text-center">
                        <p className="text-gray-700">
                            <Link href="/sign-in/reset-password" className="text-rose-500 hover:text-rose">Proceed to Reset Password</Link>
                        </p>
                    </div>
                )}
            </form>
        </div>
    )
}

export default ForgotPassword;
