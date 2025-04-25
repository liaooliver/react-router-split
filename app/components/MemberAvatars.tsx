import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/Avatar";
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from "../components/ui/AlertDialog";
import { X, AlertTriangle } from "lucide-react";

interface Member {
  id: string;
  name: string;
  avatar: string;
}

interface MemberAvatarsProps {
  members: Member[];
  removeConfirmMemberId: string | null;
  setRemoveConfirmMemberId: (id: string | null) => void;
  showError: boolean;
  errorMessage: string;
  handleRemoveMember: (id: string) => void;
}

export const MemberAvatars: React.FC<MemberAvatarsProps> = ({
  members,
  removeConfirmMemberId,
  setRemoveConfirmMemberId,
  showError,
  errorMessage,
  handleRemoveMember,
}) => (
  <>
    {members.map((member) => (
      <div
        key={member.id}
        className="flex flex-col items-center mx-2 relative group"
      >
        <Avatar className="w-10 h-10 border-2 border-transparent group-hover:border-[#0066CC] transition-colors">
          <AvatarImage src={member.avatar} alt={member.name} />
          <AvatarFallback className="bg-[#F3F4F6]">
            {member.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span className="text-xs mt-1 text-black">{member.name}</span>
        <AlertDialog
          open={removeConfirmMemberId === member.id}
          onOpenChange={(open) => !open && setRemoveConfirmMemberId(null)}
        >
          <AlertDialogTrigger asChild>
            <button
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              onClick={() => setRemoveConfirmMemberId(member.id)}
            >
              <X className="h-3 w-3 text-white" />
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>移除成員</AlertDialogTitle>
              <AlertDialogDescription>
                {showError ? (
                  <div className="flex items-center space-x-2 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{errorMessage}</span>
                  </div>
                ) : (
                  <>
                    確定要移除成員 {member.name} 嗎？
                    <br />
                    移除後無法恢復，且已參與費用記錄的成員無法移除。
                  </>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  // 關閉錯誤訊息與 Dialog
                  setRemoveConfirmMemberId(null);
                }}
              >
                取消
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => handleRemoveMember(member.id)}
                className="bg-red-500 hover:bg-red-600"
              >
                確認移除
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    ))}
  </>
)
