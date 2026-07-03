import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Topbar } from "@/components/dashboard/Topbar";
import { PosBoard } from "@/components/dashboard/PosBoard";

export const Route = createFileRoute("/pos")({
  head: () => ({
    meta: [
      { title: "POS — Baky Dessert House" },
      {
        name: "description",
        content:
          "Point of sale for Baky Dessert House — browse categories, pick items and variants, and build orders.",
      },
      { property: "og:title", content: "POS — Baky Dessert House" },
      {
        property: "og:description",
        content: "Browse categories, pick items and variants, and build orders.",
      },
    ],
  }),
  component: Pos,
});

function Pos() {
  return (
    <div className="flex min-h-screen bg-white font-sans text-black">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title="POS" />

        <main className="flex flex-1 p-6">
          <PosBoard />
        </main>
      </div>
    </div>
  );
}
