import React, { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Pencil, Trash2, Plus, ArrowLeft } from "lucide-react";
import { Link } from "react-router";
import type { Event } from "~/types/event";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { PageHeader } from "~/components/common/PageHeader";
import { AnimatedPageContainer } from "~/components/common/AnimatedPageContainer";

const mockEvent: Event = {
  eventId: "20200101",
  title: "週末烤肉聚會",
  status: "unsettled",
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
    { id: 101, title: "肉品食材", amount: 180 },
    { id: 102, title: "飲料啤酒", amount: 60 },
  ],
};

const RenderMemberList = ({
  event,
  onAddMember,
}: {
  event: Event;
  onAddMember: (name: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newMemberName, setNewMemberName] = useState("");

  const handleSubmit = () => {
    if (newMemberName.trim()) {
      onAddMember(newMemberName.trim());
      setNewMemberName("");
      setIsOpen(false);
    }
  };

  return (
    <>
      <ScrollArea className="flex max-w-md mx-auto p-4 space-y-6">
        <div className="flex items-center gap-4">
          <div
            className="flex flex-col items-center cursor-pointer"
            onClick={() => setIsOpen(true)}
          >
            <Avatar className="w-10 h-10 bg-[#00C4CC]">
              <Plus className="w-5 h-5 text-white" />
            </Avatar>
            <span className="text-xs text-[#263238] mt-1">新增</span>
          </div>
          {event.members.map((member) => (
            <div
              key={member.id}
              className="relative flex flex-col items-center"
            >
              <Avatar className="w-10 h-10 bg-[#E5E7EB]">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-[#263238] mt-1">{member.name}</span>
              <button className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
                <Trash2 className="w-3 h-3 text-red-500" />
              </button>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border border-border">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">新增成員</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Input
                id="name"
                placeholder="請輸入成員名稱"
                className="col-span-4 border-input"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="w-20 h-10 border-[#D1D5DB] rounded-md bg-muted text-muted-foreground hover:bg-muted/90"
            >
              取消
            </Button>
            <Button
              className="w-20 h-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleSubmit}
              disabled={!newMemberName.trim()}
            >
              新增
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const RenderBalanceOverview = ({ event }: { event: Event }) => (
  <div className="space-y-2">
    {event.balances.map((b) => (
      <Card
        key={b.userId}
        className="w-full h-14 border border-[#D1D5DB] rounded-lg"
      >
        <CardContent className="flex items-center justify-between h-full px-4">
          <span className="text-sm text-[#263238]">{b.name}</span>
          <span
            className={`text-sm font-medium ${
              b.amount >= 0 ? "text-green-500" : "text-red-500"
            }`}
          >
            {b.amount >= 0 ? "+" : "-"}${Math.abs(b.amount).toFixed(2)}
          </span>
        </CardContent>
      </Card>
    ))}
  </div>
);

const RenderExpenseList = ({
  isSettled,
  event,
}: {
  isSettled: boolean;
  event: Event;
}) => {
  if (isSettled) return null;

  if (event.expenses.length === 0) {
    return (
      <div className="text-sm text-center text-gray-400">目前無費用記錄</div>
    );
  }

  return (
    <div className="space-y-2">
      {event.expenses.map((exp) => (
        <Card
          key={exp.id}
          className="w-full h-14 border border-[#D1D5DB] rounded-lg"
        >
          <CardContent className="flex items-center justify-between h-full px-4">
            <div>
              <p className="text-sm text-[#263238]">
                {exp.title} - ${exp.amount}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to={{
                  pathname: `/expenseDetails/${exp.id}`,
                }}
              >
                <Button variant="ghost" size="icon">
                  <Pencil className="w-4 h-4 text-[#00C4CC]" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon">
                <Trash2 className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default function EventDashboard() {
  const [event, setEvent] = useState<Event>(mockEvent);
  const isSettled = event.status === "settled";

  const handleAddMember = (name: string) => {
    const newMember = {
      id: Math.max(...event.members.map((m) => m.id)) + 1,
      name,
      avatar: `https://i.pravatar.cc/100?u=${Date.now()}`,
    };

    const newBalance = {
      userId: newMember.id,
      name: name,
      amount: 0,
    };

    setEvent((prev) => ({
      ...prev,
      members: [...prev.members, newMember],
      balances: [...prev.balances, newBalance],
    }));
  };

  return (
    <AnimatedPageContainer>
      <PageHeader title={event.title} />

      {/* 成員區塊 */}
      <div>
        <h2 className="text-base font-medium text-[#263238] mb-2">成員</h2>
        <RenderMemberList
          event={event}
          onAddMember={handleAddMember}
        ></RenderMemberList>
      </div>

      {/* 餘額概覽 */}
      <div>
        <h2 className="text-base font-medium text-[#263238] mb-2">餘額概覽</h2>
        <RenderBalanceOverview event={event}></RenderBalanceOverview>
      </div>

      {/* 費用區塊（未結算時） */}
      {!isSettled && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-base font-medium text-[#263238]">費用列表</h2>
            <Link
              to={{
                pathname: "/addExpense",
                search: `?event=${event.eventId}`,
              }}
            >
              <Button className="bg-[#00C4CC] text-white cursor-pointer rounded px-3 h-9">
                新增費用
              </Button>
            </Link>
          </div>
          <RenderExpenseList
            event={event}
            isSettled={isSettled}
          ></RenderExpenseList>
        </div>
      )}

      {/* 結算按鈕（未結算時） */}
      {!isSettled && (
        <div className="text-center">
          <Button className="w-full bg-[#FF5733] cursor-pointer text-white rounded h-10">
            結算
          </Button>
        </div>
      )}
    </AnimatedPageContainer>
  );
}
