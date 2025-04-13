export interface Member {
  id: number;
  name: string;
  avatar: string;
}

export interface Balance {
  userId: number;
  name: string;
  amount: number;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
}

export interface Event {
  eventId: string;
  title: string;
  status: "settled" | "unsettled";
  members: Member[];
  balances: Balance[];
  expenses: Expense[];
}
