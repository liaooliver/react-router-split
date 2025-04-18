import axiosInstance from "~/lib/axios";
import { auth } from "~/lib/firebase";

export interface Category {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export async function fetchCategories(): Promise<Category[]> {
  const user = auth.currentUser;
  if (!user) throw new Error("尚未登入");

  const idToken = await user.getIdToken();
  const response = await axiosInstance.get<Category[]>("/categories", {
    headers: {
      Authorization: `Bearer ${idToken}`,
    },
  });
  return response.data;
}
