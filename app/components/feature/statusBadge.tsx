import { EventStatus, StatusStyle, StatusLabel } from "~/constants/status";

interface StatusBadgeProps {
  status: EventStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusStyle = (status: EventStatus) => {
    return StatusStyle[status] || "bg-gray-300 text-gray-800";
  };

  const translateStatus = (status: EventStatus) => {
    return StatusLabel[status] || status;
  };

  return (
    <span
      className={`inline-block text-xs px-2 py-1 rounded-full mt-1 ${getStatusStyle(
        status
      )}`}
    >
      {translateStatus(status)}
    </span>
  );
};

export default StatusBadge;
