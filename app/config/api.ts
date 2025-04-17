const getApiBaseUrl = () => {
  const env = process.env.NODE_ENV || "development";

  switch (env) {
    case "production":
      return "https://api.yourproduction.com";
    case "test":
      return "https://api.yourtest.com";
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
