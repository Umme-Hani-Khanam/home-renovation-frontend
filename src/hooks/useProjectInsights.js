import { useCallback, useState } from "react";
import api from "@/api/api";

export default function useProjectInsights(projectId) {
  const [progress, setProgress] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInsights = useCallback(async () => {
    if (!projectId) {
      setProgress(null);
      setAnalytics(null);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const [progressRes, analyticsRes] = await Promise.all([
        api.get(`/projects/${projectId}/progress-estimation`),
        api.get(`/projects/${projectId}/analytics`),
      ]);

      setProgress(progressRes.data?.data || null);
      setAnalytics(analyticsRes.data?.data || null);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load project insights");
      setProgress(null);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  return {
    progress,
    analytics,
    loading,
    error,
    fetchInsights,
    setError,
  };
}
