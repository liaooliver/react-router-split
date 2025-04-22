import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { fetchProtectedEventDetail } from "~/services/fetchProtectedEventDetail";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Pencil,
  Trash2,
  ChevronRight,
  UserPlus,
  X,
  Plus,
  AlertTriangle,
} from "lucide-react";
import { Link } from "react-router";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Input } from "~/components/ui/input";
import { PageHeader } from "~/components/common/PageHeader";
import { AnimatedPageContainer } from "~/components/common/AnimatedPageContainer";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import DonutChart from "~/components/feature/DonutChart";
import LoadingSpinner from "~/components/common/LoadingSpinner";
import axiosInstance from "~/lib/axios";
import { auth } from "~/lib/firebase";
import DebtOverview from "~/components/feature/debtOverview";
import type {
  DebtInterface,
  EventDetailInterface,
} from "~/types/eventDashboard";
import type { Route } from "../+types/root";
import { isAuth } from "~/services/auth";

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const isLogged = await isAuth();
  if (!isLogged) {
    throw new Response("未登入", { status: 401 });
  }
  const eventId = params.id;
  try {
    const data = await fetchProtectedEventDetail(eventId!);
    return { event: data.data };
  } catch (err: any) {
    throw new Response(err.message || "資料載入失敗", { status: 500 });
  }
}

const EventDashboard = ({ loaderData }: Route.ComponentProps) => {
  const [event, setEvent] = useState(loaderData.event);

  // UI互動相關本地狀態
  const [showExpenses, setShowExpenses] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [removeConfirmMemberId, setRemoveConfirmMemberId] = useState<
    string | null
  >(null);
  const [newMemberName, setNewMemberName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  // 檢查成員是否重複
  const isNameDuplicate = (name: string) => {
    return event?.members.some(
      (member) => member.name.toLowerCase() === name.toLowerCase()
    );
  };

  // 處理新增成員
  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      setErrorMessage("請輸入成員名稱");
      setShowError(true);
      return;
    }

    if (isNameDuplicate(newMemberName.trim())) {
      setErrorMessage("此成員名稱已存在");
      setShowError(true);
      return;
    }

    const newMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: newMemberName.trim(),
      avatar: `https://i.pravatar.cc/150?u=${Date.now()}`,
    };

    // 這裡應呼叫 API 新增成員，然後 revalidate 或重新導向
    // setEvent((prev) => ({
    //   ...prev,
    //   members: [...prev.members, newMember],
    // }));
    setNewMemberName("");
    setAddMemberDialogOpen(false);
    setShowError(false);
    // TODO: 呼叫 API 並重新取得 event 資料
  };

  // 檢查成員是否可以被刪除
  const canDeleteMember = (memberId: string) => {
    return !event.expenses.some((expense) => expense.paidBy === memberId);
  };

  // 處理刪除成員
  const handleRemoveMember = (memberId: string) => {
    if (!canDeleteMember(memberId)) {
      setErrorMessage("此成員已參與費用記錄，無法移除");
      setShowError(true);
      return;
    }

    // 這裡應呼叫 API 刪除成員，然後 revalidate 或重新導向
    // setEvent((prev) => ({
    //   ...prev,
    //   members: prev.members.filter((m) => m.id !== memberId),
    // }));
    setRemoveConfirmMemberId(null);
    setShowError(false);
    // TODO: 呼叫 API 並重新取得 event 資料
  };

  const handleDeleteExpense = async (expenseId: number) => {
    try {
      setErrorMessage("");
      const user = auth.currentUser;
      if (!user) throw new Error("尚未登入");
      const idToken = await user.getIdToken();
      await axiosInstance.delete(`/expenses/${expenseId}`, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      await refreshEventDetail();
    } catch (error: any) {
      setErrorMessage(
        error?.response?.data?.message || error.message || "刪除費用失敗"
      );
    }
  };

  const handleSettleEvent = async () => {
    // 檢查餘額總和是否為0
    const totalBalance: number =
      event?.balances.reduce((sum, b) => sum + b.amount, 0) || 0;

    if (Math.abs(totalBalance) > 0.01) {
      // 考慮浮點數精度問題
      setErrorMessage("餘額總和不為 0，請檢查費用");
      return;
    }

    try {
      const user = auth.currentUser;
      if (!user) throw new Error("尚未登入");
      const idToken = await user.getIdToken();
      await axiosInstance.post(
        `/settlement/events/${event.eventId}/settle`,
        {},
        {
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        }
      );
      // 呼叫 API 並重新取得 event 資料
      refreshEventDetail();
    } catch (err) {
      setErrorMessage("結算失敗，請稍後再試。");
    }
  };

  const refreshEventDetail = async () => {
    try {
      const newEvent = await fetchProtectedEventDetail(event.eventId);
      setEvent(newEvent.data);
    } catch (err) {
      setErrorMessage("重新載入失敗，請稍後再試。");
    }
  };

  // 成員列表渲染函數
  const renderMemberAvatars = () => {
    return (
      <ScrollArea className="w-full">
        <div className="flex p-3 bg-white border border-[#D1D5DB] rounded-lg">
          {/* 新增成員按鈕 */}
          <Dialog
            open={addMemberDialogOpen}
            onOpenChange={setAddMemberDialogOpen}
          >
            <DialogTrigger asChild>
              <div className="flex flex-col items-center mr-4">
                <div className="w-10 h-10 bg-[#0066CC] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#0052A3] transition-colors">
                  <Plus className="h-5 w-5 text-white" />
                </div>
                <span className="text-xs mt-1 text-black">新增</span>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white text-black">
              <DialogHeader>
                <DialogTitle>新增成員</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                {showError && (
                  <div className="flex items-center space-x-2 mb-2 p-2 bg-red-50 rounded text-red-600 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                <Input
                  placeholder="輸入成員名稱"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleAddMember();
                    }
                  }}
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  className="w-20 h-10 border-[#D1D5DB] rounded-md bg-muted text-muted-foreground hover:bg-muted/90"
                  onClick={() => {
                    setAddMemberDialogOpen(false);
                    setShowError(false);
                    setNewMemberName("");
                  }}
                >
                  取消
                </Button>
                <Button
                  onClick={handleAddMember}
                  disabled={!newMemberName.trim()}
                  className="w-20 h-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  添加
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          {/* 分隔線 */}
          {loaderData.event.members.length > 0 && (
            <div className="h-10 w-px bg-[#D1D5DB] mx-2"></div>
          )}
          {/* 成員頭像列表 */}
          {loaderData.event.members.map((member) => (
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

              {/* 刪除按鈕 */}
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
                        setShowError(false);
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
        </div>
      </ScrollArea>
    );
  };

  return event ? (
    <AnimatedPageContainer>
      <PageHeader title={event.title} path="/" />

      {/* 成員區塊 */}
      <div className="mb-4">
        <h2 className="text-base font-medium text-[#263238] mb-2">成員</h2>
        {event && renderMemberAvatars()}
      </div>

      {/* 類別分佈與統計 - 新增部分 */}
      <div className="mb-4">
        <h2 className="text-base font-medium text-[#263238] mb-2">
          類別分佈與統計
        </h2>
        <div className="p-3 bg-white border border-[#D1D5DB] rounded-lg">
          <div className="flex flex-col items-center">
            <DonutChart
              data={event.categoryDistribution}
              totalAmount={event.totalAmount}
            />
            <div className="flex items-center gap-2 mt-2">
              <div className="text-xs text-[#263238]">
                參與人數：{event.members.length} 人
              </div>
              <div className="text-xs text-[#263238]">
                人均花費：$
                {(event.totalAmount / event.members.length).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 已結算提示（結算後顯示） */}
      {(event.status === "settled" || event.status === "finalized") && (
        <div className="text-center mb-4">
          {event.status === "settled" && (
            <p className="text-base font-medium text-green-500">已結算</p>
          )}
          {event.status === "finalized" && (
            <p className="text-base font-medium text-yellow-500">已結束</p>
          )}
          <Button
            variant="outline"
            className="mt-2 w-48 border-[#D1D5DB] rounded-md"
            onClick={() => setShowExpenses(!showExpenses)}
          >
            {showExpenses ? "隱藏費用列表" : "展開費用列表"}
          </Button>
        </div>
      )}

      {/* 費用列表（未結算或點擊展開時顯示） */}
      {(event.status !== "settled" && event.status !== "finalized") ||
      showExpenses ? (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-base font-medium text-[#263238]">費用列表</h2>
            {event.status !== "settled" && event.status !== "finalized" && (
              <Link
                to={{
                  pathname: `/addExpense/${event.eventId}`,
                }}
              >
                <Button className="bg-[#00C4CC] text-white cursor-pointer rounded px-3 h-9 hover:bg-[#00B0B6]">
                  新增費用
                </Button>
              </Link>
            )}
          </div>
          <div className="space-y-2">
            {event.expenses.length === 0 ? (
              <div className="text-sm text-center text-gray-400">
                目前無費用記錄
              </div>
            ) : (
              event.expenses.map((exp) => (
                <Card
                  key={exp.id}
                  className="w-full h-14 border border-[#D1D5DB] rounded-lg"
                >
                  <CardContent className="flex items-center justify-between h-full px-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">
                        {exp.category === "food"
                          ? "🍽️"
                          : exp.category === "drinks"
                          ? "🥤"
                          : "📦"}
                      </span>
                      <p className="text-sm text-[#263238]">
                        {exp.title} - ${exp.amount}
                      </p>
                    </div>
                    {event.status !== "settled" &&
                      event.status !== "finalized" && (
                        <div className="flex items-center gap-2">
                          <Link to={`/expenseDetails/${exp.id}`}>
                            <Button variant="ghost" size="icon">
                              <Pencil className="w-4 h-4 text-[#00C4CC]" />
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteExpense(exp.id)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      ) : null}

      {/* 債務關係（結算後顯示） */}
      {(event.status === "settled" || event.status === "finalized") && (
        <div className="mb-4">
          {event.debts.length > 0 && (
            <DebtOverview
              debts={event.debts}
              onPaidSuccess={refreshEventDetail}
            />
          )}
          {event.debts.length === 0 && (
            <div className="text-sm text-center text-gray-400">
              目前無債務關係
            </div>
          )}
        </div>
      )}

      {/* 結算按鈕（未結算時顯示） */}
      {event.status !== "settled" && event.status !== "finalized" && (
        <div className="text-center mt-4">
          {errorMessage && (
            <p className="text-xs text-red-500 mb-2">{errorMessage}</p>
          )}
          <Button
            className="w-full bg-[#FF5733] cursor-pointer text-white rounded h-12 hover:bg-[#E84C2E]"
            onClick={handleSettleEvent}
          >
            結算
          </Button>
        </div>
      )}
    </AnimatedPageContainer>
  ) : (
    <LoadingSpinner text="活動資料載入中..." />
  );
};

export default EventDashboard;
