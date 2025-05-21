'use client'

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from 'next/navigation';
import SignOutButton from "../component/SignOutButton";
import UpdateUserProfile from "../component/UpdateUserProfile";
import { UpdateUserEmail } from "../component/UpdateUserEmail";
import Link from 'next/link'


export default function Profile() {
    
    const { user } = useUser();
    const [activeTab, setActiveTab] = useState('profile');
    const [isUpdating, setIsUpdating] = useState(false);
    
    const [isChangingEmail, setIsChangingEmail] = useState(false);


    if (!user) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
                    <SignOutButton />
                </div>
            </header>
        
            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Profile Header */}
                    <div className="bg-rose-500 px-6 py-8">
                        <div className="flex flex-col sm:flex-row items-center">
                            <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white">
                                <img 
                                    src={user.imageUrl || "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} 
                                    alt="Profile" 
                                    className="h-full w-full object-cover"
                                />
                            </div>
                            <div className="mt-4 sm:mt-0 sm:ml-6 text-center sm:text-left">
                                <h2 className="text-2xl font-bold text-white">{user.firstName} {user.lastName}</h2>
                                <p className="text-rose-100">{user.primaryEmailAddress?.emailAddress}</p>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                        {
                            [
                                {tabBtn: "Profile Information", tabTitle: "profile"},
                                {tabBtn: "Security", tabTitle: "security"},
                                {tabBtn: "Preferences", tabTitle: "preferences"}
                            ].map((tab, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveTab(tab.tabTitle)}
                                    className={`py-4 px-6 text-center border-b-2 font-medium text-sm ${
                                        activeTab === tab.tabTitle
                                            ? 'border-rose-500 text-rose-600'
                                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                                >
                                    {tab.tabBtn}
                                </button>
                            ))
                        }
                        </nav>
                    </div>

                    {/* Tab Content */}
                    <div className="p-6">
                        {activeTab === 'profile' && (
                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">Personal Information</h3>
                                    <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">First Name</label>
                                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                                {user.firstName}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Last Name</label>
                                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                                {user.lastName}
                                            </div>
                                        </div>
                                        <div className="sm:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
                                                {user.primaryEmailAddress?.emailAddress}
                                            </div>
                                        </div>
                                    </div>
                                    
                                </div>
                                
                                <div className="pt-5">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            type="button"
                                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                                            onClick={() => setIsUpdating(true)}
                                        >
                                            Edit Profile
                                        </button>
                                        <Link
                                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                                            href={'/profile/add-email'}
                                        >
                                            Add Email Address
                                        </Link>
                                        
                                        <button
                                            type="button"
                                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                                            onClick={() => setIsChangingEmail(true)}
                                        >
                                            Change Primary Email
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Password</p>
                                            <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                                        </div>
                                        <button
                                            
                                            type="button"
                                            className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                                        >
                                            Change Password
                                        </button>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                                            <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                                        </div>
                                        <button
                                            type="button"
                                            className="bg-rose-500 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                                        >
                                            Enable
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="space-y-6">
                                <h3 className="text-lg font-medium text-gray-900">Preferences</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="email-notifications"
                                                name="email-notifications"
                                                type="checkbox"
                                                className="focus:ring-rose-500 h-4 w-4 text-rose-600 border-gray-300 rounded"
                                                defaultChecked
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="email-notifications" className="font-medium text-gray-700">
                                                Email Notifications
                                            </label>
                                            <p className="text-gray-500">Receive email notifications about account activity</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Modals */}
            {isUpdating && <UpdateUserProfile onClick={() => setIsUpdating(false)} setIsUpdating={setIsUpdating} />}
            
            {isChangingEmail && (
                <UpdateUserEmail 
                    onClick={() => setIsChangingEmail(false)} 
                    isSetChanging={setIsChangingEmail} 
                />
            )}
        </div>
    );
}