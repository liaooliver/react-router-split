import { useState } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/addExpense";
import { Input } from "~/components/ui/Input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/RadioGroup";
import { Label } from "~/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select";
import { Button } from "~/components/ui/Button";
import { PageHeader } from "~/components/common/PageHeader";
import { AnimatedPageContainer } from "~/components/common/AnimatedPageContainer";

import { clientLoader } from "./addExpense.clientLoader";
export { clientLoader };

function AddExpense({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();

  // 直接用 loaderData 初始化 members, categories
  const [members] = useState<string[]>(loaderData.members.map((m) => m.name));
  const [categories] = useState(loaderData.categories);

  const [form, setForm] = useState({
    description: "",
    total: "",
    payers: loaderData.members.reduce<Record<string, number>>((acc, m) => {
      acc[m.name] = 0;
      return acc;
    }, {}),
    splitType: "even",
    shares: loaderData.members.reduce<Record<string, number>>((acc, m) => {
      acc[m.name] = 0;
      return acc;
    }, {}),
    note: "",
    category: "",
  });
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!form.description || !form.total) {
      setError("描述與總額為必填");
      return;
    }
    const totalPaid = Object.values(form.payers).reduce(
      (sum: number, amount) => sum + Number(amount),
      0
    );
    const totalShared =
      form.splitType === "even"
        ? totalPaid
        : Object.values(form.shares).reduce(
            (sum: number, amount) => sum + Number(amount),
            0
          );
    if (
      totalPaid !== Number(form.total) ||
      totalShared !== Number(form.total)
    ) {
      setError("付款與分攤金額總和必須等於總額");
      return;
    }

    try {
      // 1. 取得 eventId
      const eventId = loaderData.eventId;
      if (!eventId) {
        setError("找不到 eventId");
        return;
      }

      // 2. categoryId
      let categoryId = null;
      if (form.category) {
        const cat = loaderData.categories.find((c) => c.name === form.category);
        if (cat) categoryId = cat.id;
      }

      // 3. payers/shares userId
      const getUserIdByName = (name: string) => {
        const member = loaderData.members.find((m) => m.name === name);
        return member ? member.firebase_uid : null;
      };

      const payers = Object.entries(form.payers)
        .filter(([_, amount]) => Number(amount) > 0)
        .map(([name, amount]) => ({
          userId: getUserIdByName(name),
          name,
          amount: Number(amount),
        }));

      const shares = Object.entries(form.shares).map(([name, amount]) => ({
        userId: getUserIdByName(name),
        name,
        amount:
          form.splitType === "even"
            ? Number(form.total) / loaderData.members.length
            : Number(amount),
      }));
      console.log("shares", shares);

      // 4. 取得 idToken
      const { auth } = await import("~/lib/firebase");
      const user = auth.currentUser;
      if (!user) {
        setError("尚未登入");
        return;
      }
      const idToken = await user.getIdToken();
      const { default: axiosInstance } = await import("~/lib/axios");

      // 5. API 請求
      const now = new Date().toISOString();
      const apiPayload = {
        eventId,
        description: form.description,
        total: Number(form.total),
        categoryId,
        payers,
        shares,
        note: form.note || null,
        createdAt: now,
      };
      await axiosInstance.post("/expenses", apiPayload, {
        headers: {
          Authorization: `Bearer ${idToken}`,
        },
      });
      // 成功後導頁（回事件頁）
      navigate(`/events/${eventId}`);
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          error.message ||
          "新增費用失敗，請稍後再試"
      );
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSplitChange = (value: "even" | "custom") => {
    setForm((prev) => {
      const total = Number(prev.total) || 0;
      const shareAmount = total / members.length;
      const shares = members.reduce(
        (acc, member) => ({
          ...acc,
          [member]: value === "even" ? shareAmount : prev.shares[member],
        }),
        {}
      );
      return { ...prev, splitType: value, shares };
    });
  };

  return (
    <AnimatedPageContainer>
      <PageHeader title="新增費用" />
      <div className="space-y-4">
        <div>
          <Label className="text-[#263238] text-sm font-medium">描述</Label>
          <Input
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="輸入費用描述"
            className="mt-1 w-full h-10 border-[#D1D5DB] rounded-md bg-white text-black"
          />
        </div>
        <div>
          <Label className="text-[#263238] text-sm font-medium">
            總額 (TWD)
          </Label>
          <Input
            type="number"
            value={form.total}
            onChange={(e) => setForm({ ...form, total: e.target.value })}
            placeholder="輸入總額"
            className="mt-1 w-full h-10 border-[#D1D5DB] rounded-md bg-white text-black"
          />
        </div>
        <div>
          <Label className="text-[#263238] text-sm font-medium">付款人</Label>
          <div className="space-y-2 mt-1">
            {members.map((member) => (
              <div key={member} className="flex items-center space-x-2">
                <span className="w-20 text-[#263238]">{member}</span>
                <Input
                  type="number"
                  value={form.payers[member]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      payers: { ...form.payers, [member]: e.target.value },
                    })
                  }
                  className="w-20 h-8 border-[#D1D5DB] rounded-md bg-white text-[#263238]"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <Label className="text-[#263238] text-sm font-medium">分攤方式</Label>
          <RadioGroup
            value={form.splitType}
            onValueChange={handleSplitChange}
            className="mt-1 flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="even" id="even" />
              <Label htmlFor="even" className="text-[#263238] text-sm">
                平均分
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="manual" id="manual" />
              <Label htmlFor="manual" className="text-[#263238] text-sm">
                手動調
              </Label>
            </div>
          </RadioGroup>
        </div>
        {form.splitType === "manual" && (
          <div>
            <Label className="text-[#263238] text-sm font-medium">
              分攤金額
            </Label>
            <div className="space-y-2 mt-1">
              {members.map((member) => (
                <div key={member} className="flex items-center space-x-2">
                  <span className="w-20 text-[#263238]">{member}</span>
                  <Input
                    type="number"
                    value={form.shares[member]}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        shares: { ...form.shares, [member]: e.target.value },
                      })
                    }
                    className="w-20 h-8 border-[#D1D5DB] text-[#263238] rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <div>
          <Label className="text-[#263238] text-sm font-medium">
            備註（選填）
          </Label>
          <Input
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            placeholder="備註（選填）"
            className="mt-1 w-full h-10 border-[#D1D5DB] rounded-md bg-white text-black"
          />
        </div>
        <div>
          <Label className="text-[#263238] text-sm font-medium">
            類別（選填）
          </Label>
          <Select
            onValueChange={(value) => setForm({ ...form, category: value })}
            value={form.category}
          >
            <SelectTrigger className="mt-1 w-full h-10 border-[#D1D5DB] rounded-md bg-white text-black">
              <SelectValue placeholder="選擇類別" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.name}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {error && <p className="text-[#EF4444] text-xs">{error}</p>}
      </div>
      <div className="mt-4 flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={handleCancel}
          className="w-20 h-10 border-[#D1D5DB] rounded-md bg-muted text-muted-foreground hover:bg-muted/90"
        >
          取消
        </Button>
        <Button
          onClick={handleSave}
          className="w-20 h-10 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          儲存
        </Button>
      </div>
    </AnimatedPageContainer>
  );
}

export default AddExpense;
