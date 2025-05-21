import { useClerk } from "@clerk/nextjs";
import { LogOutIcon } from "lucide-react";

export default function SignOutButton() {

    const { signOut } = useClerk(); 

    return (

        <button className="flex w-24 h-10 p-2 bg-indigo-300 rounded-xl text-sm font-bold hover:bg-indigo-500 focus:none" onClick={() => signOut({ redirectUrl: '/' })}>
            <LogOutIcon /> Log Out
        </button>
    
    )
}