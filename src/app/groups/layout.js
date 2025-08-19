"use client";

import { GroupsProvider } from "@/contexts/GroupsContext";

export default function GroupsLayout({ children }) {
  return (
    <GroupsProvider>
      {children}
    </GroupsProvider>
  );
}
