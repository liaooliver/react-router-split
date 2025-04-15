import { Pencil, Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
} from "~/components/ui/alert-dialog";
import { useState } from "react";

interface ExpenseActionButtonsProps {
  isSettled: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

export function ExpenseActionButtons({
  isSettled,
  onEdit,
  onDelete,
}: ExpenseActionButtonsProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    setShowDeleteConfirm(false);
    onDelete();
  };

  return (
    <>
      {!isSettled && (
        <div className="flex justify-between pt-4">
          <Button
            onClick={onEdit}
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
    </>
  );
}
