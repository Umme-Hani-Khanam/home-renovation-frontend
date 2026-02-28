import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-[var(--surface)] w-full max-w-lg rounded-2xl p-6 shadow-xl animate-fadeIn">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}