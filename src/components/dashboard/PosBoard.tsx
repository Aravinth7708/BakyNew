import { useState } from "react";
import { useBakyData, MenuItem, OrderItem } from "@/context/BakyDataContext";
import { toast } from "sonner";
import { Trash2, Plus, Minus, Check } from "lucide-react";

export function PosBoard() {
  const { 
    categories, 
    menuItems, 
    placeOrder, 
    addCategory, 
    addMenuItem 
  } = useBakyData();

  // Filter enabled categories and items
  const activeCategories = categories.filter(c => c.enabled);
  
  const [selectedCategory, setSelectedCategory] = useState<string>(
    activeCategories[0]?.name || ""
  );

  // If selectedCategory is not in enabled list (e.g. disabled in menu), fall back
  const currentCategory = activeCategories.some(c => c.name === selectedCategory)
    ? selectedCategory
    : activeCategories[0]?.name || "";

  const activeItems = menuItems.filter(
    (item) => item.enabled && item.category === currentCategory
  );

  // States for adding items to cart
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [cart, setCart] = useState<OrderItem[]>([]);

  // States for forms
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemVariants, setNewItemVariants] = useState("");

  // Cart operations
  const handleSelectVariant = (itemName: string, variant: string) => {
    setSelectedVariants(prev => ({ ...prev, [itemName]: variant }));
  };

  const handleAddToCart = (item: MenuItem) => {
    const selectedVariant = item.variants.length > 0 
      ? selectedVariants[item.name] || item.variants[0]
      : undefined;

    // Check if item with same name and variant already in cart
    const existingIndex = cart.findIndex(
      (cartItem) => 
        cartItem.name === item.name && 
        cartItem.variant === selectedVariant
    );

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += 1;
      setCart(updatedCart);
    } else {
      const cartItem: OrderItem = {
        name: item.name,
        price: item.price,
        quantity: 1,
        variant: selectedVariant,
      };
      setCart([...cart, cartItem]);
    }
    toast.success(`Added ${item.name}${selectedVariant ? ` (${selectedVariant})` : ""} to cart`);
  };

  const updateCartQuantity = (index: number, delta: number) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += delta;
    if (updatedCart[index].quantity <= 0) {
      updatedCart.splice(index, 1);
    }
    setCart(updatedCart);
  };

  const handleRemoveFromCart = (index: number) => {
    const item = cart[index];
    setCart(cart.filter((_, idx) => idx !== index));
    toast.info(`Removed ${item.name} from cart`);
  };

  const handlePlaceOrder = () => {
    if (cart.length === 0) {
      toast.error("Cart is empty");
      return;
    }

    const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    placeOrder(cart, subtotal);
    setCart([]);
    setSelectedVariants({});
    toast.success("Order placed successfully!");
  };

  // Form handlers
  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    addCategory(newCategoryName.trim());
    setSelectedCategory(newCategoryName.trim());
    setNewCategoryName("");
    setShowAddCategoryForm(false);
    toast.success(`Category "${newCategoryName}" created`);
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
    setShowAddItemForm(false);
    toast.success(`Item "${newItem.name}" created`);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="flex flex-1 flex-col gap-6 lg:flex-row">
      {/* Category and Items Panel */}
      <div className="flex flex-1 flex-col rounded-[15px] bg-baky-surface p-6 shadow-sm">
        <div className="grid flex-1 grid-cols-1 md:grid-cols-[1fr_1.5fr] gap-6">
          {/* Categories Column */}
          <section className="flex flex-col border-b border-baky-muted/20 pb-6 md:border-b-0 md:border-r md:pr-6 md:pb-0">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-black">
                Categories ({activeCategories.length})
              </h2>
              <button 
                onClick={() => setShowAddCategoryForm(!showAddCategoryForm)}
                className="text-base font-bold text-[#1177E5] hover:underline"
              >
                + ADD NEW
              </button>
            </div>

            {showAddCategoryForm && (
              <form onSubmit={handleCreateCategory} className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="New Category..."
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 rounded-lg border border-baky-muted/30 px-3 py-2 text-lg text-black outline-none focus:border-[#3395FF]"
                  autoFocus
                />
                <button
                  type="submit"
                  className="rounded-lg bg-[#3395FF] px-4 py-2 text-lg font-medium text-white hover:bg-[#2a86ea]"
                >
                  Save
                </button>
              </form>
            )}

            <ul className="mt-6 flex flex-wrap gap-2 md:flex-col md:divide-y md:divide-baky-muted/10 md:gap-0">
              {activeCategories.map((c) => (
                <li key={c.name} className="md:w-full">
                  <button
                    onClick={() => {
                      setSelectedCategory(c.name);
                      setShowAddItemForm(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-lg font-medium transition-all md:rounded-none md:py-4 ${
                      c.name === currentCategory
                        ? "bg-baky-card text-black font-semibold shadow-sm"
                        : "text-baky-muted hover:bg-baky-card/30 hover:text-black"
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className="text-[#1177E5] font-semibold text-sm">
                      {menuItems.filter(item => item.enabled && item.category === c.name).length} items
                    </span>
                  </button>
                </li>
              ))}
              {activeCategories.length === 0 && (
                <p className="text-lg text-baky-muted py-4">No categories enabled.</p>
              )}
            </ul>
          </section>

          {/* Items Column */}
          <section className="flex flex-col">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-black">
                Items ({activeItems.length})
              </h2>
              {currentCategory && (
                <button 
                  onClick={() => setShowAddItemForm(!showAddItemForm)}
                  className="text-base font-bold text-[#1177E5] hover:underline"
                >
                  + ADD NEW
                </button>
              )}
            </div>

            {showAddItemForm && (
              <form onSubmit={handleCreateItem} className="mt-4 rounded-lg bg-baky-card/40 p-4 space-y-3 border border-baky-muted/10">
                <p className="text-sm font-semibold text-baky-muted">Adding item to {currentCategory}</p>
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
                <input
                  type="text"
                  placeholder="Variants (comma-separated, e.g. Belgian, Brownie)"
                  value={newItemVariants}
                  onChange={(e) => setNewItemVariants(e.target.value)}
                  className="w-full rounded-lg border border-baky-muted/30 bg-white px-3 py-2 text-base text-black outline-none focus:border-[#3395FF]"
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddItemForm(false)}
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

            <ul className="mt-6 flex-1 space-y-4 max-h-[500px] overflow-y-auto pr-1">
              {activeItems.map((item) => {
                const currentVariantSelection = selectedVariants[item.name] || item.variants[0];
                return (
                  <li
                    key={item.name}
                    className="rounded-[12px] bg-baky-card/50 p-4 border border-baky-muted/10 transition-all hover:bg-baky-card/80"
                  >
                    <div className="flex flex-col gap-3">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="h-[9px] w-[9px] shrink-0 rounded-full bg-baky-bar-strong" />
                            <p className="text-xl font-medium text-black">
                              {item.name}
                            </p>
                          </div>
                          <p className="mt-1 pl-4 text-lg font-bold text-black">
                            ₹{item.price}
                          </p>
                        </div>
                        <button
                          onClick={() => handleAddToCart(item)}
                          className="flex h-[36px] items-center gap-1 rounded-full bg-[#3395FF]/10 px-4 text-base font-bold text-[#1177E5] transition-colors hover:bg-[#3395FF] hover:text-white"
                        >
                          <Plus className="h-4 w-4" /> ADD
                        </button>
                      </div>

                      {item.variants.length > 0 && (
                        <div className="pl-4">
                          <p className="text-sm font-semibold text-baky-muted mb-2">Select Variant:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {item.variants.map((v) => (
                              <button
                                key={v}
                                onClick={() => handleSelectVariant(item.name, v)}
                                className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium transition-all ${
                                  currentVariantSelection === v
                                    ? "bg-[#3395FF] text-white font-semibold shadow-sm"
                                    : "bg-white text-baky-muted border border-baky-muted/20 hover:border-baky-muted"
                                }`}
                              >
                                {currentVariantSelection === v && <Check className="h-3 w-3" />}
                                {v}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
              {activeItems.length === 0 && (
                <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-baky-muted/20">
                  <p className="text-lg text-baky-muted">No items in this category yet.</p>
                </div>
              )}
            </ul>
          </section>
        </div>
      </div>

      {/* Cart Checkout Panel */}
      <div className="w-full lg:w-[400px] flex flex-col rounded-[15px] bg-baky-surface p-6 shadow-sm border border-baky-muted/10">
        <h2 className="text-2xl font-semibold text-black mb-6">Cart</h2>

        <div className="flex-1 overflow-y-auto max-h-[350px] lg:max-h-[none] space-y-4 pr-1">
          {cart.map((item, idx) => (
            <div 
              key={`${item.name}-${item.variant || ""}`}
              className="flex items-start justify-between gap-4 p-3 rounded-lg bg-baky-card/30 border border-baky-muted/5"
            >
              <div className="min-w-0">
                <p className="text-lg font-medium text-black truncate">{item.name}</p>
                {item.variant && (
                  <p className="text-sm text-baky-muted mt-0.5">Variant: {item.variant}</p>
                )}
                <p className="text-base font-bold text-black mt-1">₹{item.price * item.quantity}</p>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <button 
                  onClick={() => handleRemoveFromCart(idx)}
                  className="text-baky-muted hover:text-baky-red transition-colors"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                
                <div className="flex items-center gap-2 bg-white rounded-full border border-baky-muted/15 px-1 py-0.5">
                  <button 
                    onClick={() => updateCartQuantity(idx, -1)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-baky-muted hover:bg-baky-card"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-base font-semibold w-5 text-center text-black">
                    {item.quantity}
                  </span>
                  <button 
                    onClick={() => updateCartQuantity(idx, 1)}
                    className="flex h-6 w-6 items-center justify-center rounded-full text-baky-muted hover:bg-baky-card"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {cart.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <p className="text-xl text-baky-muted font-light">Your cart is empty.</p>
              <p className="text-sm text-baky-muted/60 mt-1">Add items from the menu to start an order.</p>
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-baky-muted/20 pt-6">
          <div className="flex items-center justify-between text-xl font-medium text-black mb-6">
            <span>Total Amount</span>
            <span className="text-2xl font-bold">₹{cartTotal.toLocaleString("en-IN")}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={cart.length === 0}
            className="w-full flex h-[64px] items-center justify-center rounded-[13px] bg-[#3395FF] text-2xl font-semibold text-white transition-all hover:bg-[#2a86ea] disabled:bg-baky-card disabled:text-baky-muted disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-[0.98]"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
}
