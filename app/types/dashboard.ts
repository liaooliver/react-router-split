export interface UserInterface {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
}

export interface MemberInterface {
  id: number;
  name: string;
}

export interface ExpenseInterface {
  id: number;
  description: string;
}

import type { EventStatus } from "../constants/status";

export interface EventInterface {
  id: number;
  name: string;
  status: EventStatus;
  balance: number;
  date: string; // 格式: YYYY/M/D
  members: MemberInterface[];
  expenses: ExpenseInterface[];
}

export interface DebtInterface {
  id: number;
  from: string;
  to: string;
  amount: number;
  event: string;
  paid: boolean;
}

export interface DebtOverviewInterface {
  youOwe: number;
  othersOweYou: number;
  totalDebtCount: number;
  debts: DebtInterface[];
}

export interface DashboardDataInterface {
  user: UserInterface;
  events: EventInterface[];
  unpaidDebtsTotal: number;
  balanceTotal: number;
  debtOverview: DebtOverviewInterface;
}

export interface DashboardResponseInterface {
  message: string;
  data: DashboardDataInterface;
}

export interface DashboardErrorResponseInterface {
  error: string;
}
