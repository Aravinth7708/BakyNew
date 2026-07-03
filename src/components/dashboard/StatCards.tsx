function StatCard({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex min-h-[123px] flex-col justify-center rounded-[15px] bg-baky-card p-6">
      {children}
    </div>
  );
}

export function StatCards() {
  return (
    <div className="grid grid-cols-4 gap-6">
      <StatCard>
        <p className="text-xl font-medium text-baky-muted">Today Orders</p>
        <p className="mt-2 text-[26px] font-medium leading-none text-black">75</p>
        <p className="mt-2 text-xl font-medium text-baky-green">+4.25%</p>
      </StatCard>

      <StatCard>
        <p className="text-xl font-medium text-baky-muted">Today Revenue</p>
        <p className="mt-2 text-[26px] font-medium leading-none text-black">
          1,030
        </p>
        <p className="mt-2 text-xl font-medium text-baky-green">+8.16%</p>
      </StatCard>

      <StatCard>{null}</StatCard>{/* intentionally empty per design */}

      <StatCard>
        <p className="text-xl font-medium text-baky-muted">Low Stock Items</p>
        <p className="mt-2 text-[26px] font-medium leading-none text-black">2</p>
        <p className="mt-2 text-xl font-medium text-baky-red">Action required</p>
      </StatCard>
    </div>
  );
}
