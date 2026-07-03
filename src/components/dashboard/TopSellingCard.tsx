import { useBakyData } from "@/context/BakyDataContext";

export function TopSellingCard() {
  const { orders } = useBakyData();

  const itemSales: Record<string, number> = {};
  let totalSold = 0;

  orders.forEach((order) => {
    order.items.forEach((item) => {
      itemSales[item.name] = (itemSales[item.name] || 0) + item.quantity;
      totalSold += item.quantity;
    });
  });

  const sortedSales = Object.entries(itemSales)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const top2 = sortedSales.slice(0, 2);

  return (
    <div className="flex flex-col rounded-[15px] bg-baky-card p-8">
      <p className="text-xl font-medium text-baky-muted">Top Selling</p>

      <div className="flex flex-1 items-center justify-center py-8">
        <div className="flex h-[212px] w-[212px] items-center justify-center rounded-full border-[32px] border-baky-muted">
          <div className="text-center">
            <p className="text-[26px] font-medium leading-none text-black">
              {totalSold}
            </p>
            <p className="mt-1 text-xl font-medium text-baky-muted">Total Sold</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 px-2 min-h-[64px]">
        {top2.map((item, idx) => (
          <div key={item.name} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: idx === 0 ? "#d5a5e3" : "#ebccf5" }}
              />
              <span className="text-xl font-normal text-baky-muted truncate max-w-[200px]">
                {item.name}
              </span>
            </div>
            <span className="text-lg font-medium text-baky-muted">{item.count} sold</span>
          </div>
        ))}
        {top2.length === 0 && (
          <p className="text-xl font-light text-baky-muted text-center">No items sold yet.</p>
        )}
      </div>
    </div>
  );
}
