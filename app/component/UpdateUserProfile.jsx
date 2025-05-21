import { useUser, useReverification } from "@clerk/nextjs";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";

const schema = yup.object().shape({
    firstName: yup.string().required("First name is required").min(2, "First name must be at 2 characters"),
    lastName: yup.string().required("Last name is required").min(2, "First name must be at 2 characters"),

});

export default function UpdateUserProfile({ onClick, setIsUpdating }) {

    const { register, resetField , handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    const { isLoaded, user } = useUser()

    if(!isLoaded) return null;

    if(!user) return null;

    
    const onSubmit = async (data) => {
        await user.update({
            firstName: data.firstName,
            lastName: data.lastName,
            
        });
        
        resetField('firstName');
        resetField('lastName');
        
        
    }

    return (
        <div className="fixed inset-0 flex flex-col shadow-lg rounded-lg bg-white h-fit w-96 mx-auto mt-36 z-50">
                <div className="flex justify-end p-2">
                    <button className="text-gray-600 hover:text-red-500" 
                        onClick={() => onClick(() => setIsUpdating(false))}
                    >
                        &#x2715;
                    </button>
                </div>
            <form onSubmit={handleSubmit(onSubmit)} className=" p-6" >
                <p className="text-center w-full bg-rose-500 text-white py-2 px-4 rounded-md font-bold mt-4">Edit Profile</p>
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
                    
                    <button 
                        type="submit"
                        className="w-full bg-rose-500 text-white py-2 px-4 rounded-md hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2"
                    >
                        Edit 
                    </button>
                </div>
            </form>
        </div>
    )
}