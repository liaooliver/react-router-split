import { Link } from "react-router";
import { Card, CardContent } from "~/components/ui/card";
import StatusBadge from "~/components/feature/statusBadge";
import { EventStatus } from "~/constants/status";

interface Event {
  id: number;
  name: string;
  status: EventStatus;
  balance: number;
}

interface EventListProps {
  events: Event[];
}

const EventList = ({ events }: EventListProps) => {
  return (
    <div>
      <h2 className="text-md font-medium text-[#263238] mb-2">所有事件</h2>
      <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2">
        {events.map((e) => (
          <Link className="block" to={`/events/${e.id}`} key={e.id}>
            <Card className="p-4">
              <CardContent className="p-0">
                <div className="flex justify-between items-center">
                  <p className="text-[#263238] font-semibold text-sm">
                    {e.name}
                  </p>
                  <StatusBadge status={e.status}></StatusBadge>
                </div>
                <div className="mt-2 text-sm text-[#71717A]">
                  淨餘額：
                  <span
                    className={`${
                      e.balance >= 0 ? "text-[#10B981]" : "text-[#EF4444]"
                    }`}
                  >
                    ${e.balance}
                  </span>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default EventList;
