const getApiBaseUrl = () => {
  const env = process.env.NODE_ENV || "development";
  console.log(process.env.NODE_ENV);
  console.log(import.meta.env.VITE_API_BASE_URL);
  switch (env) {
    case "production":
      return import.meta.env.VITE_API_BASE_URL;
    default:
      return "http://localhost:3000/api";
  }
};

export const API_CONFIG = {
  baseURL: getApiBaseUrl(),
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
  },
};
