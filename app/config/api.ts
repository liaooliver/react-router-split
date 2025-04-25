const getApiBaseUrl = () => {
  const env = process.env.NODE_ENV || "development";

  switch (env) {
    case "production":
      return process.env.API_BASE_URL;
    case "development":
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
