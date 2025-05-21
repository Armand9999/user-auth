'use client'

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

const schema = yup.object().shape({
    email: yup.string().email("Please enter a valid email format").required("Email is required"),
    password: yup.string().required("Password is required"),
});

const SignIn = () => {
    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });


    const { isLoaded, signIn, setActive } = useSignIn();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();
   

    if (!isLoaded) return null;
    
    
    const onSubmit = async (data) => {
        
        setLoading(true);
        setErrorMessage("");
        

        try {
            const signInAttempt = await signIn.create({
                identifier: data.email, 
                password: data.password, 
            });
            if (signInAttempt.status === 'complete') {
                await setActive({ session: signInAttempt.createdSessionId });
                router.push("/profile");
            } else {
                console.error(JSON.stringify(signInAttempt, null, 2));
                setErrorMessage("Sign-in failed. Please check your credentials and try again.");
            } 
        } catch (err) {
            if(isClerkAPIResponseError(err)) {
                setErrorMessage(err.errors[0].longMessage);
            }
            setErrorMessage("Sign-in failed. Please check your credentials and try again.");
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
                    <h2 className="text-lg font-semibold">Sign In</h2>
                </div>

                <p className="text-center text-gray-700 mt-4">Log in to your account</p>
                {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
                <div className="mt-6 space-y-4">
                    {[ 
                        { label: "Email", name: "email", type: "email", placeholder: "Enter your email" },
                        { label: "Password", name: "password", type: "password", placeholder: "Enter your password" },
                    ].map(({ label, name, type, placeholder }) => (
                        <div key={label} className="flex flex-col">
                            <label htmlFor={label} className="text-gray-700 font-medium">{label}</label>
                            <input
                                autoComplete="true"
                                id={label}
                                name={name}
                                type={type}
                                placeholder={placeholder}
                                className={`mt-1 p-2 border ${errors[name] ? 'border-red-300' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-rose-500 focus:border-rose-500`}
                                {...register(name)}
                            />
                            {errors[name] && <p className="text-red-500 text-sm mt-1">{errors[name].message}</p>}
                        </div>
                    ))}
                    <button
                        type="submit"
                        className="w-full bg-rose-500 text-white py-2 px-4 rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                        disabled={loading}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </div>
                <div className="mt-6 text-center">
                    <p className="text-gray-700">
                        Don't have an account? <Link href="/sign-up" className="text-rose-500 hover:text-rose">Sign up</Link>
                    </p>
                    <p className="text-gray-700">
                        <Link href="/sign-in/forgot-password" className="text-rose-500 hover:text-rose">Forgot Password?</Link>
                    </p>
                </div>
            </form>
            
        </div>
    )
}

export default SignIn;
