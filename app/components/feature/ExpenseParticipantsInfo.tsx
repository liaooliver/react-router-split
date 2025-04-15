import { User } from "lucide-react";
import { type PaymentShare, type ExpenseShare } from "~/types/expense";

interface ExpenseParticipantsInfoProps {
  payers: PaymentShare[];
  shares: ExpenseShare[];
}

export function ExpenseParticipantsInfo({
  payers,
  shares,
}: ExpenseParticipantsInfoProps) {
  return (
    <div className="space-y-6">
      {/* 付款人 */}
      <div>
        <div className="flex items-center gap-1 text-sm font-medium text-gray-800">
          <User className="w-4 h-4" />
          <span>付款人</span>
        </div>
        <div className="pl-2 pt-2 space-y-2">
          {payers.map((payer) => (
            <div key={payer.userId} className="text-gray-700">
              {payer.name}：${payer.amount.toFixed(2)}
            </div>
          ))}
        </div>
      </div>

      {/* 分攤金額 */}
      <div>
        <div className="flex items-center gap-1 text-sm font-medium text-gray-800">
          <User className="w-4 h-4" />
          <span>分攤金額</span>
        </div>
        <div className="pl-2 pt-2 space-y-2">
          {shares.map((share) => (
            <div key={share.userId} className="text-gray-700">
              {share.name}：${share.amount.toFixed(2)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
