export default function AuthWrapper({ title, children }) {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[var(--bg)]">
      {/* Left Visual Section */}
      <div className="hidden md:flex items-center justify-center bg-[var(--primary)] text-white p-16">
        <div className="max-w-md">
          <h1 className="text-4xl font-bold mb-6">
            RenovationPro
          </h1>
          <p className="text-lg opacity-90">
            Manage projects, budgets, contractors,
            materials, and progress in one powerful
            renovation workspace.
          </p>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="flex items-center justify-center p-10">
        <div className="w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-8">
            {title}
          </h2>

          {children}
        </div>
      </div>
    </div>
  );
}