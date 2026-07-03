import { useState } from "react";
import { useBakyData, MenuItem } from "@/context/BakyDataContext";
import { toast } from "sonner";

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
        on ? "bg-baky-green" : "bg-baky-track"
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
    addCategory, 
    addMenuItem 
  } = useBakyData();

  // Highlight first category
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  // Expanded states for items variants lists
  const [expandedVariants, setExpandedVariants] = useState<Record<string, boolean>>({});

  // Form toggles
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemVariants, setNewItemVariants] = useState("");

  const activeCategoryName = categories[selectedIdx]?.name || "";

  // Filter items in active category
  const activeItems = menuItems.filter(item => item.category === activeCategoryName);

  const toggleVariantsExpand = (itemName: string) => {
    setExpandedVariants(prev => ({ ...prev, [itemName]: !prev[itemName] }));
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim());
    setNewCatName("");
    setShowAddCategory(false);
    toast.success(`Category "${newCatName}" added`);
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCategoryName) {
      toast.error("Please select a category first.");
      return;
    }
    if (!newItemName.trim() || !newItemPrice) return;

    const variantsArray = newItemVariants
      .split(",")
      .map(v => v.trim())
      .filter(v => v.length > 0);

    const newItem: MenuItem = {
      name: newItemName.trim(),
      price: parseFloat(newItemPrice),
      category: activeCategoryName,
      variants: variantsArray,
      enabled: true,
    };

    addMenuItem(newItem);
    setNewItemName("");
    setNewItemPrice("");
    setNewItemVariants("");
    setShowAddItem(false);
    toast.success(`Item "${newItem.name}" added`);
  };

  return (
    <div className="flex flex-1 flex-col rounded-[15px] bg-baky-surface">
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-2">
        
        {/* Category column */}
        <section className="flex flex-col border-b border-baky-muted/50 p-6 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-black">
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
                required
                placeholder="Category Name"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="flex-1 rounded-lg border border-baky-muted/30 px-3 py-1.5 text-base text-black outline-none focus:border-[#3395FF]"
                autoFocus
              />
              <button
                type="submit"
                className="rounded-lg bg-[#3395FF] px-4 py-1.5 text-base font-semibold text-white hover:bg-[#2a86ea]"
              >
                Add
              </button>
            </form>
          )}

          <ul className="mt-6 divide-y divide-baky-muted/30">
            {categories.map((c, i) => (
              <li
                key={c.name}
                className={`flex items-center justify-between px-2 py-4 text-xl text-black cursor-pointer rounded-md ${
                  i === selectedIdx ? "bg-baky-card" : ""
                }`}
                onClick={() => setSelectedIdx(i)}
              >
                <span>{c.name}</span>
                <Toggle
                  on={c.enabled}
                  onToggle={() => toggleCategory(c.name)}
                />
              </li>
            ))}
          </ul>
        </section>

        {/* Items column */}
        <section className="flex flex-col p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-black">
              Items ({activeItems.length})
            </h2>
            {activeCategoryName && (
              <button 
                onClick={() => setShowAddItem(!showAddItem)}
                className="text-lg font-semibold text-[#1177E5] hover:underline"
              >
                + ADD NEW
              </button>
            )}
          </div>

          {showAddItem && (
            <form onSubmit={handleCreateItem} className="mt-4 rounded-lg bg-baky-card/50 p-4 space-y-3 border border-baky-muted/10">
              <p className="text-sm font-semibold text-baky-muted">Adding item to {activeCategoryName}</p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Item Name"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="rounded-lg border border-baky-muted/30 bg-white px-3 py-1.5 text-sm text-black outline-none focus:border-[#3395FF]"
                />
                <input
                  type="number"
                  placeholder="Price (₹)"
                  required
                  min="0"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(e.target.value)}
                  className="rounded-lg border border-baky-muted/30 bg-white px-3 py-1.5 text-sm text-black outline-none focus:border-[#3395FF]"
                />
              </div>
              <input
                type="text"
                placeholder="Variants (comma-separated, e.g. Belgian, Brownie)"
                value={newItemVariants}
                onChange={(e) => setNewItemVariants(e.target.value)}
                className="w-full rounded-lg border border-baky-muted/30 bg-white px-3 py-1.5 text-sm text-black outline-none focus:border-[#3395FF]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddItem(false)}
                  className="rounded-lg border border-baky-muted/30 px-3 py-1 text-sm font-medium text-black hover:bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-[#3395FF] px-4 py-1 text-sm font-semibold text-white hover:bg-[#2a86ea]"
                >
                  Create
                </button>
              </div>
            </form>
          )}

          <ul className="mt-6 space-y-6 max-h-[500px] overflow-y-auto pr-1">
            {activeItems.map((item, i) => {
              const showVariants = !!expandedVariants[item.name];

              return (
                <li key={i} className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-baky-bar-strong" />
                      <p className="text-xl text-black">
                        {item.name}, ₹{item.price}
                      </p>
                    </div>

                    {item.variants.length > 0 && (
                      <button 
                        onClick={() => toggleVariantsExpand(item.name)}
                        className="mt-1 pl-4 text-[15px] font-semibold text-[#1177E5] hover:underline"
                      >
                        {showVariants ? "- Hide Variants" : `+ ${item.variants.length} Variants`}
                      </button>
                    )}

                    {showVariants && item.variants.length > 0 && (
                      <ul className="mt-2 space-y-1.5 pl-4">
                        {item.variants.map((v) => (
                          <li key={v} className="text-[15px] text-baky-muted flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-baky-muted/50" />
                            {v}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <Toggle
                    on={item.enabled}
                    onToggle={() => toggleMenuItem(item.name)}
                  />
                </li>
              );
            })}
            {activeItems.length === 0 && (
              <div className="flex h-36 items-center justify-center border border-dashed border-baky-muted/20 rounded-lg">
                <p className="text-xl text-baky-muted font-light">No items in this category.</p>
              </div>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
