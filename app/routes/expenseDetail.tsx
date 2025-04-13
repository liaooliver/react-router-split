import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
} from "~/components/ui/alert-dialog";
import { Pencil, Trash2, User, Info, CheckCircle2 } from "lucide-react";
import { PageHeader } from "~/components/common/PageHeader";
import { AnimatedPageContainer } from "~/components/common/AnimatedPageContainer";

export default function ExpenseDetails() {
  const [isSettled, setIsSettled] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleEdit = () => {
    console.log("導向編輯頁面...");
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    console.log("刪除成功");
  };

  const toggleSettle = () => {
    setIsSettled((prev) => !prev);
  };

  return (
    <AnimatedPageContainer>
      <PageHeader title="費用詳情" />

      {/* 基本資訊 */}
      <Card>
        <CardContent className="space-y-1 pt-4">
          <div className="text-base font-semibold text-gray-800">
            與朋友的晚餐
          </div>
          <div className="text-2xl font-bold text-gray-800">$50.00</div>
          <div className="text-sm text-gray-500">2023年10月26日 晚上8:30</div>
          {!isSettled && (
            <div className="flex items-center gap-1 text-orange-700 text-sm pt-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>尚未結算</span>
            </div>
          )}
          {isSettled && (
            <div className="flex items-center gap-1 text-green-600 text-sm pt-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>已結算</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 付款人 */}
      <div>
        <div className="flex items-center gap-1 text-sm font-medium text-gray-800">
          <User className="w-4 h-4" />
          <span>付款人</span>
        </div>
        <div className="pl-2 pt-2 space-y-2">
          <div className="text-gray-700">小明：$30.00</div>
          <div className="text-gray-700">小美：$20.00</div>
        </div>
      </div>

      {/* 分攤方式 */}
      <div>
        <div className="flex items-center gap-1 text-sm font-medium text-gray-800">
          <Info className="w-4 h-4" />
          <span>分攤方式</span>
        </div>
        <div className="pl-2 pt-2 text-gray-700">平均分攤</div>
      </div>

      {/* 分攤金額 */}
      <div>
        <div className="flex items-center gap-1 text-sm font-medium text-gray-800">
          <User className="w-4 h-4" />
          <span>分攤金額</span>
        </div>
        <div className="pl-2 pt-2 space-y-2">
          <div className="text-gray-700">小明：$25.00</div>
          <div className="text-gray-700">小美：$25.00</div>
        </div>
      </div>

      {/* 備註 */}
      <div>
        <div className="text-sm font-medium text-gray-800">備註</div>
        <div className="pl-2 pt-2 text-gray-700">今天小明請客 XD</div>
      </div>

      {/* 類別 */}
      <div>
        <div className="text-sm font-medium text-gray-800">類別</div>
        <div className="pl-2 pt-2 text-gray-700">餐飲</div>
      </div>

      {/* 狀態切換示範按鈕 */}
      <div className="pt-2 text-right">
        <Button variant="outline" className="text-sm" onClick={toggleSettle}>
          {isSettled ? "標記為未結算" : "標記為已結算"}
        </Button>
      </div>

      {/* 若未結算才顯示按鈕 */}
      {!isSettled && (
        <div className="flex justify-between pt-4">
          <Button
            onClick={handleEdit}
            className="bg-[#FFC107] text-white hover:bg-yellow-500"
          >
            <Pencil className="mr-2 h-4 w-4" /> 編輯
          </Button>

          <AlertDialog
            open={showDeleteConfirm}
            onOpenChange={setShowDeleteConfirm}
          >
            <AlertDialogTrigger asChild>
              <Button
                onClick={handleDelete}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" /> 刪除
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>確定要刪除這筆費用嗎？</AlertDialogHeader>
              <AlertDialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  取消
                </Button>
                <Button
                  className="bg-red-500 text-white"
                  onClick={confirmDelete}
                >
                  確定刪除
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </AnimatedPageContainer>
  );
}
