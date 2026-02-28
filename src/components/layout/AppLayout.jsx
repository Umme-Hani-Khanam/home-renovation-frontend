import Sidebar from "./Sidebar";

export default function AppLayout({ title, children }) {
  return (
    <div className="flex-1 p-14">
      <Sidebar />

      <main className="flex-1 p-10">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold">
              {title}
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Manage and monitor your renovation workspace
            </p>
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}