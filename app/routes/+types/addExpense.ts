import type { Category } from "~/services/fetchCategories";

export namespace Route {
  export interface LoaderData {
    members: { id: number; name: string; firebase_uid: string }[];
    categories: Category[];
    eventId: string;
  }
  export type ComponentProps = {
    loaderData: LoaderData;
  };
}
