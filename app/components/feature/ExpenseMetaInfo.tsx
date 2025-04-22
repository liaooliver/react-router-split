import { Info } from "lucide-react";
import { type Expense } from "~/types/expense";

interface ExpenseMetaInfoProps {
  expense: Expense;
}

export function ExpenseMetaInfo({ expense }: ExpenseMetaInfoProps) {
  const splitMethodText = {
    equal: "平均分攤",
    exact: "自定義金額",
    percentage: "依比例分攤",
  };

  return (
    <div className="space-y-6">
      {/* 分攤方式 */}
      <div>
        <div className="flex items-center gap-1 text-sm font-medium text-gray-800">
          <Info className="w-4 h-4" />
          <span>分攤方式</span>
        </div>
        <div className="pl-2 pt-2 text-gray-700">
          {splitMethodText[expense.splitMethod]}
        </div>
      </div>

      {/* 備註 */}
      {expense.note && (
        <div>
          <div className="text-sm font-medium text-gray-800">備註</div>
          <div className="pl-2 pt-2 text-gray-700">{expense.note}</div>
        </div>
      )}

      {/* 類別 */}
      <div>
        <div className="text-sm font-medium text-gray-800">類別</div>
        <div className="pl-2 pt-2 text-gray-700">{expense.category}</div>
      </div>
    </div>
  );
}
