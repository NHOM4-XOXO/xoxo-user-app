"use client";
import { useState } from "react";
import ProfileHeader from "@/components/common/ProfileHeader";
import LoadingOverlay from "@/components/common/LoadingOverplay";


export default function ProfileLayout({ children }) {
    const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="profile bg-fb-light-secondary dark:bg-fb-dark-primary min-h-screen pb-10">
            {/* {isLoading && <LoadingOverlay />} */}
            <div className="w-full mt-8 px-4 md:px-4">
                <div className="w-full max-w-[900px] mx-auto space-y-4 relative">


                    {/* Header */}
                    <ProfileHeader setIsLoading={setIsLoading}/>

                    {/* Main Content */}
                    <div className="main-content text-black dark:text-white">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
