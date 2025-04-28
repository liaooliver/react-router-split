import axios from "axios";
import { API_CONFIG } from "~/config/api";

// 建立共用的 axios 實例
const axiosInstance = axios.create(API_CONFIG);

// 請求攔截器
axiosInstance.interceptors.request.use(
  (config) => {
    // 這裡可以添加通用的請求處理邏輯
    // 例如：添加 loading 狀態、token 等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 回應攔截器
axiosInstance.interceptors.response.use(
  (response) => {
    // 這裡可以添加通用的回應處理邏輯
    return response;
  },
  (error) => {
    // 這裡可以添加通用的錯誤處理邏輯
    // 例如：401 未授權、500 伺服器錯誤等
    if (error.response?.status === 401) {
      // 處理未授權的情況
      console.error("未授權的請求");
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
