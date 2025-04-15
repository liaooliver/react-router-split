import React, { useState } from "react";
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

// 擴展 Event 類型以包含新的類別分布數據
const mockEvent = {
  eventId: "20200101",
  title: "週末烤肉聚會",
  status: "unsettled", // "unsettled" | "pending" | "settled"
  members: [
    { id: 1, name: "小美", avatar: "https://i.pravatar.cc/100?u=1" },
    { id: 2, name: "阿宏", avatar: "https://i.pravatar.cc/100?u=2" },
    { id: 3, name: "志明", avatar: "https://i.pravatar.cc/100?u=3" },
  ],
  balances: [
    { userId: 1, name: "小美", amount: 120 },
    { userId: 2, name: "阿宏", amount: -60 },
    { userId: 3, name: "志明", amount: -60 },
  ],
  expenses: [
    {
      id: 101,
      title: "肉品食材",
      amount: 180,
      category: "food",
      paidBy: 1,
      createdAt: "2025-04-10",
    },
    {
      id: 102,
      title: "飲料啤酒",
      amount: 60,
      category: "drinks",
      paidBy: 1,
      createdAt: "2025-04-10",
    },
  ],
  // 新增的字段
  categoryDistribution: [
    { category: "food", amount: 180, color: "#EF4444" },
    { category: "drinks", amount: 60, color: "#00C4CC" },
  ],
  totalAmount: 240,
  // 結算後才會有的債務關係
  debts: [
    {
      id: 201,
      fromUserId: 2,
      fromUserName: "阿宏",
      toUserId: 1,
      toUserName: "小美",
      amount: 60,
      paid: false,
      paidAt: null,
      relatedExpenses: [
        { id: 101, title: "肉品食材", amount: 45, date: "2025-04-10" },
        { id: 102, title: "飲料啤酒", amount: 15, date: "2025-04-10" },
      ],
    },
    {
      id: 202,
      fromUserId: 3,
      fromUserName: "志明",
      toUserId: 1,
      toUserName: "小美",
      amount: 60,
      paid: false,
      paidAt: null,
      relatedExpenses: [
        { id: 101, title: "肉品食材", amount: 45, date: "2025-04-10" },
        { id: 102, title: "飲料啤酒", amount: 15, date: "2025-04-10" },
      ],
    },
  ],
};

// SVG 圓環圖組件
const DonutChart = ({ data, totalAmount }) => {
  // 計算各部分的百分比和角度
  let startAngle = 0;
  const pathData = data.map((item, index) => {
    const percentage = (item.amount / totalAmount) * 100;
    const angle = (percentage / 100) * 360;
    const endAngle = startAngle + angle;

    const startRad = ((startAngle - 90) * Math.PI) / 180;
    const endRad = ((endAngle - 90) * Math.PI) / 180;

    const x1 = 40 + 30 * Math.cos(startRad);
    const y1 = 40 + 30 * Math.sin(startRad);
    const x2 = 40 + 30 * Math.cos(endRad);
    const y2 = 40 + 30 * Math.sin(endRad);

    const largeArcFlag = angle > 180 ? 1 : 0;

    const pathString = `M 40 40 L ${x1} ${y1} A 30 30 0 ${largeArcFlag} 1 ${x2} ${y2} Z`;

    startAngle = endAngle;

    return (
      <path
        key={index}
        d={pathString}
        fill={item.color}
        stroke="#fff"
        strokeWidth="1"
        className="transition-all duration-300 hover:opacity-80"
      />
    );
  });

  return (
    <div className="relative">
      <svg viewBox="0 0 80 80" width="80" height="80" className="mx-auto">
        {pathData}
        <circle cx="40" cy="40" r="15" fill="#fff" />
        <text
          x="40"
          y="44"
          textAnchor="middle"
          fontSize="8"
          fontWeight="bold"
          fill="#263238"
        >
          ${totalAmount}
        </text>
      </svg>
      {/* 右上角手繪風格錢幣圖示 */}
      <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-xs">$</span>
      </div>
    </div>
  );
};

// 債務關係組件
const RenderDebts = ({ debts, onMarkAsPaid }) => {
  return (
    <div className="space-y-2">
      {debts.map((debt) => (
        <Accordion type="single" collapsible key={debt.id}>
          <AccordionItem
            value={`debt-${debt.id}`}
            className="border border-[#D1D5DB] rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-2 hover:no-underline">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <span className="text-sm">{debt.fromUserName}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-red-500">
                    ${debt.amount.toFixed(2)}
                  </span>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">{debt.toUserName}</span>
                </div>
                {debt.paid ? (
                  <span className="px-3 py-1 text-xs font-medium text-white bg-green-500 rounded-md">
                    已還款
                  </span>
                ) : (
                  <Button
                    size="sm"
                    className="px-3 py-1 text-xs font-medium text-white bg-[#00C4CC] hover:bg-[#00B0B6] rounded-md"
                    onClick={(e) => {
                      e.stopPropagation();
                      onMarkAsPaid(debt.id);
                    }}
                  >
                    標記已付
                  </Button>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-0 pb-2">
              <div className="pl-6 space-y-2">
                {debt.relatedExpenses.map((exp) => (
                  <div key={exp.id} className="flex justify-between text-sm">
                    <div>
                      <span className="text-[#263238]">{exp.title}</span>
                      <span className="text-gray-400 ml-2 text-xs">
                        {exp.date}
                      </span>
                    </div>
                    <span className="text-red-500 font-medium">
                      ${exp.amount.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );
};

const EventDashboard = () => {
  const [event, setEvent] = useState(mockEvent);
  const [showExpenses, setShowExpenses] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [removeConfirmMemberId, setRemoveConfirmMemberId] = useState(null);
  const [newMemberName, setNewMemberName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  const isSettled = event.status === "settled";
  const isPending = event.status === "pending";

  // 檢查成員是否重複
  const isNameDuplicate = (name) => {
    return event.members.some(
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

    setEvent((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
    }));
    setNewMemberName("");
    setAddMemberDialogOpen(false);
    setShowError(false);
  };

  // 檢查成員是否可以被刪除
  const canDeleteMember = (memberId) => {
    return !event.expenses.some(
      (expense) =>
        expense.paidBy === memberId || expense.participants?.includes(memberId)
    );
  };

  // 處理刪除成員
  const handleRemoveMember = (memberId) => {
    if (!canDeleteMember(memberId)) {
      setErrorMessage("此成員已參與費用記錄，無法移除");
      setShowError(true);
      return;
    }

    setEvent((prev) => ({
      ...prev,
      members: prev.members.filter((m) => m.id !== memberId),
    }));
    setRemoveConfirmMemberId(null);
    setShowError(false);
  };

  const handleSettleEvent = () => {
    // 檢查餘額總和是否為0
    const totalBalance = event.balances.reduce((sum, b) => sum + b.amount, 0);

    if (Math.abs(totalBalance) > 0.01) {
      // 考慮浮點數精度問題
      setErrorMessage("餘額總和不為 0，請檢查費用");
      return;
    }

    // 更新事件狀態為pending
    setEvent((prev) => ({
      ...prev,
      status: "pending",
    }));

    // 清除錯誤訊息
    setErrorMessage("");
  };

  const handleMarkAsPaid = (debtId) => {
    // 確認提示訊息應該在實際應用中以對話框形式顯示
    const debt = event.debts.find((d) => d.id === debtId);
    if (!debt) return;

    // 更新債務的paid狀態
    setEvent((prev) => ({
      ...prev,
      debts: prev.debts.map((d) =>
        d.id === debtId
          ? { ...d, paid: true, paidAt: new Date().toISOString().split("T")[0] }
          : d
      ),
    }));

    // 檢查是否所有債務都已還款
    const allPaid = event.debts.every((d) => (d.id === debtId ? true : d.paid));
    if (allPaid) {
      setEvent((prev) => ({
        ...prev,
        status: "settled",
      }));
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
                <span className="text-xs mt-1">新增</span>
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
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
                  className="bg-[#0066CC] text-white hover:bg-[#0052A3]"
                >
                  添加
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* 分隔線 */}
          {event.members.length > 0 && (
            <div className="h-10 w-px bg-[#D1D5DB] mx-2"></div>
          )}

          {/* 成員頭像列表 */}
          {event.members.map((member) => (
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
              <span className="text-xs mt-1">{member.name}</span>

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

  return (
    <AnimatedPageContainer>
      <PageHeader title={event.title} />

      {/* 成員區塊 */}
      <div className="mb-4">
        <h2 className="text-base font-medium text-[#263238] mb-2">成員</h2>
        {renderMemberAvatars()}
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
      {(isPending || isSettled) && (
        <div className="text-center mb-4">
          <p className="text-base font-medium text-green-500">已結算</p>
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
      {(!isPending && !isSettled) || showExpenses ? (
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-base font-medium text-[#263238]">費用列表</h2>
            {!isPending && !isSettled && (
              <Link
                to={{
                  pathname: "/addExpense",
                  search: `?event=${event.eventId}`,
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
                    {!(isPending || isSettled) && (
                      <div className="flex items-center gap-2">
                        <Link to={`/expenseDetails/${exp.id}`}>
                          <Button variant="ghost" size="icon">
                            <Pencil className="w-4 h-4 text-[#00C4CC]" />
                          </Button>
                        </Link>
                        <Button variant="ghost" size="icon">
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
      {(isPending || isSettled) && (
        <div className="mb-4">
          <h2 className="text-base font-medium text-[#263238] mb-2">
            債務關係
          </h2>
          <RenderDebts debts={event.debts} onMarkAsPaid={handleMarkAsPaid} />
        </div>
      )}

      {/* 結算按鈕（未結算時顯示） */}
      {!isPending && !isSettled && (
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
  );
};

export default EventDashboard;
