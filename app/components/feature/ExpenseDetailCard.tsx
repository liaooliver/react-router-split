import { Card, CardContent } from "~/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { type Expense } from "~/types/expense";

interface ExpenseDetailCardProps {
  expense: Expense;
}

export function ExpenseDetailCard({ expense }: ExpenseDetailCardProps) {
  return (
    <Card>
      <CardContent className="space-y-1 pt-4">
        <div className="text-base font-semibold text-gray-800">
          {expense.title}
        </div>
        <div className="text-2xl font-bold text-gray-800">
          ${expense.amount.toFixed(2)}
        </div>
        <div className="text-sm text-gray-500">{expense.date}</div>
      </CardContent>
    </Card>
  );
}
