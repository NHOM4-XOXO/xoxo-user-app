// src/services/crossTabLogout.js
console.log("📁 crossTabLogout.js file loaded");

class CrossTabLogout {
  constructor() {
    console.log("🏗️ CrossTabLogout constructor");
    this.LOGOUT_EVENT = "XOXO_FORCE_LOGOUT";
    this.LOGOUT_CHANNEL = "xoxo_logout_channel";
    this.bc = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized || typeof window === "undefined") {
      console.log("⏭️ Skip init - already initialized or not in browser");
      return;
    }

    console.log("🚀 Starting crossTabLogout initialization...");

    try {
      // BroadcastChannel support
      if ("BroadcastChannel" in window) {
        this.bc = new BroadcastChannel(this.LOGOUT_CHANNEL);
        this.bc.onmessage = (event) => {
          console.log("📨 Broadcast message received:", event.data);
          if (event.data && event.data.type === "FORCE_LOGOUT") {
            console.log("🔥 Processing logout from broadcast");
            this.performLogout();
          }
        };
        console.log("✅ BroadcastChannel created");
      }

      // Storage event listener
      const storageHandler = (event) => {
        console.log("💾 Storage event:", event.key, "=", event.newValue);
        if (event.key === this.LOGOUT_EVENT && event.newValue === "true") {
          console.log("🔥 Processing logout from storage");
          this.performLogout();
        }
      };

      window.addEventListener("storage", storageHandler);
      console.log("✅ Storage listener added");

      this.isInitialized = true;

      // ✅ QUAN TRỌNG: Expose ra window để debug
      if (typeof window !== "undefined") {
        window.crossTabLogout = this;
        console.log("✅ Exposed to window.crossTabLogout");
      }

      console.log("✅ CrossTabLogout fully initialized!");
    } catch (error) {
      console.error("❌ Error initializing crossTabLogout:", error);
    }
  }

  performLogout() {
    console.log("🔥🔥🔥 PERFORMING LOGOUT NOW!");

    try {
      // Clear Redux state trước (nếu có)
      if (typeof window !== "undefined" && window.store) {
        window.store.dispatch({ type: "auth/logout" });
      }

      // Clear localStorage và sessionStorage
      localStorage.clear();
      sessionStorage.clear();
      console.log("🧹 Storage cleared");

      // ✅ CLEAR COOKIES ĐÚNG CÁCH
      if (typeof Cookies !== "undefined") {
        // Nếu có js-cookie
        Cookies.remove("token");
        Cookies.remove("token", { path: "/" });
        Cookies.remove("token", {
          path: "/",
          domain: window.location.hostname,
        });
        console.log("🍪 Token cookie removed via js-cookie");
      } else {
        // Clear cookies manually
        const cookies = ["token", "auth", "session"]; // Thêm tên cookies cần clear
        cookies.forEach((name) => {
          // Clear với các path và domain khác nhau
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
        });
        console.log("🍪 Cookies cleared manually");
      }

      // Debug: Kiểm tra cookies sau khi clear
      console.log("🔍 Cookies after clear:", document.cookie);

      // Redirect với delay ngắn
      console.log("🔄 Redirecting to login...");
      setTimeout(() => {
        window.location.href = "/login";
      }, 200);
    } catch (error) {
      console.error("❌ Error during logout:", error);
      // Force redirect dù có lỗi
      window.location.href = "/login";
    }
  }

  triggerLogoutAllTabs() {
    console.log("🚨🚨🚨 TRIGGER LOGOUT ALL TABS");

    try {
      // Send message to other tabs
      if (this.bc) {
        const message = { type: "FORCE_LOGOUT", timestamp: Date.now() };
        this.bc.postMessage(message);
        console.log("📡 Broadcast sent:", message);
      }

      // Send via localStorage event
      localStorage.setItem(this.LOGOUT_EVENT, "true");
      console.log("💾 localStorage logout flag set");

      // Clear flag sau delay
      setTimeout(() => {
        try {
          localStorage.removeItem(this.LOGOUT_EVENT);
          console.log("🧹 localStorage flag cleared");
        } catch (e) {}
      }, 1000);

      // ✅ LOGOUT TAB HIỆN TẠI
      setTimeout(() => {
        this.performLogout();
      }, 100); // Giảm delay để logout nhanh hơn
    } catch (error) {
      console.error("❌ Error triggering logout:", error);
      this.performLogout();
    }
  }

  destroy() {
    console.log("🧹 Destroying crossTabLogout");
    try {
      if (this.bc) {
        this.bc.close();
        this.bc = null;
      }
      this.isInitialized = false;
      if (typeof window !== "undefined") {
        delete window.crossTabLogout;
      }
    } catch (error) {
      console.error("❌ Error destroying:", error);
    }
  }
}

console.log("🏭 Creating crossTabLogout instance");
export const crossTabLogout = new CrossTabLogout();
console.log("✅ crossTabLogout exported");
