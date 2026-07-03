export function RecentOrdersCard() {
  return (
    <div className="rounded-[15px] bg-baky-card p-8">
      <p className="text-xl font-medium text-baky-muted">Recent Orders</p>

      <div className="mt-6 grid grid-cols-4 border-b border-baky-muted/60 pb-3 text-[17px] font-normal text-baky-muted">
        <span>Order #</span>
        <span>Product</span>
        <span>Amount</span>
        <span>Status</span>
      </div>

      {/* Empty body per design */}
      <div className="h-24" />
    </div>
  );
}
