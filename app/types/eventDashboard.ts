export interface MemberInterface {
  id: string;
  name: string;
  avatar: string;
}
export interface BalanceInterface {
  userId: string;
  name: string;
  amount: number;
}
export interface ExpenseInterface {
  id: number;
  title: string;
  amount: number;
  category: string;
  paidBy: string;
  createdAt: string; // YYYY-MM-DD
}
export interface CategoryDistributionInterface {
  category: string;
  amount: number;
}
export interface RelatedExpenseInterface {
  id: number;
  title: string;
  amount: number;
  date: string;
}
export interface DebtInterface {
  id: number;
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  amount: number;
  paid: boolean;
  paidAt: string | null;
  relatedExpenses: RelatedExpenseInterface[];
}
export interface EventDetailInterface {
  eventId: number;
  title: string;
  status: "ACTIVE" | "PENDING" | "SETTLED";
  members: MemberInterface[];
  balances: BalanceInterface[];
  expenses: ExpenseInterface[];
  categoryDistribution: CategoryDistributionInterface[];
  totalAmount: number;
  debts: DebtInterface[];
}
export interface EventResponseInterface {
  message: string;
  data: EventDetailInterface;
}
export interface EventErrorResponseInterface {
  error: string;
}
