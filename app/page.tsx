import { Metadata } from "next";

import { HomeClient } from "./_components/HomeClient";

export const metadata: Metadata = {
  title: "Comments Page",
  description: "A page to view and add comments",
};

export default function Home() {
  return <HomeClient />;
}

