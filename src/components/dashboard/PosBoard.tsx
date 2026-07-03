const categories = ["Waffle", "Shakes", "Signature", "Brownie"];

const variants = ["Belgian", "Brownie", "Redvelvet"];

const items = [
  { name: "Hazelnut Waffle", price: 100, showVariants: true },
  { name: "Hazelnut Waffle", price: 100, showVariants: false },
  { name: "Hazelnut Waffle", price: 100, showVariants: false },
];

export function PosBoard() {
  return (
    <div className="flex flex-1 flex-col rounded-[15px] bg-baky-surface">
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
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
                key={c}
                className={`flex items-center justify-between px-2 py-4 text-xl text-black ${
                  i === 0 ? "bg-baky-card" : ""
                }`}
              >
                <span>{c}</span>
                <button className="text-lg font-semibold text-[#1177E5]">+</button>
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

          <ul className="mt-6 flex-1 space-y-4">
            {items.map((item, i) => (
              <li
                key={i}
                className={`rounded-md p-4 ${i === 0 ? "bg-baky-card" : ""}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-baky-bar-strong" />
                      <p className="text-xl text-black">
                        {item.name}, ₹{item.price}
                      </p>
                    </div>
                    <button className="mt-1 pl-4 text-[15px] font-semibold text-[#1177E5]">
                      + 3 Variants
                    </button>

                    {item.showVariants && (
                      <ul className="mt-2 space-y-2 pl-4">
                        {variants.map((v) => (
                          <li
                            key={v}
                            className="flex items-center gap-2 text-[15px] text-baky-muted"
                          >
                            <span className="h-[9px] w-[9px] shrink-0 rounded-full border-[1.5px] border-baky-muted" />
                            {v}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <button className="shrink-0 text-lg font-semibold text-[#1177E5]">
                    + ADD
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-end">
            <button className="flex h-[74px] w-full max-w-[475px] items-center justify-center rounded-[13px] bg-[#3395FF] text-3xl font-medium text-white transition-colors hover:bg-[#2a86ea]">
              Add
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
