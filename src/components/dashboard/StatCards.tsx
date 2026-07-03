import { useBakyData } from "@/context/BakyDataContext";

function StatCard({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-[123px] flex-col justify-center rounded-[15px] bg-baky-card p-6">
      {children}
    </div>
  );
}

export function StatCards() {
  const { orders, inventory } = useBakyData();

  const todayStr = new Date().toDateString();
  const todayOrders = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === todayStr
  );
  
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.amount, 0);
  const lowStockCount = inventory.filter((item) => item.current <= item.total * 0.2).length;

  return (
    <div className="grid grid-cols-4 gap-6">
      <StatCard>
        <p className="text-xl font-medium text-baky-muted">Today Orders</p>
        <p className="mt-2 text-[26px] font-medium leading-none text-black">
          {todayOrders.length}
        </p>
        <p className="mt-2 text-xl font-medium text-baky-green">+4.25%</p>
      </StatCard>

      <StatCard>
        <p className="text-xl font-medium text-baky-muted">Today Revenue</p>
        <p className="mt-2 text-[26px] font-medium leading-none text-black">
          ₹{todayRevenue.toLocaleString("en-IN")}
        </p>
        <p className="mt-2 text-xl font-medium text-baky-green">+8.16%</p>
      </StatCard>

      <StatCard>{null}</StatCard>{/* intentionally empty per design */}

      <StatCard>
        <p className="text-xl font-medium text-baky-muted">Low Stock Items</p>
        <p className="mt-2 text-[26px] font-medium leading-none text-black">
          {lowStockCount}
        </p>
        <p className="mt-2 text-xl font-medium text-baky-red">
          {lowStockCount > 0 ? "Action required" : "In stock"}
        </p>
      </StatCard>
    </div>
  );
}
