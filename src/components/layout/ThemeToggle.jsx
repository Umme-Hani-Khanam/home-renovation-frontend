export default function TopBar({ title }) {
  return (
    <div className="flex justify-between items-center mb-8">
      <h2 className="text-3xl font-semibold text-slate-800">
        {title}
      </h2>
    </div>
  );
}