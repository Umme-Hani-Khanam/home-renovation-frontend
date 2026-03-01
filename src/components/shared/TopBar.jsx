export default function TopBar({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">

      <div>
        <h2 className="text-3xl font-bold tracking-tight">
          {title}
        </h2>

        {subtitle && (
          <p className="text-sm text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}

    </div>
  )
}