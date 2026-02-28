import { useEffect, useState } from "react";
import api from "../../api/api";

export default function ReminderSection() {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    fetchReminders();
  }, []);

  const fetchReminders = async () => {
    const res = await api.get("/reminders");
    setReminders(res.data.data);
  };

  return (
    <div className="space-y-4">
      {reminders.map((r) => (
        <div key={r.id} className="premium-card">
          <h3>{r.title}</h3>
          <p>{r.reminder_date}</p>
        </div>
      ))}
    </div>
  );
}