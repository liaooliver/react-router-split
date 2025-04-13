import React, { useState } from "react";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import DebtOverview from "~/components/feature/debtOverview";
import EventList from "~/components/feature/eventList";
import { EventStatus } from "~/constants/status";
import { Link } from "react-router";

const PersonalDashboard = () => {
  const [debts, setDebts] = useState([
    {
      id: 1,
      from: "小智",
      to: "小明",
      amount: 266.67,
      event: "晚餐聚會",
      paid: false,
    },
    {
      id: 2,
      from: "小花",
      to: "小華",
      amount: 150,
      event: "電影日",
      paid: false,
    },
  ]);

  const events = [
    {
      id: 1,
      name: "露營團",
      status: EventStatus.ACTIVE,
      balance: -200,
    },
    {
      id: 2,
      name: "桌遊之夜",
      status: EventStatus.PENDING,
      balance: 150,
    },
    {
      id: 3,
      name: "烤肉派對",
      status: EventStatus.ACTIVE,
      balance: 300,
    },
    {
      id: 4,
      name: "生日聚會",
      status: EventStatus.ARCHIVED,
      balance: -150,
    },
    {
      id: 5,
      name: "電影馬拉松",
      status: EventStatus.PENDING,
      balance: 180,
    },
  ];

  const handleMarkPaid = (id: number) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header */}
      <header className="text-center text-[24px] font-semibold text-[#263238] py-4">
        我的帳本
      </header>
      {/* 欠款與應得 */}
      <div className="flex justify-between text-center">
        <div>
          <p className="text-sm text-[#71717A]">總欠款</p>
          <p className="text-[20px] font-semibold text-[#EF4444]">$1200.00</p>
        </div>
        <div>
          <p className="text-sm text-[#71717A]">總應得</p>
          <p className="text-[20px] font-semibold text-[#10B981]">$800.00</p>
        </div>
      </div>
      {/* 最近活躍事件 */}
      <div>
        <h2 className="text-md font-medium text-[#263238] mb-2">
          最近 2 個活躍事件
        </h2>
        <div className="flex space-x-4">
          {["週末聚餐", "三天兩夜小旅行"].map((title, i) => (
            <Card key={i} className=" rounded-lg p-4 w-[160px]">
              <CardContent className="p-0">
                <p className=" font-semibold text-sm">{title}</p>
                <p className=" text-xs">5 位參與人</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* 事件列表 */}
      <EventList events={events} />
      {/* 債務概覽 */}
      <DebtOverview debts={debts} onMarkPaid={handleMarkPaid} />
      <div className="text-right">
        <a
          href="/debtRelationship"
          className="text-sm text-[#00C4CC] font-medium"
        >
          查看更多 →
        </a>
      </div>
      {/* 創建事件按鈕 */}
      <Link to="/createEvent">
        <Button className="fixed bottom-8 right-8 bg-[#FF5733] text-white rounded-full w-12 h-12 p-0">
          <Plus className="w-5 h-5" />
        </Button>
      </Link>
    </div>
  );
};

export default PersonalDashboard;
