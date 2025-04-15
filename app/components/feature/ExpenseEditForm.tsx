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
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { type Expense, type ExpenseFormData } from "~/types/expense";

// 模擬成員資料（實際應從 props 或 API 獲取）
const mockMembers = ["小美", "阿成", "曉明"];

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
  onSubmit: (data: ExpenseFormData) => void;
  onCancel: () => void;
}

export function ExpenseEditForm({
  expense,
  onSubmit,
  onCancel,
}: ExpenseEditFormProps) {
  const [error, setError] = useState("");
  const [members] = useState(mockMembers);

  const defaultPayers = useMemo(() => {
    return members.reduce((acc, member) => ({ ...acc, [member]: 0 }), {});
  }, [members]);

  const defaultShares = useMemo(() => {
    return members.reduce((acc, member) => ({ ...acc, [member]: 0 }), {});
  }, [members]);

  const form = useForm({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: expense
      ? {
          title: expense.title,
          amount: expense.amount,
          date: expense.date,
          category: expense.category,
          splitType: "even",
          note: expense.note || "",
          payers: defaultPayers,
          shares: defaultShares,
        }
      : {
          title: "",
          amount: 0,
          date: new Date().toISOString().split("T")[0],
          category: "餐費",
          splitType: "even",
          note: "",
          payers: defaultPayers,
          shares: defaultShares,
        },
  });

  const watchAmount = form.watch("amount");
  const watchSplitType = form.watch("splitType");

  useEffect(() => {
    if (watchSplitType === "even" && watchAmount) {
      const shareAmount = Number(watchAmount) / members.length;
      const shares = members.reduce(
        (acc, member) => ({ ...acc, [member]: shareAmount }),
        {}
      );
      form.setValue("shares", shares);
    }
  }, [watchAmount, watchSplitType, members, form]);

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
              <div key={member} className="flex items-center space-x-2">
                <span className="w-20 text-[#263238]">{member}</span>
                <FormField
                  control={form.control}
                  name={`payers.${member}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="number"
                          className="w-32 h-8 border-[#D1D5DB] rounded-md bg-white"
                          {...field}
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
                <div key={member} className="flex items-center space-x-2">
                  <span className="w-20 text-[#263238]">{member}</span>
                  <FormField
                    control={form.control}
                    name={`shares.${member}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            className="w-32 h-8 border-[#D1D5DB] rounded-md"
                            {...field}
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

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className="w-32">
              <FormLabel>類別（選填）</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl className="w-full">
                  <SelectTrigger>
                    <SelectValue placeholder="選擇類別" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="餐費">餐飲</SelectItem>
                  <SelectItem value="交通">交通</SelectItem>
                  <SelectItem value="住宿">住宿</SelectItem>
                  <SelectItem value="購物">購物</SelectItem>
                  <SelectItem value="其他">其他</SelectItem>
                </SelectContent>
              </Select>
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
