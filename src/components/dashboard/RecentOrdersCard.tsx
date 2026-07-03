import { useBakyData } from "@/context/BakyDataContext";

export function RecentOrdersCard() {
  const { orders } = useBakyData();
  const recent = orders.slice(0, 3);

  return (
    <div className="rounded-[15px] bg-baky-card p-8">
      <p className="text-xl font-medium text-baky-muted">Recent Orders</p>

      <div className="mt-6 grid grid-cols-4 border-b border-baky-muted/60 pb-3 text-[17px] font-normal text-baky-muted">
        <span>Order #</span>
        <span>Product</span>
        <span>Amount</span>
        <span>Status</span>
      </div>

      <div className="mt-4 space-y-2">
        {recent.map((o) => {
          const productText = o.items.map((i) => i.name).join(", ");
          return (
            <div
              key={o.id}
              className="grid grid-cols-4 items-center text-xl font-normal text-black py-3 border-b border-baky-muted/10 last:border-0"
            >
              <span className="font-semibold">{o.id}</span>
              <span className="truncate pr-2" title={productText}>
                {productText}
              </span>
              <span>₹{o.amount}</span>
              <span>
                <span
                  className={`inline-flex items-center text-[15px] font-semibold px-2 py-0.5 rounded-full ${
                    o.status === "New"
                      ? "text-[#1177E5] bg-[#1177E5]/10"
                      : o.status === "Preparing"
                        ? "text-[#FF8205] bg-[#FF8205]/10"
                        : o.status === "Served"
                          ? "text-baky-green bg-baky-green/10"
                          : "text-baky-muted bg-baky-muted/10"
                  }`}
                >
                  {o.status}
                </span>
              </span>
            </div>
          );
        })}
        {recent.length === 0 && (
          <p className="text-xl font-light text-baky-muted text-center py-8">
            No orders placed yet.
          </p>
        )}
      </div>
    </div>
  );
}
