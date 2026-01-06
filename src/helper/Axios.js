import axios from "axios";
import { getSession, signOut } from "next-auth/react";

// Create axios instance
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000",
  //   timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  async (config) => {
    // Get session from NextAuth
    if (typeof window !== "undefined") {
      try {
        const session = await getSession();
        if (session?.access_token) {
          config.headers.Authorization = `Bearer ${session.access_token}`;
        }
      } catch (error) {
        console.error("Error getting session:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    if (error.config?.skipAuthRefresh) {
      return Promise.reject({
        status: error.response?.status,
        message: error.response?.data?.error,
      });
    }

    if (error.response?.data.error === "jwt expired") {
      // Refresh session via NextAuth
      const session = await getSession();
      console.log("Session before signOut:", session);

      if (session?.access_token) {
        // Update the original request with new token
        error.config.headers.Authorization = `Bearer ${session.access_token}`;

        // Retry the request
        return axiosInstance(error.config);
      }
    }

    return Promise.reject({
      status: error.response?.status,
      message: error.response?.data?.error,
    });
  }
);

// Response interceptor
// axiosInstance.interceptors.response.use(
//   (response) => response.data,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       console.log("Refreshing token with:", session?.refresh_token);
//       if (!isRefreshing) {
//         isRefreshing = true;
//         try {
//           const session = await getSession();

//           const { data } = await axios.post(
//             `${
//               process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
//             }/auth/refresh`,
//             {
//               refresh_token: session?.refresh_token,
//             }
//           );
//           const newAccessToken = data?.access_token;
//           isRefreshing = false;
//           onRefreshed(newAccessToken);
//         } catch (refreshError) {
//           isRefreshing = false;
//           await signOut({ redirect: true, callbackUrl: "/api/auth/signin" });
//           return Promise.reject(refreshError);
//         }
//       }

//       return new Promise((resolve) => {
//         subscribeTokenRefresh((token) => {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           resolve(axiosInstance(originalRequest));
//         });
//       });
//     }

//     return Promise.reject({
//       status: error.response?.status,
//       message: error.response?.data?.error,
//     });
//   }
// );

export default axiosInstance;
