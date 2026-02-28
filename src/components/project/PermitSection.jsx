import { useEffect, useState } from "react";
import api from "../../api/api";

export default function PermitSection({ projectId }) {
  const [permits, setPermits] = useState([]);

  useEffect(() => {
    fetchPermits();
  }, []);

  const fetchPermits = async () => {
    const res = await api.get(`/permits/${projectId}`);
    setPermits(res.data.data);
  };

  return (
    <div className="space-y-4">
      {permits.map((p) => (
        <div key={p.id} className="premium-card">
          <h3>{p.permit_name}</h3>
          <p>Status: {p.status}</p>
        </div>
      ))}
    </div>
  );
}