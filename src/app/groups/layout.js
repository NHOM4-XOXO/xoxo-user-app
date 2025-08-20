"use client";

import { GroupsProvider } from "@/contexts/GroupsContext";
import { UserProvider } from "@/contexts/UserContext";
export default function GroupsLayout({ children }) {
  return (
    <UserProvider>
      <GroupsProvider>
        {children}
      </GroupsProvider>
    </UserProvider>
  );
}
