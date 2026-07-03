export function TopSellingCard() {
  return (
    <div className="flex flex-col rounded-[15px] bg-baky-card p-8">
      <p className="text-xl font-medium text-baky-muted">Top Selling</p>

      <div className="flex flex-1 items-center justify-center py-8">
        <div className="flex h-[212px] w-[212px] items-center justify-center rounded-full border-[32px] border-baky-muted">
          <div className="text-center">
            <p className="text-[26px] font-medium leading-none text-black">75</p>
            <p className="mt-1 text-xl font-medium text-baky-muted">Total Sold</p>
          </div>
        </div>
      </div>

      <div className="space-y-2 px-2">
        <div className="flex items-center gap-3">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: "#d5a5e3" }}
          />
          <span className="text-xl font-normal text-baky-muted">
            Triple Chocolate Brownie
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span
            className="h-3 w-3 rounded-full"
            style={{ backgroundColor: "#ebccf5" }}
          />
          <span className="text-xl font-normal text-baky-muted">Matlida</span>
        </div>
      </div>
    </div>
  );
}
