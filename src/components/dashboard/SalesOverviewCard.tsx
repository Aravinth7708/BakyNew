const bars = [
  { day: "Mon", value: 150, strong: false },
  { day: "Tue", value: 216, strong: false },
  { day: "Wed", value: 172, strong: false },
  { day: "Thu", value: 130, strong: false },
  { day: "Fri", value: 240, strong: true },
  { day: "Sat", value: 231, strong: true },
  { day: "Sun", value: 194, strong: false },
];

const MAX = 240;

export function SalesOverviewCard() {
  return (
    <div className="flex flex-col rounded-[15px] bg-baky-card p-8">
      <p className="text-xl font-medium text-baky-muted">Sales Overview</p>
      <p className="mt-4 text-2xl font-medium text-black">₹1,800</p>
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
                  height: `${(value / MAX) * 100}%`,
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
