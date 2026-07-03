import { useBakyData } from "@/context/BakyDataContext";

export function SalesOverviewCard() {
  const { orders } = useBakyData();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Generate last 7 days in chronological order
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d;
  }).reverse();

  const bars = last7Days.map((date) => {
    const dayName = daysOfWeek[date.getDay()];
    const dateStr = date.toDateString();
    const dayOrders = orders.filter(
      (o) => new Date(o.createdAt).toDateString() === dateStr
    );
    const value = dayOrders.reduce((sum, o) => sum + o.amount, 0);
    return {
      day: dayName,
      value,
      strong: date.toDateString() === new Date().toDateString(),
    };
  });

  const totalSales = bars.reduce((sum, b) => sum + b.value, 0);
  const maxVal = Math.max(...bars.map((b) => b.value), 100);

  return (
    <div className="flex flex-col rounded-[15px] bg-baky-card p-8">
      <p className="text-xl font-medium text-baky-muted">Sales Overview</p>
      <p className="mt-4 text-2xl font-medium text-black">₹{totalSales.toLocaleString("en-IN")}</p>
      <p className="mt-2 text-xl font-medium text-baky-muted">
        Last 7 Days <span className="text-baky-green">+12.5%</span>
      </p>

      <div className="mt-8 flex flex-1 items-end justify-between gap-3 px-2">
        {bars.map(({ day, value, strong }) => (
          <div key={day} className="flex flex-1 flex-col items-center gap-3">
            <div className="flex h-[260px] w-full items-end justify-center">
              <div
                className="w-9 rounded-t-[7px]"
                style={{
                  height: `${(value / maxVal) * 100}%`,
                  backgroundColor: strong ? "#d5a5e3" : "#ebccf5",
                }}
              />
            </div>
            <span className="text-xl font-normal text-baky-muted">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
