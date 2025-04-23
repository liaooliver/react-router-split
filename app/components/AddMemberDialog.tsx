import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { AlertTriangle } from "lucide-react";

interface AddMemberDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newMemberName: string;
  setNewMemberName: (v: string) => void;
  newMemberEmail: string;
  setNewMemberEmail: (v: string) => void;
  showError: boolean;
  errorMessage: string;
  onAdd: () => void;
  onCancel: () => void;
}

export const AddMemberDialog: React.FC<AddMemberDialogProps> = ({
  open,
  onOpenChange,
  newMemberName,
  setNewMemberName,
  newMemberEmail,
  setNewMemberEmail,
  showError,
  errorMessage,
  onAdd,
  onCancel,
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogTrigger asChild>
      <div className="flex flex-col items-center mr-4">
        <div className="w-10 h-10 bg-[#0066CC] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#0052A3] transition-colors">
          <span className="text-white">+</span>
        </div>
        <span className="text-xs mt-1 text-black">新增</span>
      </div>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-white text-black">
      <DialogHeader>
        <DialogTitle>發送邀請</DialogTitle>
      </DialogHeader>
      <div className="py-4">
        {showError && (
          <div className="flex items-center space-x-2 mb-2 p-2 bg-red-50 rounded text-red-600 text-sm">
            <AlertTriangle className="h-4 w-4" />
            <span>{errorMessage}</span>
          </div>
        )}
        <Input
          placeholder="輸入成員名稱 (選填)"
          value={newMemberName}
          onChange={(e) => setNewMemberName(e.target.value)}
          className="mb-2"
        />
        <Input
          placeholder="輸入 Email"
          value={newMemberEmail}
          onChange={(e) => setNewMemberEmail(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onAdd();
            }
          }}
        />
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          className="w-20 h-10 border-[#D1D5DB] rounded-md bg-muted text-muted-foreground hover:bg-muted/90"
          onClick={onCancel}
        >
          取消
        </Button>
        <Button
          onClick={onAdd}
          className="w-20 h-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          添加
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
