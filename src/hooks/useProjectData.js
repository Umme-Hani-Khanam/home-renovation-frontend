import { useCallback, useEffect, useState } from "react";

export default function useProjectData({ projectId, fetcher, enabled = true }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    if (!enabled || !projectId) {
      setData([]);
      setError("");
      return [];
    }

    try {
      setLoading(true);
      setError("");

      const result = await fetcher(projectId);
      const safe = Array.isArray(result) ? result : [];
      setData(safe);
      return safe;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch data");
      setData([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, [enabled, fetcher, projectId]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    data,
    setData,
    loading,
    error,
    setError,
    refetch,
  };
}
