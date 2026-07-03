import { useState } from "react";
import { useBakyData, Order } from "@/context/BakyDataContext";
import { toast } from "sonner";
import { Edit2, Check, X } from "lucide-react";

const tabs = ["New", "Preparing", "Served", "Past Orders"] as const;
type Tab = (typeof tabs)[number];

export function OrdersBoard() {
  const { orders, updateOrderStatus, updateOrderAmount } = useBakyData();
  const [active, setActive] = useState<Tab>("New");

  // State for inline amount editor
  const [editingOrderId, setEditingOrderId] = useState<string | null>(null);
  const [editAmountVal, setEditAmountVal] = useState<string>("");

  const visible = orders.filter((o) => o.status === active);

  const startEditAmount = (e: React.MouseEvent, order: Order) => {
    e.stopPropagation();
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
      <div className="rounded-[15px] bg-baky-surface p-[10px]">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActive(tab);
                setEditingOrderId(null);
              }}
              className={`flex h-16 items-center justify-center rounded-[29px] px-4 text-2xl font-medium transition-colors ${
                active === tab
                  ? "bg-baky-card text-black shadow-sm"
                  : "text-black hover:bg-baky-card/50"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-[15px] bg-baky-surface p-6">
        <div className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr] gap-4 border-b border-baky-muted/60 px-2 pb-3 text-[17px] text-baky-muted">
          <span>Order #</span>
          <span>Product</span>
          <span>Amount</span>
          <span>View</span>
        </div>

        {visible.length === 0 ? (
          <p className="px-2 py-8 text-xl text-baky-muted">No orders here.</p>
        ) : (
          <ul>
            {visible.map((o) => {
              // Combine item names for product cell
              const productSummary = o.items
                .map((item) => `${item.name}${item.variant ? ` (${item.variant})` : ""}`)
                .join(", ");

              const isEditing = editingOrderId === o.id;

              return (
                <li
                  key={o.id}
                  className="grid grid-cols-[1.2fr_1fr_1fr_0.8fr] items-center gap-4 px-2 py-5 text-2xl font-medium text-black hover:bg-baky-card/5 rounded-lg transition-all"
                >
                  <span>{o.id}</span>
                  <span className="truncate pr-4 text-baky-muted" title={productSummary}>
                    {productSummary}
                  </span>
                  
                  {/* Amount with edit logic */}
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <span className="text-baky-muted text-lg">₹</span>
                        <input
                          type="number"
                          className="w-20 rounded border border-baky-muted/30 bg-white px-1.5 py-0.5 text-lg text-black outline-none focus:border-[#3395FF]"
                          value={editAmountVal}
                          onChange={(e) => setEditAmountVal(e.target.value)}
                          autoFocus
                          min="0"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <button
                          onClick={() => handleSaveAmount(o.id)}
                          className="rounded-full bg-baky-green p-1 text-white hover:opacity-90 transition-opacity"
                        >
                          <Check className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="rounded-full bg-baky-muted/20 p-1 text-black hover:bg-baky-muted/30 transition-all"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        className="flex items-center gap-1.5 group cursor-pointer"
                        onClick={(e) => startEditAmount(e, o)}
                        title="Click to edit paid amount"
                      >
                        <span>₹{o.amount}</span>
                        <Edit2 className="h-3.5 w-3.5 text-baky-muted/40 opacity-0 group-hover:opacity-100 hover:text-[#1177E5] transition-all" />
                      </div>
                    )}
                  </div>

                  {/* Actions in View column */}
                  <span>
                    {o.status === "New" && (
                      <button
                        onClick={() => handleAdvanceStatus(o.id, o.status)}
                        className="text-lg font-bold text-[#FF8205] hover:underline"
                      >
                        Prepare
                      </button>
                    )}

                    {o.status === "Preparing" && (
                      <button
                        onClick={() => handleAdvanceStatus(o.id, o.status)}
                        className="text-lg font-bold text-baky-green hover:underline"
                      >
                        Serve
                      </button>
                    )}

                    {o.status === "Served" && (
                      <button
                        onClick={() => handleAdvanceStatus(o.id, o.status)}
                        className="text-lg font-bold text-[#1177E5] hover:underline"
                      >
                        Complete
                      </button>
                    )}

                    {o.status === "Past Orders" && (
                      <span className="text-lg font-semibold text-baky-muted bg-baky-card px-2 py-0.5 rounded">
                        Done
                      </span>
                    )}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
