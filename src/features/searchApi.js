import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL + "/api";

// Tạo axios instance với base config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    accept: "*/*",
  },
});

// Interceptor để tự động thêm Bearer token
api.interceptors.request.use(
  (config) => {
    // Lấy token từ cookie hoặc localStorage
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Helper function để lấy token
function getAuthToken() {
  // Thử lấy từ cookie trước
  const cookies = document.cookie.split(";");
  const tokenCookie = cookies.find((cookie) =>
    cookie.trim().startsWith("token=")
  );
  if (tokenCookie) {
    return tokenCookie.split("=")[1];
  }

  // Fallback: lấy từ localStorage
  const user = localStorage.getItem("currentUser");
  if (user) {
    const userData = JSON.parse(user);
    return userData.token;
  }

  return null;
}

// API function để search users/posts/groups
export const searchUsers = async ({ keyword, page = 0, size = 20 }) => {
  try {
    const response = await api.get("/user/search", {
      params: {
        keyword: encodeURIComponent(keyword),
        page,
        size,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Search API Error:", error);
    throw error;
  }
};

// Hàm search riêng cho từng loại (nếu cần)
export const searchPosts = async ({ keyword, page = 0, size = 20 }) => {
  // Gọi chung API search và filter posts
  const result = await searchUsers({ keyword, page, size });
  return {
    ...result,
    data: {
      ...result.data,
      users: [], // Clear users
      groups: [], // Clear groups
    },
  };
};

export const searchGroups = async ({ keyword, page = 0, size = 20 }) => {
  // Gọi chung API search và filter groups
  const result = await searchUsers({ keyword, page, size });
  return {
    ...result,
    data: {
      ...result.data,
      users: [], // Clear users
      posts: [], // Clear posts
    },
  };
};

// Advanced search với filters
export const advancedSearch = async ({
  keyword,
  type = "all", // "users", "posts", "groups", "all"
  page = 0,
  size = 20,
  filters = {},
}) => {
  try {
    const params = {
      keyword: encodeURIComponent(keyword),
      page,
      size,
      ...filters,
    };

    const response = await api.get("/user/search", { params });

    // Filter results based on type
    if (type !== "all") {
      const data = response.data.data;
      const filteredData = {
        users: type === "users" ? data.users : [],
        posts: type === "posts" ? data.posts : [],
        groups: type === "groups" ? data.groups : [],
        totalUsers: type === "users" ? data.totalUsers : 0,
        totalPosts: type === "posts" ? data.totalPosts : 0,
        totalGroups: type === "groups" ? data.totalGroups : 0,
        totalResults: data.totalResults,
      };

      return {
        ...response.data,
        data: filteredData,
      };
    }

    return response.data;
  } catch (error) {
    console.error("Advanced Search API Error:", error);
    throw error;
  }
};

export default {
  searchUsers,
  searchPosts,
  searchGroups,
  advancedSearch,
};
