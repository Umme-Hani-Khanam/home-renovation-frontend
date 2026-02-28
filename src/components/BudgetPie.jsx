export default function BudgetPie({ spent, total }) {
  const percentage = total > 0 ? (spent / total) * 100 : 0

  return (
    <div className="flex flex-col items-center space-y-4">

      <div
        className="w-40 h-40 rounded-full relative"
        style={{
          background: `conic-gradient(#059669 ${percentage}%, #e5e7eb 0%)`
        }}
      >
        <div className="absolute inset-5 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center text-xl font-bold">
          {percentage.toFixed(0)}%
        </div>
      </div>

      <div className="text-sm text-muted-foreground">
        ₹{spent} of ₹{total}
      </div>

    </div>
  )
}