import { useState } from "react";
import { useBakyData, MenuItem } from "@/context/BakyDataContext";
import { toast } from "sonner";
import { Trash2, Plus, X } from "lucide-react";

function Toggle({
  on,
  onToggle,
}: {
  on: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      aria-pressed={on}
      className={`relative h-[21px] w-[43px] shrink-0 rounded-full transition-colors ${
        on ? "bg-[#0ac655]" : "bg-baky-track"
      }`}
    >
      <span
        className={`absolute top-1/2 h-[17px] w-[17px] -translate-y-1/2 rounded-full bg-white transition-all ${
          on ? "left-[24px]" : "left-[2px]"
        }`}
      />
    </button>
  );
}

export function MenuBoard() {
  const { 
    categories, 
    menuItems, 
    toggleCategory, 
    toggleMenuItem, 
    deleteMenuItem,
    addCategory,
    addMenuItem 
  } = useBakyData();

  // Forms states
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemCat, setNewItemCat] = useState("");
  const [newItemVariants, setNewItemVariants] = useState("");

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim());
    toast.success(`Category "${newCatName}" added`);
    setNewCatName("");
    setShowAddCategory(false);
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    const cat = newItemCat || categories[0]?.name;
    if (!newItemName.trim() || !newItemPrice || !cat) {
      toast.error("Please fill in all required fields");
      return;
    }

    const variantsArray = newItemVariants
      .split(",")
      .map(v => v.trim())
      .filter(v => v.length > 0);

    const newItem: MenuItem = {
      name: newItemName.trim(),
      price: parseFloat(newItemPrice),
      category: cat,
      variants: variantsArray,
      enabled: true,
    };

    addMenuItem(newItem);
    toast.success(`Item "${newItem.name}" added`);
    setNewItemName("");
    setNewItemPrice("");
    setNewItemVariants("");
    setNewItemCat("");
    setShowAddItem(false);
  };

  const handleDeleteItem = (name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      deleteMenuItem(name);
      toast.info(`Deleted ${name}`);
    }
  };

  return (
    <div className="flex flex-1 flex-col rounded-[15px] bg-baky-surface shadow-sm">
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-2">
        {/* Category column */}
        <section className="flex flex-col border-b border-baky-muted/20 p-6 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-black">
              Category ({categories.length})
            </h2>
            <button 
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="text-lg font-semibold text-[#1177E5] hover:underline"
            >
              + ADD NEW
            </button>
          </div>

          {showAddCategory && (
            <form onSubmit={handleCreateCategory} className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Category Name"
                required
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1 rounded-lg border border-baky-muted/30 px-3 py-2 text-lg text-black outline-none focus:border-[#3395FF]"
                autoFocus
              />
              <button
                type="submit"
                className="rounded-lg bg-[#3395FF] px-4 py-2 text-lg font-semibold text-white hover:bg-[#2a86ea]"
              >
                Add
              </button>
            </form>
          )}

          <ul className="mt-6 divide-y divide-baky-muted/10">
            {categories.map((c, i) => (
              <li
                key={c.name}
                className="flex items-center justify-between px-2 py-4 text-xl text-black hover:bg-baky-card/10 transition-colors rounded-lg"
              >
                <span className={c.enabled ? "" : "text-baky-muted line-through"}>
                  {c.name}
                </span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-baky-muted">
                    {c.enabled ? "Active" : "Disabled"}
                  </span>
                  <Toggle
                    on={c.enabled}
                    onToggle={() => toggleCategory(c.name)}
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Items column */}
        <section className="flex flex-col p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-black">
              Items ({menuItems.length})
            </h2>
            <button 
              onClick={() => setShowAddItem(!showAddItem)}
              className="text-lg font-semibold text-[#1177E5] hover:underline"
            >
              + ADD NEW
            </button>
          </div>

          {showAddItem && (
            <form onSubmit={handleCreateItem} className="mt-4 rounded-lg bg-baky-card/40 p-4 space-y-3 border border-baky-muted/10">
              <p className="text-sm font-semibold text-baky-muted">Add New Menu Item</p>
              
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Item Name"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="rounded-lg border border-baky-muted/30 bg-white px-3 py-2 text-base text-black outline-none focus:border-[#3395FF]"
                />
                <input
                  type="number"
                  placeholder="Price (₹)"
                  required
                  min="0"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="rounded-lg border border-baky-muted/30 bg-white px-3 py-2 text-base text-black outline-none focus:border-[#3395FF]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  required
                  value={newItemCat}
                  onChange={(e) => setNewItemCat(e.target.value)}
                  className="rounded-lg border border-baky-muted/30 bg-white px-3 py-2 text-base text-black outline-none focus:border-[#3395FF]"
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  placeholder="Variants (Belgian, Brownie...)"
                  value={newItemVariants}
                  onChange={(e) => setNewItemVariants(e.target.value)}
                  className="rounded-lg border border-baky-muted/30 bg-white px-3 py-2 text-base text-black outline-none focus:border-[#3395FF]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddItem(false)}
                  className="rounded-lg border border-baky-muted/30 px-3 py-1.5 text-base font-medium text-black hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#3395FF] px-4 py-1.5 text-base font-semibold text-white hover:bg-[#2a86ea]"
                >
                  Create
                </button>
              </div>
            </form>
          )}

          <ul className="mt-6 space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {menuItems.map((item) => (
              <li 
                key={item.name} 
                className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-baky-card/25 transition-colors border border-baky-muted/5"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-baky-bar-strong" />
                    <p className={`text-xl font-medium ${item.enabled ? "text-black" : "text-baky-muted line-through"}`}>
                      {item.name}, ₹{item.price}
                    </p>
                  </div>
                  <div className="pl-4 mt-0.5 flex items-center gap-3">
                    <span className="text-sm text-baky-muted font-medium bg-baky-card/50 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    {item.variants.length > 0 && (
                      <span className="text-sm text-[#1177E5] font-semibold">
                        {item.variants.length} Variants: {item.variants.join(", ")}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <Toggle
                    on={item.enabled}
                    onToggle={() => toggleMenuItem(item.name)}
                  />
                  <button
                    onClick={() => handleDeleteItem(item.name)}
                    className="text-baky-muted hover:text-baky-red transition-colors p-1"
                    title="Delete Item"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
