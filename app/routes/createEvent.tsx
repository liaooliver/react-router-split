import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

// 模擬 API 呼叫
const mockCreateEvent = async (
  eventName: string
): Promise<{ id: number; name: string }> => {
  // 模擬 API 延遲
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 模擬回傳新建立的事件資料
  return {
    id: Math.floor(Math.random() * 1000) + 1, // 隨機產生 ID
    name: eventName,
  };
};

const CreateEvent = () => {
  const [eventName, setEventName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // 呼叫模擬的 API
      const newEvent = await mockCreateEvent(eventName);

      // 轉跳到新建立的事件頁面
      navigate(`/events/${newEvent.id}`);
    } catch (error) {
      console.error("建立事件失敗:", error);
      alert("建立事件失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      {/* Header */}
      <header className="flex items-center justify-between h-16 px-4 relative m-0">
        <Link to="/dashboard" className="flex items-center gap-4">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
          <h1 className="text-lg font-semibold text-gray-800">建立分帳事件</h1>
        </Link>

        {/* Decorative hand-drawn elements */}
        <div className="absolute right-12 top-6">
          <div className="h-1 w-4 bg-orange-400 rounded-full transform rotate-45"></div>
        </div>
        <div className="absolute right-8 top-8">
          <div className="h-2 w-2 bg-orange-300 rounded-full"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Event Name Input */}
          <div className="space-y-2">
            <label
              htmlFor="eventName"
              className="block text-sm font-medium text-gray-500"
            >
              事件名稱
            </label>
            <Input
              id="eventName"
              type="text"
              placeholder="請輸入事件名稱"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              required
              disabled={isLoading}
              className="text-black"
            />
          </div>

          {/* Save Button */}
          <Button
            type="submit"
            className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
            disabled={isLoading}
          >
            {isLoading ? "建立中..." : "儲存"}
          </Button>
        </form>
      </main>
    </div>
  );
};

export default CreateEvent;
