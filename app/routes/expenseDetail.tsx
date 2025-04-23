import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { fetchProtectedExpenseDetail } from "~/services/fetchExpenseDetail";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "~/components/ui/dialog";
import { PageHeader } from "~/components/common/PageHeader";
import { AnimatedPageContainer } from "~/components/common/AnimatedPageContainer";
import { ExpenseDetailCard } from "~/components/feature/ExpenseDetailCard";
import { ExpenseParticipantsInfo } from "~/components/feature/ExpenseParticipantsInfo";
import { ExpenseMetaInfo } from "~/components/feature/ExpenseMetaInfo";
import { ExpenseActionButtons } from "~/components/feature/ExpenseActionButtons";
import { ExpenseEditForm } from "~/components/feature/ExpenseEditForm";
import { auth } from "~/lib/firebase";
import axiosInstance from "~/lib/axios";
import type { Expense, ExpenseFormData } from "~/types/expense";

export default function ExpenseDetails() {
  const params = useParams();
  const id = params.id;
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    fetchProtectedExpenseDetail(id)
      .then(setExpense)
      .catch((err) => setError(err.message || "發生未知錯誤"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleDelete = () => {
    console.log("刪除成功");
  };

  const handleEditSubmit = async (data: ExpenseFormData) => {
    if (!expense) return;
    setLoading(true);
    setError(null);
    try {
      // 取得 idToken
      const user = auth.currentUser;
      if (!user) throw new Error("尚未登入");
      const idToken = await user.getIdToken();

      // 組裝 payload
      const payload = {
        ...data,
        // 若 API 需要 eventId 或其他欄位可加上
        // eventId: expense.eventId,
      };
      // 發送 PUT 請求
      await axiosInstance.put(`/expenses/${expense.id}`, payload, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      // 成功後更新本地狀態
      setExpense((prev) => (prev ? { ...prev, ...data } : prev));
      setShowEditDialog(false);
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          error.message ||
          "更新費用失敗，請稍後再試"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <AnimatedPageContainer>
        <PageHeader title="費用詳情" />
        <div>載入中...</div>
      </AnimatedPageContainer>
    );
  }
  if (error) {
    return (
      <AnimatedPageContainer>
        <PageHeader title="費用詳情" />
        <div className="text-red-500">{error}</div>
      </AnimatedPageContainer>
    );
  }
  if (!expense) {
    return (
      <AnimatedPageContainer>
        <PageHeader title="費用詳情" />
        <div>查無資料</div>
      </AnimatedPageContainer>
    );
  }
  return (
    <AnimatedPageContainer>
      <PageHeader title="費用詳情" />

      <div className="space-y-6">
        <ExpenseDetailCard expense={expense} />

        <ExpenseParticipantsInfo
          payers={expense.payers}
          shares={expense.shares}
        />

        <ExpenseMetaInfo expense={expense} />

        <ExpenseActionButtons onEdit={handleEdit} onDelete={handleDelete} />
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px] bg-white text-black">
          {/* 無障礙 DialogTitle，若不想顯示可用 VisuallyHidden 包裹 */}
          <DialogTitle>編輯費用</DialogTitle>
          <ExpenseEditForm
            expense={expense}
            eventId={expense.eventId}
            onSubmit={handleEditSubmit}
            onCancel={() => setShowEditDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </AnimatedPageContainer>
  );
}
