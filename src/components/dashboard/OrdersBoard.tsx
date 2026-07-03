import { useState } from "react";

const tabs = ["New", "Preparing", "Served", "Past Orders"] as const;

type Tab = (typeof tabs)[number];

const orders = [
  { id: "#0001", product: "Waffle", amount: 100, status: "New" as Tab },
];

export function OrdersBoard() {
  const [active, setActive] = useState<Tab>("New");

  const visible = orders.filter((o) => o.status === active);

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Tabs */}
      <div className="rounded-[15px] bg-baky-surface p-[10px]">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`flex h-16 items-center justify-center rounded-[29px] px-4 text-2xl font-medium transition-colors ${
                active === tab
                  ? "bg-baky-card text-black"
                  : "text-black hover:bg-baky-card/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[15px] bg-baky-surface p-6">
        <div className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr] gap-4 border-b border-baky-muted/60 px-2 pb-3 text-[17px] text-baky-muted">
          <span>Order #</span>
          <span>Product</span>
          <span>Amount</span>
          <span>View</span>
        </div>

        {visible.length === 0 ? (
          <p className="px-2 py-8 text-xl text-baky-muted">No orders here.</p>
        ) : (
          <ul>
            {visible.map((o) => (
              <li
                key={o.id}
                className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr] items-center gap-4 px-2 py-5 text-2xl font-medium text-black"
              >
                <span>{o.id}</span>
                <span>{o.product}</span>
                <span>₹{o.amount}</span>
                <span />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
