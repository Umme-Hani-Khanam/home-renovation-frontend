import { useCallback, useMemo, useState } from "react";
import api from "@/api/api";

function sortByReminderDate(items) {
  return [...items].sort((a, b) => {
    const left = new Date(a?.reminder_at || 0).getTime();
    const right = new Date(b?.reminder_at || 0).getTime();
    return left - right;
  });
}

export default function useUpcomingReminders() {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUpcomingReminders = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/tasks/reminders/upcoming");
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      setReminders(sortByReminderDate(data));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch upcoming reminders");
      setReminders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const markReminderDone = useCallback(async (taskId) => {
    await api.patch(`/tasks/${taskId}/reminder-sent`);
  }, []);

  const upcoming = useMemo(() => Array.isArray(reminders) ? reminders : [], [reminders]);

  return {
    reminders: upcoming,
    loading,
    error,
    fetchUpcomingReminders,
    markReminderDone,
    setError,
  };
}
