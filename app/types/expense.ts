import { type Member } from "./event";

export type ExpenseCategory =
  | "food"
  | "transportation"
  | "entertainment"
  | "shopping"
  | "other";
export type SplitMethod = "equal" | "exact" | "percentage";

export interface PaymentShare {
  userId: number;
  name: string;
  amount: number;
}

export interface ExpenseShare {
  userId: number;
  name: string;
  amount: number;
}

export interface Expense {
  id: number;
  title: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  splitMethod: SplitMethod;
  payers: PaymentShare[];
  shares: ExpenseShare[];
  note?: string;
  eventId?: number;
}

export interface ExpenseFormData {
  title: string;
  amount: number;
  date: string;
  category: ExpenseCategory;
  splitMethod: SplitMethod;
  payers: PaymentShare[];
  shares: ExpenseShare[];
  note?: string;
}
