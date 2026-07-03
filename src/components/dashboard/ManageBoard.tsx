import { useState } from "react";
import { useBakyData, Staff, Outlet } from "@/context/BakyDataContext";
import { toast } from "sonner";
import { Edit2, Trash2, Check, X, RotateCcw } from "lucide-react";

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

  // Active selection
  const [selectedOption, setSelectedOption] = useState<"Staff" | "Outlets" | "Reset" | null>(null);

  // Staff Editing States
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [editingStaffName, setEditingStaffName] = useState<string | null>(null);
  const [staffName, setStaffName] = useState("");
  const [staffRole, setStaffRole] = useState("");
  const [staffContact, setStaffContact] = useState("");

  // Outlet Editing States
  const [showOutletForm, setShowOutletForm] = useState(false);
  const [editingOutletName, setEditingOutletName] = useState<string | null>(null);
  const [outletName, setOutletName] = useState("");
  const [outletLoc, setOutletLoc] = useState("");
  const [outletPhone, setOutletPhone] = useState("");
  const [outletStatus, setOutletStatus] = useState<"Active" | "Inactive">("Active");

  const startEditStaff = (member: Staff) => {
    setEditingStaffName(member.name);
    setStaffName(member.name);
    setStaffRole(member.role);
    setStaffContact(member.contact);
    setShowStaffForm(true);
  };

  const handleStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffName.trim() || !staffRole.trim() || !staffContact.trim()) return;

    const member: Staff = {
      name: staffName.trim(),
      role: staffRole.trim(),
      contact: staffContact.trim(),
    };

    if (editingStaffName) {
      editStaff(editingStaffName, member);
      toast.success(`Updated staff: ${member.name}`);
    } else {
      addStaff(member);
      toast.success(`Added staff: ${member.name}`);
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

  const handleDeleteStaff = (name: string) => {
    if (confirm(`Delete staff member "${name}"?`)) {
      deleteStaff(name);
      toast.info(`Deleted staff: ${name}`);
    }
  };

  const startEditOutlet = (outlet: Outlet) => {
    setEditingOutletName(outlet.name);
    setOutletName(outlet.name);
    setOutletLoc(outlet.location);
    setOutletPhone(outlet.phone);
    setOutletStatus(outlet.status);
    setShowOutletForm(true);
  };

  const handleOutletSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!outletName.trim() || !outletLoc.trim() || !outletPhone.trim()) return;

    const outlet: Outlet = {
      name: outletName.trim(),
      location: outletLoc.trim(),
      phone: outletPhone.trim(),
      status: outletStatus,
    };

    if (editingOutletName) {
      editOutlet(editingOutletName, outlet);
      toast.success(`Updated store: ${outlet.name}`);
    } else {
      addOutlet(outlet);
      toast.success(`Added store: ${outlet.name}`);
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

  const handleDeleteOutlet = (name: string) => {
    if (confirm(`Delete outlet "${name}"?`)) {
      deleteOutlet(name);
      toast.info(`Deleted outlet: ${name}`);
    }
  };

  const handleResetData = () => {
    if (confirm("Reset all sales, orders, and system settings back to defaults?")) {
      resetAllData();
      toast.success("Application data reset successfully.");
      setSelectedOption(null);
    }
  };

  const options = [
    {
      id: "Staff" as const,
      title: "Staff",
      description: "View users and their roles and responsibilities",
    },
    {
      id: "Outlets" as const,
      title: "Outlets",
      description: "Update outlet level informations",
    },
    {
      id: "Reset" as const,
      title: "Reset Data",
      description: "Clear localStorage and restore default seed data",
    },
  ];

  return (
    <div className="flex flex-1 flex-col rounded-[15px] bg-baky-surface shadow-sm">
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-2">
        {/* Admin column */}
        <section className="flex flex-col p-6 lg:border-r lg:border-baky-muted/50">
          <h2 className="text-2xl font-medium text-black">Admin</h2>

          <ul className="mt-6 border-t border-baky-muted/40">
            {options.map((o) => (
              <li key={o.title}>
                <button 
                  onClick={() => {
                    setSelectedOption(o.id);
                    clearStaffForm();
                    clearOutletForm();
                  }}
                  className={`flex w-full items-center justify-between gap-4 py-6 text-left hover:bg-baky-card/30 rounded-lg px-2 transition-all ${
                    selectedOption === o.id ? "bg-baky-card/50" : ""
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-2xl font-medium text-black">{o.title}</p>
                    <p className="mt-1 text-xl font-light text-baky-muted">
                      {o.description}
                    </p>
                  </div>
                  <span className="shrink-0 text-2xl font-medium text-[#3395FF]">
                    &gt;
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Dynamic details column (previously hidden/empty, now functional) */}
        <section className="flex flex-col p-6 max-h-[580px] overflow-y-auto pr-1">
          {/* Staff Option Selected */}
          {selectedOption === "Staff" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3 border-baky-muted/20">
                <h3 className="text-2xl font-semibold text-black">Staff Members</h3>
                <button
                  onClick={() => setShowStaffForm(!showStaffForm)}
                  className="text-base font-semibold text-[#1177E5] hover:underline"
                >
                  + Add User
                </button>
              </div>

              {showStaffForm && (
                <form onSubmit={handleStaffSubmit} className="rounded-lg bg-baky-card/40 p-4 space-y-3 border border-baky-muted/10">
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      placeholder="Full Name"
                      required
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      className="rounded border border-baky-muted/30 bg-white px-2.5 py-1 text-base text-black outline-none focus:border-[#3395FF]"
                    />
                    <input
                      type="text"
                      placeholder="Role (e.g. Chef, Cashier)"
                      required
                      value={staffRole}
                      onChange={(e) => setStaffRole(e.target.value)}
                      className="rounded border border-baky-muted/30 bg-white px-2.5 py-1 text-base text-black outline-none focus:border-[#3395FF]"
                    />
                    <input
                      type="text"
                      placeholder="Contact Info"
                      required
                      value={staffContact}
                      onChange={(e) => setStaffContact(e.target.value)}
                      className="rounded border border-baky-muted/30 bg-white px-2.5 py-1 text-base text-black outline-none focus:border-[#3395FF]"
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={clearStaffForm}
                      className="rounded border border-baky-muted/30 px-3 py-1 text-sm font-medium hover:bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded bg-[#3395FF] px-4 py-1 text-sm font-semibold text-white hover:bg-[#2a86ea]"
                    >
                      {editingStaffName ? "Save" : "Add"}
                    </button>
                  </div>
                </form>
              )}

              <ul className="divide-y divide-baky-muted/10">
                {staff.map((s) => (
                  <li key={s.name} className="py-4 flex justify-between items-center group">
                    <div>
                      <p className="text-xl font-medium text-black">{s.name}</p>
                      <p className="text-base text-baky-muted">{s.role} • {s.contact}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditStaff(s)}
                        className="p-1 hover:bg-baky-card rounded"
                      >
                        <Edit2 className="h-4 w-4 text-baky-muted hover:text-[#1177E5]" />
                      </button>
                      <button
                        onClick={() => handleDeleteStaff(s.name)}
                        className="p-1 hover:bg-baky-card rounded"
                      >
                        <Trash2 className="h-4 w-4 text-baky-muted hover:text-baky-red" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Outlets Option Selected */}
          {selectedOption === "Outlets" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3 border-baky-muted/20">
                <h3 className="text-2xl font-semibold text-black">Store Outlets</h3>
                <button
                  onClick={() => setShowOutletForm(!showOutletForm)}
                  className="text-base font-semibold text-[#1177E5] hover:underline"
                >
                  + Add Store
                </button>
              </div>

              {showOutletForm && (
                <form onSubmit={handleOutletSubmit} className="rounded-lg bg-baky-card/40 p-4 space-y-3 border border-baky-muted/10">
                  <div className="grid grid-cols-1 gap-2">
                    <input
                      type="text"
                      placeholder="Outlet Name"
                      required
                      value={outletName}
                      onChange={(e) => setOutletName(e.target.value)}
                      className="rounded border border-baky-muted/30 bg-white px-2.5 py-1 text-base text-black outline-none focus:border-[#3395FF]"
                    />
                    <input
                      type="text"
                      placeholder="Location"
                      required
                      value={outletLoc}
                      onChange={(e) => setOutletLoc(e.target.value)}
                      className="rounded border border-baky-muted/30 bg-white px-2.5 py-1 text-base text-black outline-none focus:border-[#3395FF]"
                    />
                    <input
                      type="text"
                      placeholder="Phone Number"
                      required
                      value={outletPhone}
                      onChange={(e) => setOutletPhone(e.target.value)}
                      className="rounded border border-baky-muted/30 bg-white px-2.5 py-1 text-base text-black outline-none focus:border-[#3395FF]"
                    />
                    <select
                      value={outletStatus}
                      onChange={(e) => setOutletStatus(e.target.value as "Active" | "Inactive")}
                      className="rounded border border-baky-muted/30 bg-white px-2.5 py-1 text-base text-black outline-none focus:border-[#3395FF]"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={clearOutletForm}
                      className="rounded border border-baky-muted/30 px-3 py-1 text-sm font-medium hover:bg-white"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded bg-[#3395FF] px-4 py-1 text-sm font-semibold text-white hover:bg-[#2a86ea]"
                    >
                      {editingOutletName ? "Save" : "Add"}
                    </button>
                  </div>
                </form>
              )}

              <ul className="divide-y divide-baky-muted/10">
                {outlets.map((o) => (
                  <li key={o.name} className="py-4 flex justify-between items-center group">
                    <div>
                      <p className="text-xl font-medium text-black">
                        {o.name}
                        <span className={`ml-2 text-xs font-bold px-1.5 py-0.5 rounded ${
                          o.status === "Active" ? "text-baky-green bg-baky-green/10" : "text-baky-muted bg-baky-card"
                        }`}>
                          {o.status}
                        </span>
                      </p>
                      <p className="text-base text-baky-muted">{o.location} • {o.phone}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditOutlet(o)}
                        className="p-1 hover:bg-baky-card rounded"
                      >
                        <Edit2 className="h-4 w-4 text-baky-muted hover:text-[#1177E5]" />
                      </button>
                      <button
                        onClick={() => handleDeleteOutlet(o.name)}
                        className="p-1 hover:bg-baky-card rounded"
                      >
                        <Trash2 className="h-4 w-4 text-baky-muted hover:text-baky-red" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Reset Option Selected */}
          {selectedOption === "Reset" && (
            <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-baky-red/20 bg-baky-red/5 rounded-xl">
              <h3 className="text-2xl font-bold text-black mb-2">Reset All System Data</h3>
              <p className="text-base text-baky-muted mb-6 leading-relaxed">
                This will wipe out all of your customized settings, local orders, inventory updates, 
                and restore the default mockup datasets.
              </p>
              <button
                onClick={handleResetData}
                className="flex items-center gap-2 rounded-xl bg-baky-red px-6 py-3 text-lg font-bold text-white shadow-sm hover:opacity-90 transition-all active:scale-[0.98]"
              >
                <RotateCcw className="h-4 w-4" /> Reset Settings
              </button>
            </div>
          )}

          {/* Empty details display (keeps design accurate if nothing selected) */}
          {!selectedOption && (
            <div className="hidden lg:flex flex-col items-center justify-center h-full text-center p-8">
              <p className="text-xl text-baky-muted font-light">Select an option from the Admin list to manage settings.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
