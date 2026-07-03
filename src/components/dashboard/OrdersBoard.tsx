import { useState } from "react";
import { useBakyData, Order } from "@/context/BakyDataContext";
import { toast } from "sonner";
import { Edit2, Check, X, ArrowRight, Play, CheckCircle } from "lucide-react";

const tabs = ["New", "Preparing", "Served", "Past Orders"] as const;
type Tab = (typeof tabs)[number];

export function OrdersBoard() {
  const { orders, updateOrderStatus, updateOrderAmount } = useBakyData();
  const [active, setActive] = useState<Tab>("New");

  // State for inline amount editor
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editAmountVal, setEditAmountVal] = useState<string>("");

  const visible = orders.filter((o) => o.status === active);

  const startEditAmount = (order: Order) => {
    setEditingOrderId(order.id);
    setEditAmountVal(order.amount.toString());
  };

  const handleSaveAmount = (orderId: string) => {
    const amt = parseFloat(editAmountVal);
    if (isNaN(amt) || amt < 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    updateOrderAmount(orderId, amt);
    setEditingOrderId(null);
    toast.success(`Updated order ${orderId} amount to ₹${amt}`);
  };

  const handleCancelEdit = () => {
    setEditingOrderId(null);
  };

  const handleAdvanceStatus = (orderId: string, currentStatus: Order["status"]) => {
    let nextStatus: Order["status"] = currentStatus;
    if (currentStatus === "New") nextStatus = "Preparing";
    else if (currentStatus === "Preparing") nextStatus = "Served";
    else if (currentStatus === "Served") nextStatus = "Past Orders";

    updateOrderStatus(orderId, nextStatus);
    toast.success(`Order ${orderId} moved to ${nextStatus}`);
  };

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* Tabs */}
      <div className="rounded-[15px] bg-baky-surface p-[10px] shadow-sm">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {tabs.map((tab) => {
            const count = orders.filter((o) => o.status === tab).length;
            return (
              <button
                key={tab}
                onClick={() => {
                  setActive(tab);
                  setEditingOrderId(null);
                }}
                className={`flex h-16 items-center justify-center gap-2 rounded-[29px] px-4 text-xl font-semibold transition-all ${
                  active === tab
                    ? "bg-baky-card text-black shadow-sm"
                    : "text-baky-muted hover:bg-baky-card/50 hover:text-black"
                }`}
              >
                <span>{tab}</span>
                <span className={`flex h-6 min-w-6 items-center justify-center rounded-full text-sm font-bold ${
                  active === tab 
                    ? "bg-black text-white" 
                    : "bg-baky-card text-baky-muted"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Table / List */}
      <div className="rounded-[15px] bg-baky-surface p-6 shadow-sm">
        {/* Table Header */}
        <div className="grid grid-cols-[0.8fr_2fr_1.2fr_1.5fr] gap-4 border-b border-baky-muted/20 px-2 pb-3 text-[17px] font-semibold text-baky-muted">
          <span>Order #</span>
          <span>Products</span>
          <span>Amount</span>
          <span>Actions</span>
        </div>

        {visible.length === 0 ? (
          <div className="flex h-48 items-center justify-center text-center">
            <p className="text-xl text-baky-muted font-light">No orders under this tab.</p>
          </div>
        ) : (
          <ul className="divide-y divide-baky-muted/10">
            {visible.map((o) => {
              const productsSummary = o.items
                .map((item) => `${item.name}${item.variant ? ` (${item.variant})` : ""} x${item.quantity}`)
                .join(", ");

              const isEditing = editingOrderId === o.id;

              return (
                <li
                  key={o.id}
                  className="grid grid-cols-[0.8fr_2fr_1.2fr_1.5fr] items-center gap-4 px-2 py-5 text-xl font-medium text-black hover:bg-baky-card/10 rounded-lg transition-colors"
                >
                  {/* Order ID */}
                  <span className="font-semibold text-black">{o.id}</span>
                  
                  {/* Products */}
                  <span className="truncate pr-4 text-baky-muted" title={productsSummary}>
                    {productsSummary}
                  </span>

                  {/* Amount Editor */}
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <div className="flex items-center gap-1.5">
                        <span className="text-baky-muted">₹</span>
                        <input
                          type="number"
                          className="w-20 rounded border border-baky-muted/30 px-1.5 py-0.5 text-base text-black outline-none focus:border-[#3395FF]"
                          value={editAmountVal}
                          onChange={(e) => setEditAmountVal(e.target.value)}
                          autoFocus
                          min="0"
                        />
                        <button
                          onClick={() => handleSaveAmount(o.id)}
                          className="rounded-full bg-baky-green p-1 text-white hover:opacity-90"
                          title="Save Amount"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="rounded-full bg-baky-muted/20 p-1 text-black hover:bg-baky-muted/30"
                          title="Cancel"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 group">
                        <span className="font-bold text-black">₹{o.amount}</span>
                        <button
                          onClick={() => startEditAmount(o)}
                          className="text-baky-muted/60 opacity-0 group-hover:opacity-100 hover:text-[#1177E5] transition-all p-1"
                          title="Edit Amount paid"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div>
                    {o.status === "New" && (
                      <button
                        onClick={() => handleAdvanceStatus(o.id, o.status)}
                        className="flex items-center gap-1.5 rounded-full bg-[#FF8205]/10 px-4 py-1.5 text-base font-bold text-[#FF8205] transition-all hover:bg-[#FF8205] hover:text-white"
                      >
                        <Play className="h-4 w-4" /> Prepare
                      </button>
                    )}

                    {o.status === "Preparing" && (
                      <button
                        onClick={() => handleAdvanceStatus(o.id, o.status)}
                        className="flex items-center gap-1.5 rounded-full bg-baky-green/10 px-4 py-1.5 text-base font-bold text-baky-green transition-all hover:bg-baky-green hover:text-white"
                      >
                        <ArrowRight className="h-4 w-4" /> Serve
                      </button>
                    )}

                    {o.status === "Served" && (
                      <button
                        onClick={() => handleAdvanceStatus(o.id, o.status)}
                        className="flex items-center gap-1.5 rounded-full bg-[#1177E5]/10 px-4 py-1.5 text-base font-bold text-[#1177E5] transition-all hover:bg-[#1177E5] hover:text-white"
                      >
                        <CheckCircle className="h-4 w-4" /> Complete
                      </button>
                    )}

                    {o.status === "Past Orders" && (
                      <span className="inline-flex items-center gap-1 text-[#0AC655] text-base font-semibold">
                        <CheckCircle className="h-5 w-5 fill-[#0AC655]/10" /> Completed
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
