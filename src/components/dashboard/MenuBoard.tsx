import { useState } from "react";

const initialCategories = [
  { name: "Waffle", enabled: true },
  { name: "Shakes", enabled: true },
  { name: "Signature", enabled: true },
  { name: "Brownie", enabled: true },
];

const initialItems = [
  { name: "Hazelnut Waffle", price: 100, variants: 3, enabled: true },
  { name: "Hazelnut Waffle", price: 100, variants: 3, enabled: true },
  { name: "Hazelnut Waffle", price: 100, variants: 3, enabled: true },
];

function Toggle({
  on,
  onToggle,
}: {
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={on}
      className={`relative h-[21px] w-[43px] shrink-0 rounded-full transition-colors ${
        on ? "bg-baky-green" : "bg-baky-track"
      }`}
    >
      <span
        className={`absolute top-1/2 h-[17px] w-[17px] -translate-y-1/2 rounded-full bg-white transition-all ${
          on ? "left-[24px]" : "left-[2px]"
        }`}
      />
    </button>
  );
}

export function MenuBoard() {
  const [categories, setCategories] = useState(initialCategories);
  const [items, setItems] = useState(initialItems);

  return (
    <div className="flex flex-1 flex-col rounded-[15px] bg-baky-surface">
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-2">
        {/* Category column */}
        <section className="flex flex-col border-b border-baky-muted/50 p-6 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-black">
              Category ({categories.length})
            </h2>
            <button className="text-lg font-semibold text-[#1177E5]">
              + ADD NEW
            </button>
          </div>

          <ul className="mt-6 divide-y divide-baky-muted/30">
            {categories.map((c, i) => (
              <li
                key={c.name}
                className={`flex items-center justify-between px-2 py-4 text-xl text-black ${
                  i === 0 ? "bg-baky-card" : ""
                }`}
              >
                <span>{c.name}</span>
                <Toggle
                  on={c.enabled}
                  onToggle={() =>
                    setCategories((prev) =>
                      prev.map((item, idx) =>
                        idx === i ? { ...item, enabled: !item.enabled } : item,
                      ),
                    )
                  }
                />
              </li>
            ))}
          </ul>
        </section>

        {/* Items column */}
        <section className="flex flex-col p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-black">Items (no)</h2>
            <button className="text-lg font-semibold text-[#1177E5]">
              + ADD NEW
            </button>
          </div>

          <ul className="mt-6 space-y-6">
            {items.map((item, i) => (
              <li key={i} className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-baky-bar-strong" />
                    <p className="text-xl text-black">
                      {item.name}, ₹{item.price}
                    </p>
                  </div>
                  <button className="mt-1 pl-4 text-[15px] font-semibold text-[#1177E5]">
                    + {item.variants} Variants
                  </button>
                </div>
                <Toggle
                  on={item.enabled}
                  onToggle={() =>
                    setItems((prev) =>
                      prev.map((it, idx) =>
                        idx === i ? { ...it, enabled: !it.enabled } : it,
                      ),
                    )
                  }
                />
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
