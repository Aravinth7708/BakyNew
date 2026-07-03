const items = [
  { name: "Waffle flour (kg)", current: 5, total: 50 },
  { name: "Brownie pracel plate (Pack)", current: 2, total: 10 },
  { name: "Dark compound (Pack)", current: 1, total: 10 },
];

export function LowInventoryCard() {
  return (
    <div className="rounded-[15px] bg-baky-card p-8">
      <p className="text-xl font-medium text-baky-muted">Low Inventory Alerts</p>

      <div className="mt-6 space-y-6">
        {items.map(({ name, current, total }) => (
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
      </div>
    </div>
  );
}
