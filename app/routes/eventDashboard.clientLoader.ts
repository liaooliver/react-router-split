import { fetchProtectedEventDetail } from "~/services/fetchProtectedEventDetail";
import type { Route } from "./+types/eventDashboard";
import { isAuth } from "~/services/auth";

export async function clientLoader({ params }: Route.ClientLoaderArgs): Promise<Route.LoaderData> {
  const isLogged = await isAuth();
  if (!isLogged) {
    throw new Response("未登入", { status: 401 });
  }
  const eventId = params.id;
  try {
    const data = await fetchProtectedEventDetail(eventId!);
    return { event: data.data };
  } catch (err: any) {
    throw new Response(err.message || "資料載入失敗", { status: 500 });
  }
}
