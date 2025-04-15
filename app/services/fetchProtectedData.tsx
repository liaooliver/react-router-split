// From src/services/api.js example
import { auth } from "~/lib/firebase";

const API_BASE_URL = "http://localhost:3000/api";

// Helper function to make authenticated requests
export async function fetchProtectedData() {
  const user = auth.currentUser; // 1. Get the current user from Firebase Auth
  if (!user) {
    throw new Error("No user is currently signed in.");
  }

  try {
    // 2. Get the *latest* Firebase ID token (true forces refresh)
    const idToken = await user.getIdToken(true);

    // 3. Prepare headers, adding the Authorization Bearer token
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${idToken}`, // <<< THE KEY INTEGRATION PART
    };

    // 4. Make the actual fetch request to your backend
    const response = await fetch(`${API_BASE_URL}/login/google`, {
      method: "POST",
      headers: headers,
    });

    // ... (Response handling as shown before) ...

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }
    if (response.status === 204) return null;
    return await response.json();
  } catch (error) {
    console.error(`API call to /login/google failed:`, error);
    throw error;
  }
}
