import { auth } from "~/lib/firebase";
import axiosInstance from "~/lib/axios";
import axios from "axios";
import type {
  EventResponseInterface,
  EventErrorResponseInterface,
} from "~/types/eventDashboard";

export async function fetchProtectedEventDetail(
  eventId: string | number
): Promise<EventResponseInterface> {
  const user = auth.currentUser;
  if (!user) throw new Error("尚未登入");
  const idToken = await user.getIdToken();
  try {
    const response = await axiosInstance.get<EventResponseInterface>(
      `/events/${eventId}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw error.response.data as EventErrorResponseInterface;
    }
    throw new Error("取得事件詳情失敗");
  }
}
