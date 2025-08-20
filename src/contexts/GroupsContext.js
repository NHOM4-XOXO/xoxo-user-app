import { useUser } from "@/contexts/UserContext";
import { createContext, useContext, useState, useEffect } from "react";

const GroupsContext = createContext();

export function GroupsProvider({ children }) {
  const { currentUser } = useUser();
  const userKey = currentUser?.id
    ? `myGroups_${currentUser.id}`
    : "myGroups_guest";
  const [myGroups, setMyGroups] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem(userKey);
    if (saved) {
      try {
        setMyGroups(JSON.parse(saved));
      } catch {
        setMyGroups([]);
      }
    } else {
      setMyGroups([]);
    }
  }, [userKey]);

  useEffect(() => {
    localStorage.setItem(userKey, JSON.stringify(myGroups));
  }, [myGroups, userKey]);

  const addGroup = (newGroup) => {
    const group = {
      ...newGroup,
      id: Math.max(...myGroups.map((g) => g.id), 0) + 1,
      hasNotification: false,
      lastActivity: "Vừa tạo",
      members: 1,
      postsCount: 0,
      createdBy: currentUser?.name || "Bạn",
      joinedAt: new Date().toISOString(),
    };
    setMyGroups((prev) => [group, ...prev]);
    return group.id;
  };

  const getGroupById = (id) => {
    return myGroups.find((group) => group.id === parseInt(id));
  };

  return (
    <GroupsContext.Provider value={{ myGroups, addGroup, getGroupById }}>
      {children}
    </GroupsContext.Provider>
  );
}

export const useGroups = () => useContext(GroupsContext);
