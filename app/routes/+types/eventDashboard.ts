import type { EventDetailInterface } from "~/types/eventDashboard";

export namespace Route {
  export interface LoaderData {
    event: EventDetailInterface;
  }
  export type ComponentProps = {
    loaderData: LoaderData;
  };
  export interface ClientLoaderArgs {
    params: { id: string };
  }
}
