'use client'

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSignIn } from "@clerk/nextjs";
import { useState } from "react";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";
import { redirect, useRouter } from "next/navigation";

const schema = yup.object().shape({
    password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    confirmPassword: yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required("Confirm password is required"),
    code: yup
        .number()
        .typeError("Code must be a number")
        .positive("Code must be a positive number")
        .integer("Code must be an integer")
        .required("Code is required"),

});

const ResetPassword = () => {
    const { register, handleSubmit, formState: { errors }, resetField } = useForm({
        resolver: yupResolver(schema)
    });

    const { isLoaded, signIn } = useSignIn();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const onSubmit = async (data) => {
        setLoading(true);
        setSuccessMessage("");
        setErrorMessage("");
        if (!isLoaded) return;

        try {
            const completeReset = await signIn.attemptFirstFactor({
                strategy: "reset_password_email_code",
                code: data.code,
                password: data.password,
            })
            if(completeReset.status === "complete") {
                // await setActive({ session: completeReset.createdSessionId });
                setSuccessMessage("Your password has been reset successfully. You can now sign in.");
                resetField("password");
                resetField("confirmPassword");
                resetField("code");
            }
            
            
            // window.location.href = "/sign-in";
            setTimeout(() => {
                window.location.href = '/profile'
            }, 3000)
        } catch (err) {
            if(isClerkAPIResponseError(err)) {
                setErrorMessage(err.errors[0].longMessage)
            }
            // setErrorMessage("Failed to reset password. Please try again.");
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
                    <h2 className="text-lg font-semibold">Reset Password</h2>
                </div>

                <p className="text-center text-gray-700 mt-4">Enter your new password</p>
                {successMessage && <p className="text-green-500 text-sm mt-1">{successMessage}</p>}
                {errorMessage && <p className="text-red-500 text-sm mt-1">{errorMessage}</p>}
                <div className="mt-6 space-y-4">
                    {[
                        { label: "New Password", name: "password", type: "password", placeholder: "Enter your new password" },
                        { label: "Confirm Password", name: "confirmPassword", type: "password", placeholder: "Confirm your new password" },
                        { label: "Code", name: "code", type: "number", placeholder: "Enter the code sent to your email" },
                    ].map(({ label, name, type, placeholder }) => (
                        <div key={label} className="flex flex-col">
                            <label htmlFor={label} className="text-gray-700 font-medium">{label}</label>
                            <input
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
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ResetPassword;
