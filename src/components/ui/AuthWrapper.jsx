export default function AuthWrapper({ title, children }) {
  return (
    <div className="min-h-screen grid md:grid-cols-2 bg-[var(--bg)]">

      {/* Left Visual */}
      <div className="hidden md:flex relative items-center justify-center bg-gradient-to-br from-[var(--primary)] to-[var(--primary-soft)] text-white p-16">

        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_20%,white,transparent_60%)]" />

        <div className="relative max-w-md">
          <h1 className="text-4xl font-bold mb-6 tracking-tight">
            RenovationPro
          </h1>

          <p className="text-lg opacity-90 leading-relaxed">
            Organize your renovation projects, manage budgets,
            track materials, and monitor progress — all in one
            powerful workspace.
          </p>
        </div>
      </div>

      {/* Form Section */}
      <div className="flex items-center justify-center p-10">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            {title}
          </h2>

          <div className="premium-card animate-fadeIn">
            {children}
          </div>
        </div>
      </div>

    </div>
  )
}