export enum EventStatus {
  ACTIVE = "active",
  PENDING = "pending",
  ARCHIVED = "archived",
}

export const StatusStyle = {
  [EventStatus.ACTIVE]: "bg-green-500 text-white",
  [EventStatus.PENDING]: "bg-yellow-400 text-gray-800",
  [EventStatus.ARCHIVED]: "bg-gray-400 text-white",
} as const;

export const StatusLabel = {
  [EventStatus.ACTIVE]: "活躍",
  [EventStatus.PENDING]: "待結算",
  [EventStatus.ARCHIVED]: "已封存",
} as const;
