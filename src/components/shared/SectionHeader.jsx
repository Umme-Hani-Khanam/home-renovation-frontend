export default function SectionHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-muted-foreground mt-2">
            {subtitle}
          </p>
        )}
      </div>

      {action && action}

    </div>
  )
}