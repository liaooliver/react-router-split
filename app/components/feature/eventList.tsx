import { Link } from "react-router";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/Card";
import { CalendarIcon } from "lucide-react";
import type { EventStatus } from "~/constants/status";
import type { EventInterface } from "~/types/dashboard";

interface EventListProps {
  events: EventInterface[];
}

const EventList = ({ events }: EventListProps) => {
  const getStatusInfo = (status: EventStatus) => {
    switch (status) {
      case "active":
        return {
          label: "進行中",
          desc: "未結算",
          bgColor: "bg-blue-100 text-blue-800",
        };
      case "pending":
        return {
          label: "待還款",
          desc: "部分還款",
          bgColor: "bg-yellow-100 text-yellow-800",
        };
      case "settled":
        return {
          label: "已結算",
          desc: "已結算",
          bgColor: "bg-green-100 text-green-800",
        };
      case "finalized":
        return {
          label: "已完成",
          desc: "已完成",
          bgColor: "bg-gray-900 text-gray-100",
        };
      default:
        return {
          label: "未知",
          desc: "未知狀態",
          bgColor: "bg-gray-100 text-gray-800",
        };
    }
  };

  return (
    <div>
      <h2 className="text-md font-medium text-[#263238] mb-4">所有事件</h2>
      <div className="grid grid-cols-1 gap-4 max-h-[500px] overflow-auto">
        {events.map((event) => {
          const statusInfo = getStatusInfo(event.status);
          return (
            <Link to={`/events/${event.id}`} key={event.id} className="block">
              <Card className="py-3 gap-3 border border-gray-200 hover:border-[#0066CC]">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {event.name}
                  </CardTitle>
                  <CardDescription className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {event.date}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    {event.members.length} 位成員 • {event.expenses.length}{" "}
                    筆費用
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    累積費用：
                    <span
                      className={
                        event.balance >= 0 ? "text-[#10B981]" : "text-[#EF4444]"
                      }
                    >
                      ${event.balance}
                    </span>
                  </p>
                </CardContent>
                <CardFooter>
                  <div className="w-full flex items-center">
                    <span
                      className={`text-sm font-medium px-2 py-0.5 rounded-full ${statusInfo.bgColor}`}
                    >
                      {statusInfo.label}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default EventList;
