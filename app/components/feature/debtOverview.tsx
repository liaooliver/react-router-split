import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface Debt {
  id: number;
  from: string;
  to: string;
  amount: number;
  event: string;
  paid: boolean;
}

interface DebtOverviewProps {
  debts: Debt[];
  onMarkPaid: (id: number) => void;
}

const DebtOverview = ({ debts, onMarkPaid }: DebtOverviewProps) => {
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    debtId: number | null;
  }>({
    isOpen: false,
    debtId: null,
  });

  const handleMarkPaid = (id: number) => {
    setConfirmDialog({ isOpen: true, debtId: id });
  };

  const handleConfirmPayment = () => {
    if (confirmDialog.debtId) {
      onMarkPaid(confirmDialog.debtId);
    }
    setConfirmDialog({ isOpen: false, debtId: null });
  };

  return (
    <>
      <div>
        <h2 className="text-md font-medium text-[#263238] mb-3">分帳關係</h2>
        <div className="space-y-2">
          <AnimatePresence>
            {debts.length > 0 ? (
              debts.map((d) => (
                <motion.div
                  key={d.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.3 } }}
                  className="bg-white border border-gray-300 rounded-md p-3 flex flex-col items-center justify-between"
                >
                  <div className="flex flex-col w-full gap-4">
                    {/* Top Row - Users and Amount */}
                    <div className="flex items-center justify-between">
                      {/* From User */}
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-2" />
                        <span className="text-sm text-[#263238]">{d.from}</span>
                      </div>

                      {/* Transfer Arrow and Amount */}
                      <div className="flex items-center gap-2">
                        <span className="text-gray-400">➜</span>
                        <span className="text-sm text-[#EF4444] font-medium">
                          ${d.amount}
                        </span>
                      </div>

                      {/* To User */}
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 mr-2" />
                        <span className="text-sm text-[#263238]">{d.to}</span>
                      </div>
                    </div>

                    {/* Bottom Row - Event and Button */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        （來自 {d.event}）
                      </span>
                      <Button
                        className="w-[72px] h-[28px] text-xs bg-[#00C4CC] text-white rounded"
                        onClick={() => handleMarkPaid(d.id)}
                      >
                        標記已付
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-sm text-[#9CA3AF] text-center">
                目前無未還款債務
              </p>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Dialog
        open={confirmDialog.isOpen}
        onOpenChange={(isOpen) => setConfirmDialog({ isOpen, debtId: null })}
      >
        <DialogContent className="sm:max-w-[425px] bg-white border border-gray-300 rounded-md p-4 text-black">
          <DialogHeader>
            <DialogTitle>確認標記已還款</DialogTitle>
            <DialogDescription>
              {confirmDialog.debtId &&
                debts.find((d) => d.id === confirmDialog.debtId) && (
                  <>
                    確定要標記這筆債務為已還款嗎？
                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                      <p>
                        付款人：
                        {debts.find((d) => d.id === confirmDialog.debtId)?.from}
                      </p>
                      <p>
                        收款人：
                        {debts.find((d) => d.id === confirmDialog.debtId)?.to}
                      </p>
                      <p>
                        金額：$
                        {
                          debts.find((d) => d.id === confirmDialog.debtId)
                            ?.amount
                        }
                      </p>
                      <p>
                        來自：
                        {
                          debts.find((d) => d.id === confirmDialog.debtId)
                            ?.event
                        }
                      </p>
                    </div>
                  </>
                )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-start">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setConfirmDialog({ isOpen: false, debtId: null })}
              className="w-20 h-10 border-[#D1D5DB] rounded-md bg-muted text-muted-foreground hover:bg-muted/90"
            >
              取消
            </Button>
            <Button
              type="button"
              onClick={handleConfirmPayment}
              className="bg-[#00C4CC] hover:bg-[#00A3A9]"
            >
              確認已還款
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DebtOverview;
