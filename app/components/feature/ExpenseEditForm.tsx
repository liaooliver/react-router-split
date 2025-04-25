import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useMemo, useEffect, useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import { Input } from "~/components/ui/Input";
import { Button } from "~/components/ui/Button";
import { Label } from "~/components/ui/Label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select";
import { RadioGroup, RadioGroupItem } from "~/components/ui/RadioGroup";
import { type Expense, type ExpenseFormData } from "~/types/expense";
import { useEventMembers, type EventMember } from "~/hooks/useEventMembers";
import { useCategories } from "~/hooks/useCategories";

const expenseFormSchema = z.object({
  title: z.string().min(1, "請輸入費用名稱"),
  amount: z.coerce
    .number()
    .min(0.01, "金額必須大於 0")
    .max(1000000, "金額太大"),
  date: z.string().min(1, "請選擇日期"),
  category: z.string().min(1, "請選擇類別"),
  splitType: z.enum(["even", "manual"], {
    required_error: "請選擇分攤方式",
  }),
  note: z.string().optional(),
  payers: z.record(z.string(), z.coerce.number()),
  shares: z.record(z.string(), z.coerce.number()),
});

interface ExpenseEditFormProps {
  expense?: Expense;
  eventId?: string | number;
  onSubmit: (data: ExpenseFormData) => void;
  onCancel: () => void;
}

export function ExpenseEditForm({
  expense,
  eventId,
  onSubmit,
  onCancel,
}: ExpenseEditFormProps) {
  // 取得 event 成員
  const {
    members,
    isLoading: isMembersLoading,
    error: memberError,
  } = useEventMembers(eventId ? String(eventId) : undefined);

  // 取得類別資料
  const {
    categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = useCategories();
  const [error, setError] = useState("");

  // 將 members 轉為名稱陣列（或 id 陣列，根據需求）
  const memberIds = useMemo(() => members.map((m) => m.id), [members]);

  // --- 工具函數: 依 members 產生完整 payers/shares 物件 ---
  function buildMemberAmountMap(
    members: EventMember[] = [],
    arr: { userId: string | number; amount: number }[] = []
  ) {
    const map = new Map(arr.map((item) => [String(item.userId), item.amount]));

    return members.reduce((acc, m) => {
      acc[String(m.id)] = map.get(String(m.firebase_uid)) ?? 0;

      return acc;
    }, {} as Record<string, number>);
  }

  const form = useForm({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      title: expense?.title || "",
      amount: expense?.amount || 0,
      date: expense?.date || new Date().toISOString().split("T")[0],
      category: expense?.category || "餐費",
      splitType: expense?.splitMethod === "equal" ? "even" : "manual",
      note: expense?.note || "",
      payers: {}, // 先給空物件，等 members 載入後 reset
      shares: {},
    },
  });

  // 當 members/cateogries 載入或 expense 變動時，自動 reset defaultValues
  useEffect(() => {
    if (!members || members.length === 0) return;
    form.reset({
      title: expense?.title || "",
      amount: expense?.amount || 0,
      date: expense?.date || new Date().toISOString().split("T")[0],
      category: expense?.category || "餐費",
      splitType: expense?.splitMethod === "equal" ? "even" : "manual",
      note: expense?.note || "",
      payers: buildMemberAmountMap(members, expense?.payers),
      shares: buildMemberAmountMap(members, expense?.shares),
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members, categories, expense]);

  const watchAmount = form.watch("amount");
  const watchSplitType = form.watch("splitType");

  useEffect(() => {
    if (watchSplitType === "even" && watchAmount && memberIds.length > 0) {
      const shareAmount = Number(watchAmount) / memberIds.length;
      const shares = memberIds.reduce(
        (acc, id) => ({ ...acc, [id]: shareAmount }),
        {}
      );
      form.setValue("shares", shares);
    }
  }, [watchAmount, watchSplitType, memberIds, form]);

  const handleSubmit = (data: any) => {
    const totalPaid = Object.values(data.payers).reduce(
      (sum: number, amount: any) => sum + Number(amount),
      0
    );
    const totalShared = Object.values(data.shares).reduce(
      (sum: number, amount: any) => sum + Number(amount),
      0
    );

    if (
      totalPaid !== Number(data.amount) ||
      totalShared !== Number(data.amount)
    ) {
      setError("付款與分攤金額總和必須等於總額");
      return;
    }

    const formattedData = {
      ...data,
      payers: Object.entries(data.payers).map(([name, amount]) => ({
        userId: name,
        name,
        amount: Number(amount),
      })),
      shares: Object.entries(data.shares).map(([name, amount]) => ({
        userId: name,
        name,
        amount: Number(amount),
      })),
    };

    onSubmit(formattedData);
  };

  // 等待所有資料都到齊才渲染表單
  if (isMembersLoading || isCategoriesLoading) {
    return <div>資料載入中...</div>;
  }
  if (memberError) {
    return <div className="text-red-500">成員載入失敗：{memberError}</div>;
  }
  if (categoriesError) {
    return <div className="text-red-500">類別載入失敗：{categoriesError}</div>;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>描述</FormLabel>
              <FormControl>
                <Input placeholder="輸入費用描述" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>總額 (TWD)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="輸入總額"
                  {...field}
                  value={field.value ?? 0}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <Label className="text-[#263238] text-sm font-medium">付款人</Label>
          <div className="space-y-2 mt-1">
            {members.map((member) => (
              <div key={member.id} className="flex items-center space-x-2">
                <span className="w-20 text-[#263238]">{member.name}</span>
                <FormField
                  control={form.control}
                  name={`payers.${member.id}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          className="w-32 h-8 border-[#D1D5DB] rounded-md bg-white"
                          {...field}
                          value={field.value ?? 0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-[#263238] text-sm font-medium">分攤方式</Label>
          <FormField
            control={form.control}
            name="splitType"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
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
                      <Label
                        htmlFor="manual"
                        className="text-[#263238] text-sm"
                      >
                        手動調
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {watchSplitType === "manual" && (
          <div>
            <Label className="text-[#263238] text-sm font-medium">
              分攤金額
            </Label>
            <div className="space-y-2 mt-1">
              {members.map((member) => (
                <div key={member.id} className="flex items-center space-x-2">
                  <span className="w-20 text-[#263238]">{member.name}</span>
                  <FormField
                    control={form.control}
                    name={`shares.${member.id}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            className="w-32 h-8 border-[#D1D5DB] rounded-md"
                            {...field}
                            value={field.value ?? 0}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 類別選擇欄位 */}
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>類別</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="請選擇類別" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>備註（選填）</FormLabel>
              <FormControl>
                <Input placeholder="備註（選填）" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <p className="text-[#EF4444] text-xs">{error}</p>}

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="border-[#D1D5DB] rounded-md bg-muted text-muted-foreground hover:bg-muted/90"
          >
            取消
          </Button>
          <Button type="submit">儲存</Button>
        </div>
      </form>
    </Form>
  );
}
