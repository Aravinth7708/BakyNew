import { useBakyData } from "@/context/BakyDataContext";

export function LowInventoryCard() {
  const { inventory } = useBakyData();
  
  // Define low stock as 20% or less of total stock
  const lowItems = inventory.filter((item) => item.current <= item.total * 0.2);

  return (
    <div className="rounded-[15px] bg-baky-card p-8">
      <p className="text-xl font-medium text-baky-muted">Low Inventory Alerts</p>

      <div className="mt-6 space-y-6">
        {lowItems.map(({ name, current, total }) => (
          <div key={name}>
            <div className="flex items-center justify-between text-xl font-normal text-baky-muted">
              <span>{name}</span>
              <span>
                {current} / {total}
              </span>
            </div>
            <div className="mt-2 h-[13px] w-full rounded-full bg-baky-track">
              <div
                className="h-full rounded-full"
                style={{
                  width: `${(current / total) * 100}%`,
                  backgroundColor: "#d5a5e3",
                }}
              />
            </div>
          </div>
        ))}
        {lowItems.length === 0 && (
          <p className="text-xl font-light text-baky-muted text-center py-8">
            All inventory levels are normal.
          </p>
        )}
      </div>
    </div>
  );
}
