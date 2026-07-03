const options = [
  {
    title: "Staff",
    description: "View users and their roles and responsibilities",
  },
  {
    title: "Outlets",
    description: "Update outlet level informations",
  },
];

export function ManageBoard() {
  return (
    <div className="flex flex-1 flex-col rounded-[15px] bg-baky-surface">
      <div className="grid flex-1 grid-cols-1 lg:grid-cols-2">
        {/* Admin column */}
        <section className="flex flex-col p-6 lg:border-r lg:border-baky-muted/50">
          <h2 className="text-2xl font-medium text-black">Admin</h2>

          <ul className="mt-6 border-t border-baky-muted/40">
            {options.map((o) => (
              <li key={o.title}>
                <button className="flex w-full items-center justify-between gap-4 py-6 text-left">
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

        {/* Empty right column (matches Figma) */}
        <section className="hidden lg:block" />
      </div>
    </div>
  );
}
