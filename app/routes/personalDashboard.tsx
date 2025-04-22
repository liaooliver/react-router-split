import React, { useEffect, useState } from "react";
import { fetchProtectedDashboardData } from "~/services/fetchProtectedData";
import type { DashboardDataInterface } from "~/types/dashboard";
import type { Route } from "./+types/home";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Plus } from "lucide-react";
import DebtOverview from "~/components/feature/debtOverview";
import EventList from "~/components/feature/eventList";
import { Link } from "react-router";
import { useAuth } from "~/contexts/AuthContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

const PersonalDashboard = () => {
  // 1. 所有 hooks 一律放最上面
  const { currentUser, logOut } = useAuth();
  const [dashboardData, setDashboardData] =
    useState<DashboardDataInterface | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProtectedDashboardData();
        console.log(data);
        setDashboardData(data.data);
      } catch (err: any) {
        logOut();
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const getToken = async () => {
      if (currentUser) {
        const token = await currentUser.getIdToken(true);
        console.log(token);
        localStorage.setItem("token", JSON.stringify(token));
      }
    };
    getToken();
  }, [currentUser]);

  // 2. early return 放 hooks 之後
  if (loading) {
    return <div className="text-center mt-8">載入中...</div>;
  }
  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
  }
  if (!dashboardData) {
    return <div className="text-center mt-8">沒有資料</div>;
  }

  const { events, unpaidDebtsTotal, balanceTotal, user, debtOverview } =
    dashboardData;
  const debts = debtOverview?.debts || [];

  const handleMarkPaid = (id: number) => {
    // setDashboardData((prev) => ({
    //   ...prev,
    //   events: prev.events.map((event) =>
    //     event.id === id
    //       ? { ...event, status: EventStatus.ACTIVE }
    //       : event
    //   ),
    // }));
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header */}
      <header className="text-center text-[24px] font-semibold text-[#263238] py-4">
        我的帳本
      </header>
      {/* 欠款與應得 */}
      <div className="flex justify-evenly text-center bg-white p-4 border rounded-xl">
        <div>
          <p className="text-sm text-[#71717A]">待收欠款</p>
          <p className="text-[20px] font-semibold text-[#EF4444]">
            ${unpaidDebtsTotal}
          </p>
        </div>
        {/* <div>
          <p className="text-sm text-[#71717A]">總應得</p>
          <p className="text-[20px] font-semibold text-[#10B981]">
            ${balanceTotal}
          </p>
        </div> */}
      </div>
      {/* 最近活躍事件 */}
      {/* <div>
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
      </div> */}

      {/* 事件列表 */}
      <EventList events={events} />
      {/* 債務概覽 */}
      <DebtOverview debts={debts} />

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
