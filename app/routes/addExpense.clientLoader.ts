import { fetchEventMembers } from "~/services/fetchEventMembers";
import { fetchCategories } from "~/services/fetchCategories";
import type { Route } from "./+types/addExpense";
import { isAuth } from "~/services/auth";

export async function clientLoader({
  params,
}: {
  params: { id: string };
}): Promise<Route.LoaderData> {
  const isLogged = await isAuth();
  if (!isLogged) {
    throw new Response("未登入", { status: 401 });
  }
  const eventId = params.id;
  if (!eventId) throw new Response("缺少 eventId", { status: 400 });

  const [members, categories] = await Promise.all([
    fetchEventMembers(eventId),
    fetchCategories(),
  ]);
  return { members, categories, eventId };
}
