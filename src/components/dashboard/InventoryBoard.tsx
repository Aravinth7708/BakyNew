import { useState } from "react";
import { useBakyData, InventoryItem } from "@/context/BakyDataContext";
import { toast } from "sonner";
import { Pencil, Check, X, Plus } from "lucide-react";

export function InventoryBoard() {
  const { inventory, updateStock, addInventoryItem } = useBakyData();

  // State for inline editing
  const [editingItemName, setEditingItemName] = useState<string | null>(null);
  const [editCurrent, setEditCurrent] = useState<string>("");
  const [editTotal, setEditTotal] = useState<string>("");

  // State for adding item
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCurrent, setNewItemCurrent] = useState("");
  const [newItemTotal, setNewItemTotal] = useState("");

  const startEdit = (item: InventoryItem) => {
    setEditingItemName(item.name);
    setEditCurrent(item.current.toString());
    setEditTotal(item.total.toString());
  };

  const handleSave = (name: string) => {
    const cur = parseInt(editCurrent, 10);
    const tot = parseInt(editTotal, 10);

    if (isNaN(cur) || isNaN(tot) || cur < 0 || tot <= 0) {
      toast.error("Please enter valid positive numbers. Target stock must be greater than 0.");
      return;
    }

    updateStock(name, cur, tot);
    setEditingItemName(null);
    toast.success(`Updated stock levels for ${name}`);
  };

  const handleCancel = () => {
    setEditingItemName(null);
  };

  const handleCreateInventoryItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemCurrent || !newItemTotal) {
      toast.error("Please fill in all fields.");
      return;
    }

    const cur = parseInt(newItemCurrent, 10);
    const tot = parseInt(newItemTotal, 10);

    if (isNaN(cur) || isNaN(tot) || cur < 0 || tot <= 0) {
      toast.error("Please enter valid positive numbers. Target stock must be greater than 0.");
      return;
    }

    const newItem: InventoryItem = {
      name: newItemName.trim(),
      current: cur,
      total: tot,
    };

    addInventoryItem(newItem);
    toast.success(`Inventory item "${newItem.name}" added`);
    setNewItemName("");
    setNewItemCurrent("");
    setNewItemTotal("");
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-1 flex-col rounded-[15px] bg-baky-surface p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-black">
          Inventory Items ({inventory.length})
        </h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-lg font-semibold text-[#1177E5] hover:underline"
        >
          + ADD NEW
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateInventoryItem} className="mt-4 rounded-lg bg-baky-card/40 p-4 space-y-3 border border-baky-muted/10">
          <p className="text-sm font-semibold text-baky-muted">Add New Inventory Item</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Item Name (e.g. Flour)"
              required
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="rounded-lg border border-baky-muted/30 bg-white px-3 py-2 text-base text-black outline-none focus:border-[#3395FF]"
            />
            <input
              type="number"
              placeholder="Current Stock"
              required
              min="0"
              value={newItemCurrent}
              onChange={(e) => setNewItemCurrent(e.target.value)}
              className="rounded-lg border border-baky-muted/30 bg-white px-3 py-2 text-base text-black outline-none focus:border-[#3395FF]"
            />
            <input
              type="number"
              placeholder="Target/Total Stock"
              required
              min="1"
              value={newItemTotal}
              onChange={(e) => setNewItemTotal(e.target.value)}
              className="rounded-lg border border-baky-muted/30 bg-white px-3 py-2 text-base text-black outline-none focus:border-[#3395FF]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded-lg border border-baky-muted/30 px-3 py-1.5 text-base font-medium text-black hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-[#3395FF] px-4 py-1.5 text-base font-semibold text-white hover:bg-[#2a86ea]"
            >
              Add Item
            </button>
          </div>
        </form>
      )}

      <ul className="mt-6 divide-y divide-baky-muted/10 max-h-[500px] overflow-y-auto pr-1">
        {inventory.map((item) => {
          const isLow = item.current <= item.total * 0.2;
          const isEditing = editingItemName === item.name;

          return (
            <li
              key={item.name}
              className={`flex items-center justify-between gap-4 px-3 py-4 transition-all rounded-lg ${
                isLow ? "bg-baky-card/50" : "hover:bg-baky-card/10"
              }`}
            >
              <div className="min-w-0 flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full shrink-0 ${isLow ? "bg-baky-red animate-pulse" : "bg-baky-green"}`} />
                <span
                  className={`truncate text-xl font-medium ${
                    isLow ? "text-black font-semibold" : "text-black"
                  }`}
                >
                  {item.name}
                </span>
                {isLow && (
                  <span className="text-xs font-bold text-baky-red bg-baky-red/10 px-2 py-0.5 rounded-full">
                    LOW STOCK
                  </span>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-4">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={editCurrent}
                      onChange={(e) => setEditCurrent(e.target.value)}
                      className="w-16 rounded border border-baky-muted/30 bg-white px-2 py-1 text-base text-black outline-none focus:border-[#3395FF]"
                      min="0"
                    />
                    <span className="text-baky-muted text-base">/</span>
                    <input
                      type="number"
                      value={editTotal}
                      onChange={(e) => setEditTotal(e.target.value)}
                      className="w-16 rounded border border-baky-muted/30 bg-white px-2 py-1 text-base text-black outline-none focus:border-[#3395FF]"
                      min="1"
                    />
                    <button
                      onClick={() => handleSave(item.name)}
                      className="rounded-full bg-baky-green p-1.5 text-white hover:opacity-90 transition-opacity"
                      title="Save"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="rounded-full bg-baky-muted/20 p-1.5 text-black hover:bg-baky-muted/30 transition-all"
                      title="Cancel"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-lg font-semibold ${
                        isLow ? "text-baky-red" : "text-baky-muted"
                      }`}
                    >
                      {item.current} / {item.total}
                    </span>
                    <button 
                      onClick={() => startEdit(item)}
                      className="p-1 hover:bg-baky-card rounded transition-colors"
                      aria-label="Edit item stock"
                    >
                      <Pencil
                        className="h-5 w-5"
                        style={{ color: isLow ? "#FF8205" : "#686868" }}
                        strokeWidth={2}
                      />
                    </button>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
