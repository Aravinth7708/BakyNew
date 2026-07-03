import { useState } from "react";
import { useBakyData, InventoryItem } from "@/context/BakyDataContext";
import { toast } from "sonner";
import { Pencil, Check, X } from "lucide-react";

export function InventoryBoard() {
  const { inventory, updateStock, addInventoryItem } = useBakyData();

  // Editing state
  const [editingItemName, setEditingItemName] = useState<string | null>(null);
  const [editCurrent, setEditCurrent] = useState("");
  const [editTotal, setEditTotal] = useState("");

  // Adding state
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
    const cur = parseInt(newItemCurrent, 10);
    const tot = parseInt(newItemTotal, 10);

    if (!newItemName.trim() || isNaN(cur) || isNaN(tot) || cur < 0 || tot <= 0) {
      toast.error("Please enter valid parameters.");
      return;
    }

    addInventoryItem({ name: newItemName.trim(), current: cur, total: tot });
    toast.success(`Inventory item "${newItemName}" created`);
    setNewItemName("");
    setNewItemCurrent("");
    setNewItemTotal("");
    setShowAddForm(false);
  };

  return (
    <div className="flex flex-1 flex-col rounded-[15px] bg-baky-surface p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-medium text-black">
          Item ({inventory.length})
        </h2>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="text-lg font-semibold text-[#1177E5] hover:underline"
        >
          + ADD NEW
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={handleCreateInventoryItem} className="mt-4 rounded-lg bg-baky-card/50 p-4 space-y-3 border border-baky-muted/10">
          <p className="text-sm font-semibold text-baky-muted">Add New Inventory Item</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Item Name"
              required
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="rounded border border-baky-muted/30 bg-white px-2.5 py-1 text-sm text-black outline-none focus:border-[#3395FF]"
            />
            <input
              type="number"
              placeholder="Current Stock"
              required
              min="0"
              value={newItemCurrent}
              onChange={(e) => setNewItemCurrent(e.target.value)}
              className="rounded border border-baky-muted/30 bg-white px-2.5 py-1 text-sm text-black outline-none focus:border-[#3395FF]"
            />
            <input
              type="number"
              placeholder="Target/Total Stock"
              required
              min="1"
              value={newItemTotal}
              onChange={(e) => setNewItemTotal(e.target.value)}
              className="rounded border border-baky-muted/30 bg-white px-2.5 py-1 text-sm text-black outline-none focus:border-[#3395FF]"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="rounded border border-baky-muted/30 px-3 py-1 text-xs font-semibold hover:bg-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded bg-[#3395FF] px-4 py-1 text-xs font-semibold text-white hover:bg-[#2a86ea]"
            >
              Add
            </button>
          </div>
        </form>
      )}

      <ul className="mt-6 divide-y divide-baky-muted/30 max-h-[500px] overflow-y-auto pr-1">
        {inventory.map((item, i) => {
          const isLow = item.current <= item.total * 0.2;
          const isEditing = editingItemName === item.name;

          return (
            <li
              key={i}
              className={`flex items-center justify-between gap-4 px-2 py-4 ${
                isLow ? "bg-baky-card" : ""
              }`}
            >
              <span
                className={`min-w-0 truncate text-xl ${
                  isLow ? "text-black font-semibold" : "text-baky-muted"
                }`}
              >
                {item.name}
              </span>
              
              <div className="flex shrink-0 items-center gap-3">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      className="w-14 rounded border border-baky-muted/30 bg-white px-1 py-0.5 text-base text-black"
                      value={editCurrent}
                      onChange={(e) => setEditCurrent(e.target.value)}
                      min="0"
                    />
                    <span className="text-baky-muted text-base">/</span>
                    <input
                      type="number"
                      className="w-14 rounded border border-baky-muted/30 bg-white px-1 py-0.5 text-base text-black"
                      value={editTotal}
                      onChange={(e) => setEditTotal(e.target.value)}
                      min="1"
                    />
                    <button
                      onClick={() => handleSave(item.name)}
                      className="rounded bg-baky-green p-1 text-white hover:opacity-90"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="rounded bg-baky-muted/20 p-1 text-black hover:bg-baky-muted/30"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ) : (
                  <>
                    <span
                      className={`text-lg font-semibold ${
                        isLow ? "text-[#1177E5]" : "text-baky-muted"
                      }`}
                    >
                      {item.current} / {item.total}
                    </span>
                    <button 
                      onClick={() => startEdit(item)}
                      aria-label="Edit item"
                      className="hover:opacity-80 transition-opacity"
                    >
                      <Pencil
                        className="h-5 w-5"
                        style={{ color: isLow ? "#FF8205" : "#686868" }}
                        strokeWidth={2}
                      />
                    </button>
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
