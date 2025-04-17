export enum EventStatus {
  ACTIVE = "active",
  PENDING = "pending",
  settled = "settled",
}

export const StatusStyle = {
  [EventStatus.ACTIVE]: "bg-green-500 text-white",
  [EventStatus.PENDING]: "bg-yellow-400 text-gray-800",
  [EventStatus.settled]: "bg-gray-400 text-white",
} as const;

export const StatusLabel = {
  [EventStatus.ACTIVE]: "活躍",
  [EventStatus.PENDING]: "待結算",
  [EventStatus.settled]: "已封存",
} as const;
