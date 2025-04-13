import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import Layout from "~/components/common/layout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <>
      <h1 className="text-black">Home Page</h1>
      <div className="w-full h-5 bg-amber-600"></div>
    </>
  );
}
