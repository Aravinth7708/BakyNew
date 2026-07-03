import React, { createContext, useContext, useState, useEffect } from "react";

export interface Category {
  name: string;
  enabled: boolean;
}

export interface MenuItem {
  name: string;
  price: number;
  category: string;
  variants: string[];
  enabled: boolean;
}

export interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  variant?: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  amount: number;
  status: "New" | "Preparing" | "Served" | "Past Orders";
  createdAt: string;
}

export interface InventoryItem {
  name: string;
  current: number;
  total: number;
}

export interface Staff {
  name: string;
  role: string;
  contact: string;
}

export interface Outlet {
  name: string;
  location: string;
  phone: string;
  status: "Active" | "Inactive";
}

interface BakyDataContextType {
  categories: Category[];
  menuItems: MenuItem[];
  orders: Order[];
  inventory: InventoryItem[];
  staff: Staff[];
  outlets: Outlet[];
  
  // Mutators
  addCategory: (name: string) => void;
  toggleCategory: (name: string) => void;
  addMenuItem: (item: MenuItem) => void;
  toggleMenuItem: (name: string) => void;
  deleteMenuItem: (name: string) => void;
  placeOrder: (items: OrderItem[], totalAmount: number) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  updateOrderAmount: (orderId: string, amount: number) => void;
  updateStock: (name: string, current: number, total: number) => void;
  addInventoryItem: (item: InventoryItem) => void;
  addStaff: (member: Staff) => void;
  editStaff: (originalName: string, member: Staff) => void;
  deleteStaff: (name: string) => void;
  addOutlet: (outlet: Outlet) => void;
  editOutlet: (originalName: string, outlet: Outlet) => void;
  deleteOutlet: (name: string) => void;
  resetAllData: () => void;
}

const BakyDataContext = createContext<BakyDataContextType | undefined>(undefined);

const SEED_CATEGORIES: Category[] = [
  { name: "Waffle", enabled: true },
  { name: "Shakes", enabled: true },
  { name: "Signature", enabled: true },
  { name: "Brownie", enabled: true },
];

const SEED_MENU_ITEMS: MenuItem[] = [
  { name: "Hazelnut Waffle", price: 100, category: "Waffle", variants: ["Belgian", "Brownie", "Redvelvet"], enabled: true },
  { name: "Nutella Shake", price: 120, category: "Shakes", variants: [], enabled: true },
  { name: "Baky Signature Sundae", price: 180, category: "Signature", variants: [], enabled: true },
  { name: "Triple Chocolate Brownie", price: 150, category: "Brownie", variants: [], enabled: true },
  { name: "Matilda Cake", price: 200, category: "Signature", variants: [], enabled: true },
];

const SEED_INVENTORY: InventoryItem[] = [
  { name: "Waffle Flour (kg)", current: 5, total: 50 },
  { name: "Brownie Plates (Pack)", current: 2, total: 10 },
  { name: "Dark Compound (Pack)", current: 1, total: 10 },
  { name: "Milk (liters)", current: 15, total: 20 },
  { name: "Waffle Iron Cups (Pack)", current: 8, total: 10 },
];

const SEED_STAFF: Staff[] = [
  { name: "Aravinth", role: "Manager", contact: "9876543210" },
  { name: "Kishore", role: "Cashier", contact: "9876543211" },
  { name: "Aakash", role: "Chef", contact: "9876543212" },
];

const SEED_OUTLETS: Outlet[] = [
  { name: "Baky Dessert House - Chennai Main", location: "Chennai", phone: "044-1234567", status: "Active" },
  { name: "Baky Dessert House - OMR Express", location: "OMR, Chennai", phone: "044-7654321", status: "Active" },
];

// Helper to get date ISO strings relative to today
const getRelativeDateISO = (daysAgo: number) => {
  const d = new Date();
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

const SEED_ORDERS: Order[] = [
  {
    id: "#0001",
    createdAt: getRelativeDateISO(3),
    amount: 350,
    status: "Past Orders",
    items: [
      { name: "Triple Chocolate Brownie", price: 150, quantity: 1 },
      { name: "Matilda Cake", price: 200, quantity: 1 },
    ],
  },
  {
    id: "#0002",
    createdAt: getRelativeDateISO(2),
    amount: 200,
    status: "Past Orders",
    items: [{ name: "Hazelnut Waffle", variant: "Belgian", price: 100, quantity: 2 }],
  },
  {
    id: "#0003",
    createdAt: getRelativeDateISO(1),
    amount: 220,
    status: "Past Orders",
    items: [
      { name: "Nutella Shake", price: 120, quantity: 1 },
      { name: "Hazelnut Waffle", variant: "Brownie", price: 100, quantity: 1 },
    ],
  },
  {
    id: "#0004",
    createdAt: getRelativeDateISO(0),
    amount: 220,
    status: "New",
    items: [
      { name: "Hazelnut Waffle", variant: "Redvelvet", price: 100, quantity: 1 },
      { name: "Nutella Shake", price: 120, quantity: 1 },
    ],
  },
];

export const BakyDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [outlets, setOutlets] = useState<Outlet[]>([]);

  useEffect(() => {
    // Load from local storage or set seed data
    const localCategories = localStorage.getItem("baky_categories");
    const localMenuItems = localStorage.getItem("baky_menu_items");
    const localOrders = localStorage.getItem("baky_orders");
    const localInventory = localStorage.getItem("baky_inventory");
    const localStaff = localStorage.getItem("baky_staff");
    const localOutlets = localStorage.getItem("baky_outlets");

    if (localCategories) setCategories(JSON.parse(localCategories));
    else setCategories(SEED_CATEGORIES);

    if (localMenuItems) setMenuItems(JSON.parse(localMenuItems));
    else setMenuItems(SEED_MENU_ITEMS);

    if (localOrders) setOrders(JSON.parse(localOrders));
    else setOrders(SEED_ORDERS);

    if (localInventory) setInventory(JSON.parse(localInventory));
    else setInventory(SEED_INVENTORY);

    if (localStaff) setStaff(JSON.parse(localStaff));
    else setStaff(SEED_STAFF);

    if (localOutlets) setOutlets(JSON.parse(localOutlets));
    else setOutlets(SEED_OUTLETS);
  }, []);

  // Save to local storage helpers
  const saveCategories = (data: Category[]) => {
    setCategories(data);
    localStorage.setItem("baky_categories", JSON.stringify(data));
  };

  const saveMenuItems = (data: MenuItem[]) => {
    setMenuItems(data);
    localStorage.setItem("baky_menu_items", JSON.stringify(data));
  };

  const saveOrders = (data: Order[]) => {
    setOrders(data);
    localStorage.setItem("baky_orders", JSON.stringify(data));
  };

  const saveInventory = (data: InventoryItem[]) => {
    setInventory(data);
    localStorage.setItem("baky_inventory", JSON.stringify(data));
  };

  const saveStaff = (data: Staff[]) => {
    setStaff(data);
    localStorage.setItem("baky_staff", JSON.stringify(data));
  };

  const saveOutlets = (data: Outlet[]) => {
    setOutlets(data);
    localStorage.setItem("baky_outlets", JSON.stringify(data));
  };

  // Mutators
  const addCategory = (name: string) => {
    if (categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) return;
    saveCategories([...categories, { name, enabled: true }]);
  };

  const toggleCategory = (name: string) => {
    saveCategories(
      categories.map((c) => (c.name === name ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const addMenuItem = (item: MenuItem) => {
    if (menuItems.some((mi) => mi.name.toLowerCase() === item.name.toLowerCase())) return;
    saveMenuItems([...menuItems, item]);
  };

  const toggleMenuItem = (name: string) => {
    saveMenuItems(
      menuItems.map((mi) => (mi.name === name ? { ...mi, enabled: !mi.enabled } : mi))
    );
  };

  const deleteMenuItem = (name: string) => {
    saveMenuItems(menuItems.filter((mi) => mi.name !== name));
  };

  const placeOrder = (items: OrderItem[], totalAmount: number) => {
    // Generate new order ID e.g., #0005
    const lastIdNum = orders.reduce((max, order) => {
      const num = parseInt(order.id.replace("#", ""), 10);
      return num > max ? num : max;
    }, 0);
    const nextId = `#${String(lastIdNum + 1).padStart(4, "0")}`;

    const newOrder: Order = {
      id: nextId,
      items,
      amount: totalAmount,
      status: "New",
      createdAt: new Date().toISOString(),
    };

    saveOrders([newOrder, ...orders]);
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    saveOrders(
      orders.map((o) => (o.id === orderId ? { ...o, status } : o))
    );
  };

  const updateOrderAmount = (orderId: string, amount: number) => {
    saveOrders(
      orders.map((o) => (o.id === orderId ? { ...o, amount } : o))
    );
  };

  const updateStock = (name: string, current: number, total: number) => {
    saveInventory(
      inventory.map((item) => (item.name === name ? { ...item, current, total } : item))
    );
  };

  const addInventoryItem = (item: InventoryItem) => {
    if (inventory.some((i) => i.name.toLowerCase() === item.name.toLowerCase())) return;
    saveInventory([...inventory, item]);
  };

  const addStaff = (member: Staff) => {
    if (staff.some((s) => s.name.toLowerCase() === member.name.toLowerCase())) return;
    saveStaff([...staff, member]);
  };

  const editStaff = (originalName: string, member: Staff) => {
    saveStaff(staff.map((s) => (s.name === originalName ? member : s)));
  };

  const deleteStaff = (name: string) => {
    saveStaff(staff.filter((s) => s.name !== name));
  };

  const addOutlet = (outlet: Outlet) => {
    if (outlets.some((o) => o.name.toLowerCase() === outlet.name.toLowerCase())) return;
    saveOutlets([...outlets, outlet]);
  };

  const editOutlet = (originalName: string, outlet: Outlet) => {
    saveOutlets(outlets.map((o) => (o.name === originalName ? outlet : o)));
  };

  const deleteOutlet = (name: string) => {
    saveOutlets(outlets.filter((o) => o.name !== name));
  };

  const resetAllData = () => {
    localStorage.removeItem("baky_categories");
    localStorage.removeItem("baky_menu_items");
    localStorage.removeItem("baky_orders");
    localStorage.removeItem("baky_inventory");
    localStorage.removeItem("baky_staff");
    localStorage.removeItem("baky_outlets");

    setCategories(SEED_CATEGORIES);
    setMenuItems(SEED_MENU_ITEMS);
    setOrders(SEED_ORDERS);
    setInventory(SEED_INVENTORY);
    setStaff(SEED_STAFF);
    setOutlets(SEED_OUTLETS);
  };

  return (
    <BakyDataContext.Provider
      value={{
        categories,
        menuItems,
        orders,
        inventory,
        staff,
        outlets,
        addCategory,
        toggleCategory,
        addMenuItem,
        toggleMenuItem,
        deleteMenuItem,
        placeOrder,
        updateOrderStatus,
        updateOrderAmount,
        updateStock,
        addInventoryItem,
        addStaff,
        editStaff,
        deleteStaff,
        addOutlet,
        editOutlet,
        deleteOutlet,
        resetAllData,
      }}
    >
      {children}
    </BakyDataContext.Provider>
  );
};

export const useBakyData = () => {
  const context = useContext(BakyDataContext);
  if (context === undefined) {
    throw new Error("useBakyData must be used within a BakyDataProvider");
  }
  return context;
};
