import axiosInstance from "~/lib/axios";
import { auth } from "~/lib/firebase";
// 取得指定 event 的成員列表
export async function fetchEventMembers(
  eventId: string | undefined
): Promise<{ id: number; name: string; firebase_uid: string }[]> {
  if (!eventId) throw new Error("eventId is required");

  const user = auth.currentUser;
  if (!user) throw new Error("尚未登入");

  const idToken = await user.getIdToken();

  const res = await axiosInstance.get<
    { id: number; name: string; firebase_uid: string }[]
  >(`/users/event-members/${eventId}`, {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  const data = res.data;

  // 只回傳 id 和 name
  return data.map((member) => ({
    id: member.id,
    name: member.name,
    firebase_uid: member.firebase_uid,
  }));
}
