import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { PageHeader } from "~/components/common/PageHeader";
import { AnimatedPageContainer } from "~/components/common/AnimatedPageContainer";
import { ExpenseDetailCard } from "~/components/feature/ExpenseDetailCard";
import { ExpenseParticipantsInfo } from "~/components/feature/ExpenseParticipantsInfo";
import { ExpenseMetaInfo } from "~/components/feature/ExpenseMetaInfo";
import { ExpenseActionButtons } from "~/components/feature/ExpenseActionButtons";
import { ExpenseEditForm } from "~/components/feature/ExpenseEditForm";
import type { Expense, ExpenseFormData } from "~/types/expense";

// 模擬資料，實際應用中應該從 API 獲取
const mockExpense: Expense = {
  id: 1,
  title: "與朋友的晚餐",
  amount: 50.0,
  date: "2023年10月26日 晚上8:30",
  category: "food",
  splitMethod: "equal",
  isSettled: false,
  payers: [
    { userId: 1, name: "小明", amount: 30.0 },
    { userId: 2, name: "小美", amount: 20.0 },
  ],
  shares: [
    { userId: 1, name: "小明", amount: 25.0 },
    { userId: 2, name: "小美", amount: 25.0 },
  ],
  note: "今天小明請客 XD",
};

export default function ExpenseDetails() {
  const [expense, setExpense] = useState<Expense>(mockExpense);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const handleEdit = () => {
    setShowEditDialog(true);
  };

  const handleDelete = () => {
    console.log("刪除成功");
  };

  const toggleSettle = () => {
    setExpense((prev) => ({
      ...prev,
      isSettled: !prev.isSettled,
    }));
  };

  const handleEditSubmit = (data: ExpenseFormData) => {
    setExpense((prev) => ({
      ...prev,
      ...data,
    }));
    setShowEditDialog(false);
  };

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

        <div className="pt-2 text-right">
          <Button variant="outline" className="text-sm" onClick={toggleSettle}>
            {expense.isSettled ? "標記為未結算" : "標記為已結算"}
          </Button>
        </div>

        <ExpenseActionButtons
          isSettled={expense.isSettled}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px] bg-white text-black">
          <ExpenseEditForm
            expense={expense}
            onSubmit={handleEditSubmit}
            onCancel={() => setShowEditDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </AnimatedPageContainer>
  );
}
