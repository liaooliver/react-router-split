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

export interface CreateEventResponseInterface {
  status: string;
  message: string;
  event: {
    id: number;
    name: string;
    creator_id: string;
    status: string;
    created_at: string;
    updated_at: string;
  };
}
