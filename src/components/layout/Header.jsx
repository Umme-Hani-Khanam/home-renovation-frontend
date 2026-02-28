import { useContext } from "react";
import ThemeContext from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function Header({ title }) {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <header className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Renovation workspace overview
        </p>
      </div>

      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] hover:shadow-md transition"
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </header>
  );
}