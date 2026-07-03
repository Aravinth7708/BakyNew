import { useState } from "react";
import { useBakyData, MenuItem, OrderItem } from "@/context/BakyDataContext";
import { toast } from "sonner";

export function PosBoard() {
  const { 
    categories, 
    menuItems, 
    placeOrder, 
    addCategory, 
    addMenuItem 
  } = useBakyData();

  // Filter enabled categories
  const activeCategories = categories.filter(c => c.enabled);

  // States
  const [selectedCategory, setSelectedCategory] = useState<string>(
    activeCategories[0]?.name || ""
  );

  // Fallback if category disabled in menu
  const currentCategory = activeCategories.some(c => c.name === selectedCategory)
    ? selectedCategory
    : activeCategories[0]?.name || "";

  const activeItems = menuItems.filter(
    (item) => item.enabled && item.category === currentCategory
  );

  // Cart state: item -> quantity and selected variant
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  
  // Toggles for variant lists
  const [expandedVariants, setExpandedVariants] = useState<Record<string, boolean>>({});

  // Inline forms toggles
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCatName, setNewCatName] = useState("");

  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemVariants, setNewItemVariants] = useState("");

  const toggleVariantsExpand = (itemName: string) => {
    setExpandedVariants(prev => ({ ...prev, [itemName]: !prev[itemName] }));
  };

  const handleSelectVariant = (itemName: string, variant: string) => {
    setSelectedVariants(prev => ({ ...prev, [itemName]: variant }));
  };

  const handleAddToCart = (item: MenuItem) => {
    const variant = item.variants.length > 0 
      ? selectedVariants[item.name] || item.variants[0]
      : undefined;

    const existingIdx = cart.findIndex(
      (c) => c.name === item.name && c.variant === variant
    );

    if (existingIdx > -1) {
      const newCart = [...cart];
      newCart[existingIdx].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { name: item.name, price: item.price, quantity: 1, variant }]);
    }
    toast.success(`Added ${item.name}${variant ? ` (${variant})` : ""} to order`);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast.error("No items added to current order.");
      return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    placeOrder(cart, total);
    setCart([]);
    setSelectedVariants({});
    toast.success("Order placed successfully!");
  };

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory(newCatName.trim());
    setSelectedCategory(newCatName.trim());
    setNewCatName("");
    setShowAddCategory(false);
    toast.success(`Category "${newCatName}" created`);
  };

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemPrice) return;

    const variantsArray = newItemVariants
      .split(",")
      .map(v => v.trim())
      .filter(v => v.length > 0);

    const newItem: MenuItem = {
      name: newItemName.trim(),
      price: parseFloat(newItemPrice),
      category: currentCategory,
      variants: variantsArray,
      enabled: true,
    };

    addMenuItem(newItem);
    setNewItemName("");
    setNewItemPrice("");
    setNewItemVariants("");
    setShowAddItem(false);
    toast.success(`Item "${newItem.name}" created`);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-1 flex-col rounded-[15px] bg-baky-surface">
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        
        {/* Category column */}
        <section className="flex flex-col border-b border-baky-muted/50 p-6 lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-medium text-black">
              Category ({activeCategories.length})
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
            {activeCategories.map((c) => (
              <li
                key={c.name}
                className={`flex items-center justify-between px-2 py-4 text-xl text-black cursor-pointer rounded-md ${
                  c.name === currentCategory ? "bg-baky-card font-semibold" : ""
                }`}
                onClick={() => setSelectedCategory(c.name)}
              >
                <span>{c.name}</span>
                <button className="text-lg font-semibold text-[#1177E5]">+</button>
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
            {currentCategory && (
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
              <p className="text-sm font-semibold text-baky-muted">Adding item to {currentCategory}</p>
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

          <ul className="mt-6 flex-1 space-y-4 max-h-[480px] overflow-y-auto pr-1">
            {activeItems.map((item, i) => {
              const showVariants = !!expandedVariants[item.name];
              const selectedVar = selectedVariants[item.name] || item.variants[0];

              return (
                <li
                  key={item.name}
                  className={`rounded-md p-4 transition-all ${
                    i === 0 ? "bg-baky-card" : "hover:bg-baky-card/20"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
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
                        <ul className="mt-2 space-y-2 pl-4">
                          {item.variants.map((v) => (
                            <li
                              key={v}
                              className="flex items-center gap-2 text-[15px] text-baky-muted cursor-pointer"
                              onClick={() => handleSelectVariant(item.name, v)}
                            >
                              <span 
                                className={`h-[9px] w-[9px] shrink-0 rounded-full border-[1.5px] transition-all ${
                                  selectedVar === v 
                                    ? "bg-[#1177E5] border-[#1177E5]" 
                                    : "border-baky-muted"
                                }`} 
                              />
                              <span className={selectedVar === v ? "text-black font-semibold" : ""}>{v}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <button 
                      onClick={() => handleAddToCart(item)}
                      className="shrink-0 text-lg font-semibold text-[#1177E5] hover:underline"
                    >
                      + ADD
                    </button>
                  </div>
                </li>
              );
            })}
            {activeItems.length === 0 && (
              <div className="flex h-36 items-center justify-center border border-dashed border-baky-muted/20 rounded-lg">
                <p className="text-xl text-baky-muted font-light">No items in this category.</p>
              </div>
            )}
          </ul>

          <div className="mt-6 flex flex-col items-end gap-2">
            {cartCount > 0 && (
              <div className="text-sm font-medium text-baky-muted mr-2">
                Selected: {cart.map(c => `${c.name}${c.variant ? ` (${c.variant})` : ""} x${c.quantity}`).join(", ")}
              </div>
            )}
            <button 
              onClick={handlePlaceOrder}
              disabled={cart.length === 0}
              className="flex h-[74px] w-full max-w-[475px] items-center justify-center rounded-[13px] bg-[#3395FF] text-3xl font-medium text-white transition-colors hover:bg-[#2a86ea] disabled:bg-baky-card disabled:text-baky-muted disabled:cursor-not-allowed shadow-sm active:scale-[0.99]"
            >
              {cartCount > 0 ? `Add (${cartCount} items — ₹${cartTotal})` : "Add"}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
