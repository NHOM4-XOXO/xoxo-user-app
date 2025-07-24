"use client";
import ProfileHeader from "@/components/common/ProfileHeader";
export default function ProfileLayout({ children }) {


    return (
        <div className="profile bg-fb-light-secondary dark:bg-fb-dark-primary min-h-screen pb-10">
            <div className="w-full mt-8 px-4 md:px-4">
                <div className="w-full max-w-[1000px] mx-auto space-y-4">
                    <ProfileHeader />

                    {/* Main Content */}
                    <div className="main-content text-black dark:text-white">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
