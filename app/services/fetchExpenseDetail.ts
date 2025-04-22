import { auth } from "~/lib/firebase";
import axiosInstance from "~/lib/axios";
import axios from "axios";
import type { Expense } from "~/types/expense";

export async function fetchProtectedExpenseDetail(expenseId: string): Promise<Expense> {
  const user = auth.currentUser;
  if (!user) throw new Error("尚未登入");
  const idToken = await user.getIdToken();
  try {
    const response = await axiosInstance.get<{ message: string; data: Expense }>(
      `/expenses/${expenseId}`,
      {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      }
    );
    return response.data.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "取得費用詳情失敗");
    }
    throw new Error("取得費用詳情失敗");
  }
}
