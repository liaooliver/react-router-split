import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "~/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/Dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import { Input } from "~/components/ui/Input";
import { Label } from "~/components/ui/Label";
import { Switch } from "~/components/ui/Switch";

// 表單驗證 Schema
const formSchema = z.object({
  username: z.string().min(2, "使用者名稱至少需要 2 個字元"),
  email: z.string().email("請輸入有效的電子郵件地址"),
});

export default function ExamplePage() {
  const [isOpen, setIsOpen] = useState(false);
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  // 表單設定
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
    },
  });

  // 表單提交處理
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* 範例 1: 表單應用 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">表單範例</h2>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>使用者名稱</FormLabel>
                  <FormControl>
                    <Input placeholder="輸入使用者名稱" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>電子郵件</FormLabel>
                  <FormControl>
                    <Input placeholder="輸入電子郵件" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">提交</Button>
          </form>
        </Form>
      </section>

      {/* 範例 2: Dialog 應用 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">對話框範例</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline">打開對話框</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>對話框標題</DialogTitle>
            </DialogHeader>
            <div className="py-4">這是一個對話框範例，可以放置任何內容。</div>
            <div className="flex justify-end">
              <Button onClick={() => setIsOpen(false)}>關閉</Button>
            </div>
          </DialogContent>
        </Dialog>
      </section>

      {/* 範例 3: Switch 應用 */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold">開關範例</h2>
        <div className="flex items-center space-x-2">
          <Switch
            id="notifications"
            checked={notificationEnabled}
            onCheckedChange={setNotificationEnabled}
          />
          <Label htmlFor="notifications">
            {notificationEnabled ? "通知已開啟" : "通知已關閉"}
          </Label>
        </div>
      </section>
    </div>
  );
}
