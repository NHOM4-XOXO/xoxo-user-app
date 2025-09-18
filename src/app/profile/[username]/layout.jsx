"use client";
import { createContext, useState, use, useContext, useEffect } from "react";
import ProfileHeader from "@/components/common/ProfileHeader";
import LoadingOverlay from "@/components/LoadingOverlay";
import { useGetUserByUsernameQuery } from "@/features/userApi";
import { RootContext } from "@/app/ClientProviders";


export const ProfileContext = createContext(null);

export default function Layout({ children, params }) {
    const { setIsLoading } = useContext(RootContext)
    const [isLoadingHeader, setIsLoadingHeader] = useState(true);
    const username = use(params)
    const { data: profile = [], isLoading: isLoadingProfile } = useGetUserByUsernameQuery(username?.username);

    useEffect(() => {
        setIsLoading(isLoadingHeader || isLoadingProfile)
    }, [isLoadingHeader || isLoadingProfile])
    return (
        <ProfileContext.Provider value={{ username, profile, setIsLoading }}>
            <div className="profile bg-fb-light-secondary dark:bg-fb-dark-primary min-h-screen pb-10">
                {/* {isLoading && <LoadingOverlay />} */}
                <div className="w-full mt-8 px-4 md:px-4">
                    <div className="w-full max-w-[900px] mx-auto space-y-4 relative">


                        {/* Header */}
                        <ProfileHeader userName={username?.username} setIsLoading={setIsLoadingHeader} />

                        {/* Main Content */}
                        <div className="main-content text-black dark:text-white">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </ProfileContext.Provider>
    );
}
