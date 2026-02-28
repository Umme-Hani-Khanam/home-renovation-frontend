import { useParams } from "react-router-dom";
import { useState } from "react";
import TaskSection from "../components/project/TaskSection";
import ExpenseSection from "../components/project/ExpenseSection";
import ShoppingSection from "../components/project/ShoppingSection";
import PhotoSection from "../components/project/PhotoSection";
import ContractorSection from "../components/project/ContractorSection";
import PermitSection from "../components/project/PermitSection";
import InventorySection from "../components/project/InventorySection";
import ReminderSection from "../components/project/ReminderSection";
import InspirationSection from "../components/project/InspirationSection";

const tabs = [
  "Tasks",
  "Expenses",
  "Shopping",
  "Photos",
  "Contractors",
  "Permits",
  "Inventory",
  "Reminders",
  "Inspiration"
];

export default function ProjectDetails() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("Tasks");

  return (
    <div className="space-y-8">
      <div className="flex gap-4 border-b border-[var(--border)] pb-3">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm ${
              activeTab === tab
                ? "bg-[var(--primary)] text-white"
                : "hover:bg-gray-100 dark:hover:bg-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Tasks" && <TaskSection projectId={id} />}
      {activeTab === "Expenses" && <ExpenseSection projectId={id} />}
      {activeTab === "Shopping" && <ShoppingSection projectId={id} />}
      {activeTab === "Photos" && <PhotoSection projectId={id} />}
      {activeTab === "Contractors" && <ContractorSection projectId={id} />}
      {activeTab === "Permits" && <PermitSection projectId={id} />}
      {activeTab === "Inventory" && <InventorySection />}
      {activeTab === "Reminders" && <ReminderSection />}
      {activeTab === "Inspiration" && <InspirationSection projectId={id} />}
    </div>
  );
}