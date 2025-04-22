import React, { useState } from "react";
import { ArrowLeft, Plus, ArrowRight } from "lucide-react";
import { AnimatedPageContainer } from "~/components/common/AnimatedPageContainer";
import { PageHeader } from "~/components/common/PageHeader";
import DebtOverview from "~/components/feature/debtOverview";

const DebtRelationshipPage = () => {
  const [debts, setDebts] = useState([
    {
      id: 1,
      from: "小智",
      to: "小明",
      amount: 266.67,
      event: "晚餐聚會",
      paid: false,
    },
    {
      id: 2,
      from: "小花",
      to: "小華",
      amount: 150,
      event: "電影日",
      paid: false,
    },
  ]);

  const handleMarkPaid = (id: number) => {
    setDebts((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <AnimatedPageContainer>
      <PageHeader title="分帳關係" />
      <DebtOverview debts={debts} />
    </AnimatedPageContainer>
  );
};

export default DebtRelationshipPage;
