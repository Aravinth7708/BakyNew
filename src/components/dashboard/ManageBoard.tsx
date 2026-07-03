import { useState } from "react";
import { useBakyData, Staff, Outlet } from "@/context/BakyDataContext";
import { toast } from "sonner";
import { Trash2, Edit2, Check, X, ShieldAlert, Users, Store, RotateCcw } from "lucide-react";

type ManageTab = "staff" | "outlets" | "reset";

export function ManageBoard() {
  const {
    staff,
    outlets,
    addStaff,
    editStaff,
    deleteStaff,
    addOutlet,
    editOutlet,
    deleteOutlet,
    resetAllData,
  } = useBakyData();

  const [activeTab, setActiveTab] = useState<ManageTab>("staff");

  // Staff Form States
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [editingStaffName, setEditingStaffName] = useState<string | null>(null);
  const [staffName, setStaffName] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [staffContact, setStaffContact] = useState("");

  // Outlet Form States
  const [showOutletForm, setShowOutletForm] = useState(false);
  const [editingOutletName, setEditingOutletName] = useState<string | null>(null);
  const [outletName, setOutletName] = useState("");
  const [outletLoc, setOutletLoc] = useState("");
  const [outletPhone, setOutletPhone] = useState("");
  const [outletStatus, setOutletStatus] = useState<"Active" | "Inactive">("Active");

  // Staff Submit
  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !staffRole.trim() || !staffContact.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    const member: Staff = {
      name: staffName.trim(),
      role: staffRole.trim(),
      contact: staffContact.trim(),
    };

    if (editingStaffName) {
      editStaff(editingStaffName, member);
      toast.success(`Updated staff details for ${member.name}`);
    } else {
      addStaff(member);
      toast.success(`Added new staff member: ${member.name}`);
    }

    clearStaffForm();
  };

  const clearStaffForm = () => {
    setStaffName("");
    setStaffRole("");
    setStaffContact("");
    setEditingStaffName(null);
    setShowStaffForm(false);
  };

  const startEditStaff = (member: Staff) => {
    setEditingStaffName(member.name);
    setStaffName(member.name);
    setStaffRole(member.role);
    setStaffContact(member.contact);
    setShowStaffForm(true);
  };

  const handleDeleteStaff = (name: string) => {
    if (confirm(`Are you sure you want to delete staff member "${name}"?`)) {
      deleteStaff(name);
      toast.info(`Removed staff member "${name}"`);
    }
  };

  // Outlet Submit
  const handleOutletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outletName.trim() || !outletLoc.trim() || !outletPhone.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }

    const outlet: Outlet = {
      name: outletName.trim(),
      location: outletLoc.trim(),
      phone: outletPhone.trim(),
      status: outletStatus,
    };

    if (editingOutletName) {
      editOutlet(editingOutletName, outlet);
      toast.success(`Updated outlet details for ${outlet.name}`);
    } else {
      addOutlet(outlet);
      toast.success(`Added new outlet: ${outlet.name}`);
    }

    clearOutletForm();
  };

  const clearOutletForm = () => {
    setOutletName("");
    setOutletLoc("");
    setOutletPhone("");
    setOutletStatus("Active");
    setEditingOutletName(null);
    setShowOutletForm(false);
  };

  const startEditOutlet = (outlet: Outlet) => {
    setEditingOutletName(outlet.name);
    setOutletName(outlet.name);
    setOutletLoc(outlet.location);
    setOutletPhone(outlet.phone);
    setOutletStatus(outlet.status);
    setShowOutletForm(true);
  };

  const handleDeleteOutlet = (name: string) => {
    if (confirm(`Are you sure you want to delete outlet "${name}"?`)) {
      deleteOutlet(name);
      toast.info(`Removed outlet "${name}"`);
    }
  };

  const handleResetData = () => {
    if (
      confirm(
        "WARNING: This will reset all your POS sales data, orders, menu changes, and inventory back to defaults. Do you want to proceed?"
      )
    ) {
      resetAllData();
      toast.success("All application data has been reset to default seed values.");
    }
  };

  return (
    <div className="flex flex-1 flex-col rounded-[15px] bg-baky-surface shadow-sm">
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-[250px_1fr]">
        {/* Left Admin Navigation Column */}
        <section className="flex flex-col border-b border-baky-muted/20 p-6 lg:border-b-0 lg:border-r">
          <h2 className="text-2xl font-semibold text-black">Settings & Admin</h2>
          
          <nav className="mt-6 flex flex-wrap gap-2 lg:flex-col lg:gap-1">
            <button
              onClick={() => setActiveTab("staff")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-lg font-semibold transition-all ${
                activeTab === "staff"
                  ? "bg-baky-card text-black"
                  : "text-baky-muted hover:bg-baky-card/30 hover:text-black"
              }`}
            >
              <Users className="h-5 w-5" />
              <span>Staff Users</span>
            </button>
            
            <button
              onClick={() => setActiveTab("outlets")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-lg font-semibold transition-all ${
                activeTab === "outlets"
                  ? "bg-baky-card text-black"
                  : "text-baky-muted hover:bg-baky-card/30 hover:text-black"
              }`}
            >
              <Store className="h-5 w-5" />
              <span>Outlet List</span>
            </button>
            
            <button
              onClick={() => setActiveTab("reset")}
              className={`flex w-full items-center gap-3 rounded-lg px-4 py-3 text-lg font-semibold transition-all ${
                activeTab === "reset"
                  ? "bg-baky-red/10 text-baky-red"
                  : "text-baky-muted hover:bg-baky-red/5 hover:text-baky-red"
              }`}
            >
              <RotateCcw className="h-5 w-5" />
              <span>Reset App Data</span>
            </button>
          </nav>
        </section>

        {/* Right Active Panel Column */}
        <section className="flex flex-col p-6">
          {/* TAB 1: STAFF MANAGEMENT */}
          {activeTab === "staff" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-black">Staff Directory</h3>
                {!showStaffForm && (
                  <button
                    onClick={() => setShowStaffForm(true)}
                    className="rounded-lg bg-[#3395FF] px-4 py-2 text-base font-bold text-white hover:bg-[#2a86ea] transition-all"
                  >
                    + Add Staff
                  </button>
                )}
              </div>

              {showStaffForm && (
                <form onSubmit={handleStaffSubmit} className="rounded-lg bg-baky-card/40 p-5 space-y-4 border border-baky-muted/10">
                  <h4 className="text-base font-semibold text-black">
                    {editingStaffName ? `Edit User: ${editingStaffName}` : "Create New Staff User"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-baky-muted">Full Name</label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-lg border border-baky-muted/30 bg-white px-3 py-2 text-base text-black outline-none focus:border-[#3395FF]"
                        value={staffName}
                        onChange={(e) => setStaffName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-baky-muted">Role/Title</label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-lg border border-baky-muted/30 bg-white px-3 py-2 text-base text-black outline-none focus:border-[#3395FF]"
                        placeholder="e.g. Cashier, Chef"
                        value={staffRole}
                        onChange={(e) => setStaffRole(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-baky-muted">Contact Info</label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-lg border border-baky-muted/30 bg-white px-3 py-2 text-base text-black outline-none focus:border-[#3395FF]"
                        placeholder="e.g. Phone Number"
                        value={staffContact}
                        onChange={(e) => setStaffContact(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={clearStaffForm}
                      className="rounded-lg border border-baky-muted/30 px-4 py-2 text-base font-semibold text-black hover:bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-baky-green px-4 py-2 text-base font-semibold text-white hover:opacity-90"
                    >
                      {editingStaffName ? "Save Details" : "Create User"}
                    </button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-baky-muted/20 text-base font-semibold text-baky-muted">
                      <th className="pb-3">Name</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Contact</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-baky-muted/10">
                    {staff.map((member) => (
                      <tr key={member.name} className="hover:bg-baky-card/5 transition-colors">
                        <td className="py-4 text-lg font-medium text-black">{member.name}</td>
                        <td className="py-4 text-base text-baky-muted">{member.role}</td>
                        <td className="py-4 text-base text-baky-muted">{member.contact}</td>
                        <td className="py-4 text-right space-x-2">
                          <button
                            onClick={() => startEditStaff(member)}
                            className="inline-flex rounded-lg p-1.5 text-baky-muted hover:text-[#1177E5] hover:bg-baky-card/40 transition-all"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteStaff(member.name)}
                            className="inline-flex rounded-lg p-1.5 text-baky-muted hover:text-baky-red hover:bg-baky-card/40 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: OUTLET MANAGEMENT */}
          {activeTab === "outlets" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-semibold text-black">Store Outlets</h3>
                {!showOutletForm && (
                  <button
                    onClick={() => setShowOutletForm(true)}
                    className="rounded-lg bg-[#3395FF] px-4 py-2 text-base font-bold text-white hover:bg-[#2a86ea] transition-all"
                  >
                    + Add Outlet
                  </button>
                )}
              </div>

              {showOutletForm && (
                <form onSubmit={handleOutletSubmit} className="rounded-lg bg-baky-card/40 p-5 space-y-4 border border-baky-muted/10">
                  <h4 className="text-base font-semibold text-black">
                    {editingOutletName ? `Edit Store: ${editingOutletName}` : "Register New Outlet Store"}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-baky-muted">Outlet Name</label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-lg border border-baky-muted/30 bg-white px-3 py-2 text-base text-black outline-none focus:border-[#3395FF]"
                        value={outletName}
                        onChange={(e) => setOutletName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-baky-muted">Location</label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-lg border border-baky-muted/30 bg-white px-3 py-2 text-base text-black outline-none focus:border-[#3395FF]"
                        value={outletLoc}
                        onChange={(e) => setOutletLoc(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-baky-muted">Phone Number</label>
                      <input
                        type="text"
                        required
                        className="w-full rounded-lg border border-baky-muted/30 bg-white px-3 py-2 text-base text-black outline-none focus:border-[#3395FF]"
                        value={outletPhone}
                        onChange={(e) => setOutletPhone(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-sm font-semibold text-baky-muted">Status</label>
                      <select
                        required
                        className="w-full rounded-lg border border-baky-muted/30 bg-white px-3 py-2 text-base text-black outline-none focus:border-[#3395FF]"
                        value={outletStatus}
                        onChange={(e) => setOutletStatus(e.target.value as "Active" | "Inactive")}
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={clearOutletForm}
                      className="rounded-lg border border-baky-muted/30 px-4 py-2 text-base font-semibold text-black hover:bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-baky-green px-4 py-2 text-base font-semibold text-white hover:opacity-90"
                    >
                      {editingOutletName ? "Save Store" : "Add Store"}
                    </button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-baky-muted/20 text-base font-semibold text-baky-muted">
                      <th className="pb-3">Store Name</th>
                      <th className="pb-3">Location</th>
                      <th className="pb-3">Contact</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-baky-muted/10">
                    {outlets.map((outlet) => (
                      <tr key={outlet.name} className="hover:bg-baky-card/5 transition-colors">
                        <td className="py-4 text-lg font-medium text-black">{outlet.name}</td>
                        <td className="py-4 text-base text-baky-muted">{outlet.location}</td>
                        <td className="py-4 text-base text-baky-muted">{outlet.phone}</td>
                        <td className="py-4 text-base">
                          <span className={`inline-flex items-center text-xs font-bold px-2 py-0.5 rounded-full ${
                            outlet.status === "Active"
                              ? "text-baky-green bg-baky-green/10"
                              : "text-baky-muted bg-baky-muted/10"
                          }`}>
                            {outlet.status}
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-2">
                          <button
                            onClick={() => startEditOutlet(outlet)}
                            className="inline-flex rounded-lg p-1.5 text-baky-muted hover:text-[#1177E5] hover:bg-baky-card/40 transition-all"
                            title="Edit"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteOutlet(outlet.name)}
                            className="inline-flex rounded-lg p-1.5 text-baky-muted hover:text-baky-red hover:bg-baky-card/40 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: RESET DANGER ZONE */}
          {activeTab === "reset" && (
            <div className="flex flex-1 flex-col items-center justify-center p-8 max-w-md mx-auto text-center border border-dashed border-baky-red/30 rounded-2xl bg-baky-red/5">
              <ShieldAlert className="h-16 w-16 text-baky-red animate-bounce" />
              <h3 className="mt-4 text-2xl font-bold text-black">System Reset Area</h3>
              
              <p className="mt-2 text-base text-baky-muted font-normal">
                This process will wipe all operational changes made to the POS, orders list, 
                menu items, category state, and inventory tracking in this browser session. 
                The application will load default seed data.
              </p>

              <button
                onClick={handleResetData}
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-xl bg-baky-red text-xl font-bold text-white transition-all hover:bg-red-700 shadow-md active:scale-[0.98]"
              >
                <RotateCcw className="h-5 w-5" />
                <span>Reset All System Data</span>
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
