import React from 'react'
import SidebarFriend from "@/components/friends/SideFriends";
function layout({ children }) {
    return (
        <div className="flex bg-fb-light-secondary min-h-screen dark:text-white dark:bg-black">
            <SidebarFriend />
            {children}
        </div>
    )
}

export default layout