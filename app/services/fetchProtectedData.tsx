import { auth } from "~/lib/firebase";
import axiosInstance from "~/lib/axios";
import axios from "axios";
import type {
  DashboardResponseInterface,
  DashboardErrorResponseInterface,
} from "~/types/dashboard";
import type { CreateEventResponseInterface } from "~/types/event";

export async function fetchProtectedCreateEvent(
  name: string
): Promise<CreateEventResponseInterface> {
  const user = auth.currentUser;
  if (!user) throw new Error("尚未登入");

  const idToken = await user.getIdToken();

  try {
    const response = await axiosInstance.post<CreateEventResponseInterface>(
      "/events",
      {
        name,
      },
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data as CreateEventResponseInterface;
    }
    throw new Error("新增事件失敗");
  }
}

export async function fetchProtectedDashboardData(): Promise<DashboardResponseInterface> {
  const user = auth.currentUser;
  if (!user) throw new Error("尚未登入");

  const idToken = await user.getIdToken();

  try {
    const response = await axiosInstance.get<DashboardResponseInterface>(
      "/dashboard",
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data as DashboardErrorResponseInterface;
    }
    throw new Error("無法取得儀表板資料");
  }
}

export async function fetchProtectedData() {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("No user is currently signed in.");
  }

  try {
    const idToken = await user.getIdToken(true);

    const response = await axiosInstance.post(
      `/users/google/find-or-create`,
      {}, // empty body
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );

    if (response.status === 204) return null;
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `API call to /login/google failed:`,
        error.response?.data || error.message
      );
      throw new Error(
        error.response?.data?.error ||
          `HTTP error! status: ${error.response?.status}`
      );
    }
    throw error;
  }
}
