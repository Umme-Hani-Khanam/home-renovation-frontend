import { useCallback, useEffect, useState } from "react";
import api from "@/api/api";

export default function useReminderCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchReminderCount = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/tasks/reminders/upcoming");
      const data = Array.isArray(res.data?.data) ? res.data.data : [];
      setCount(data.length);
    } catch {
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReminderCount();
    const timer = setInterval(fetchReminderCount, 60000);
    return () => clearInterval(timer);
  }, [fetchReminderCount]);

  return { count, loading, refreshReminderCount: fetchReminderCount };
}
