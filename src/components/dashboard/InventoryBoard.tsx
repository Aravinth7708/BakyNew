import { Pencil } from "lucide-react";

const items = [
  { name: "Waffle Flour (kg)", stock: "2 / 10", low: true },
  { name: "Brownie Plates (Pack)", stock: "2 / 10", low: false },
];

export function InventoryBoard() {
  return (
    <div className="flex flex-1 flex-col rounded-[15px] bg-baky-surface p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium text-black">Item (no)</h2>
        <button className="text-lg font-semibold text-[#1177E5]">
          + ADD NEW
        </button>
      </div>

      <ul className="mt-6 divide-y divide-baky-muted/30">
        {items.map((item, i) => (
          <li
            key={i}
            className={`flex items-center justify-between gap-4 px-2 py-4 ${
              item.low ? "bg-baky-card" : ""
            }`}
          >
            <span
              className={`min-w-0 truncate text-xl ${
                item.low ? "text-black" : "text-baky-muted"
              }`}
            >
              {item.name}
            </span>
            <div className="flex shrink-0 items-center gap-3">
              <span
                className={`text-lg font-semibold ${
                  item.low ? "text-[#1177E5]" : "text-baky-muted"
                }`}
              >
                {item.stock}
              </span>
              <button aria-label="Edit item">
                <Pencil
                  className="h-5 w-5"
                  style={{ color: item.low ? "#FF8205" : "#686868" }}
                  strokeWidth={2}
                />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
