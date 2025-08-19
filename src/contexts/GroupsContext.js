"use client";

import { createContext, useContext, useState, useEffect } from "react";

const GroupsContext = createContext();

const defaultGroups = [
  {
    id: 1,
    name: "GIÚP TUỔI CẤY SHOPEE",
    image: "/image/group1.jpg",
    hasNotification: true,
    lastActivity: "Lần hoạt động gần nhất: 5 phút trước",
    members: 1250,
    postsCount: 45,
    privacy: "public",
    description: "Nhóm hỗ trợ mua bán trên Shopee",
  },
  {
    id: 2,
    name: "Garena Liên Quân Mobile",
    image: "/image/group2.jpg",
    hasNotification: false,
    lastActivity: "Lần hoạt động gần nhất: khoảng 1 giờ trước",
    members: 2340,
    postsCount: 120,
    privacy: "public",
    description: "Cộng đồng game thủ Liên Quân Mobile",
  },
  {
    id: 3,
    name: "Garena Liên Quân Mobile vn",
    image: "/image/group1.jpg",
    hasNotification: false,
    lastActivity: "Lần hoạt động gần nhất: 46 phút trước",
    members: 890,
    postsCount: 67,
    privacy: "public",
    description: "Nhóm Liên Quân Mobile Việt Nam",
  },
  {
    id: 4,
    name: "SỐ GÌ ĐẤY SHOPEE ?",
    image: "/image/group2.jpg",
    hasNotification: false,
    lastActivity: "Lần hoạt động gần nhất: 24 phút trước",
    members: 567,
    postsCount: 23,
    privacy: "public",
    description: "Chia sẻ mã giảm giá Shopee",
  },
];

export function GroupsProvider({ children }) {
  const [myGroups, setMyGroups] = useState([]);
    // const savedGroups = localStorage.getItem("myGroups");
    // if (savedGroups) {
    //   try {
    //     return JSON.parse(savedGroups);
    //   } catch {
    //     return defaultGroups;
    //   }
    // }
    // return defaultGroups;


  useEffect(() => {
    const saved = localStorage.getItem("myGroups");
    if (saved) {
      try {
        const userGroups = JSON.parse(saved);
       
        const merged = [
          ...defaultGroups.filter(
            (mock) => !userGroups.some((g) => g.id === mock.id)
          ),
          ...userGroups,
        ];
        setMyGroups(merged);
      } catch {
        setMyGroups(defaultGroups);
      }
    } else {
      setMyGroups(defaultGroups);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("myGroups", JSON.stringify(myGroups));
  }, [myGroups]);

  const addGroup = (newGroup) => {
    const group = {
      ...newGroup,
      id: Math.max(...myGroups.map((g) => g.id), 0) + 1,
      hasNotification: false,
      lastActivity: "Vừa tạo",
      members: 1, 
      postsCount: 0,
      createdBy: "Bạn",
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

export function useGroups() {
  const context = useContext(GroupsContext);
  if (!context) {
    throw new Error("useGroups must be used within a GroupsProvider");
  }
  return context;
}
