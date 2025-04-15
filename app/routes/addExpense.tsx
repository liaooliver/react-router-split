import { useMemo, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Input } from "~/components/ui/input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { PageHeader } from "~/components/common/PageHeader";
import { AnimatedPageContainer } from "~/components/common/AnimatedPageContainer";

function AddExpense() {
  const { id: eventId } = useParams();
  const navigate = useNavigate();

  // ✅ 假資料（可自行調整）
  const mockMembers = useMemo(() => ["小美", "阿成", "曉明"], []);
  const [members, setMembers] = useState<string[]>([]);

  const [form, setForm] = useState({
    description: "",
    total: "",
    payers: {},
    splitType: "even",
    shares: {},
    note: "",
    category: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const fakeMembers = mockMembers;
    setMembers(fakeMembers);
    setForm((prev) => ({
      ...prev,
      payers: fakeMembers.reduce(
        (acc, member) => ({ ...acc, [member]: 0 }),
        {}
      ),
      shares: fakeMembers.reduce(
        (acc, member) => ({ ...acc, [member]: 0 }),
        {}
      ),
    }));
  }, [mockMembers]);

  const handleSave = async () => {
    if (!form.description || !form.total) {
      setError("描述與總額為必填");
      return;
    }
    const totalPaid = Object.values(form.payers).reduce(
      (sum: number, amount) => sum + Number(amount),
      0
    );
    const totalShared = Object.values(form.shares).reduce(
      (sum: number, amount) => sum + Number(amount),
      0
    );
    console.log("form.total", form);
    console.log("totalPaid", totalPaid);
    console.log("totalShared", totalShared);
    if (
      totalPaid !== Number(form.total) ||
      totalShared !== Number(form.total)
    ) {
      setError("付款與分攤金額總和必須等於總額");
      return;
    }

    const payload = {
      event_id: eventId,
      description: form.description,
      total: Number(form.total),
      payers: Object.entries(form.payers).map(([member, amount]) => ({
        member_name: member,
        amount,
      })),
      shares: Object.entries(form.shares).map(([member, amount]) => ({
        member_name: member,
        amount,
      })),
      note: form.note || null,
      category: form.category || null,
    };

    console.log("📝 模擬儲存資料:", payload);
    navigate(`/events/${eventId}`);
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleSplitChange = (value) => {
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
          >
            <SelectTrigger className="mt-1 w-full h-10 border-[#D1D5DB] rounded-md bg-white text-black">
              <SelectValue placeholder="選擇類別" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="餐費">餐費</SelectItem>
              <SelectItem value="交通">交通</SelectItem>
              <SelectItem value="住宿">住宿</SelectItem>
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
