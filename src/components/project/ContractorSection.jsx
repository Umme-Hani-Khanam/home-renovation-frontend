import { useEffect, useState } from "react";
import api from "../../api/api";

export default function ContractorSection({ projectId }) {
  const [contractors, setContractors] = useState([]);

  useEffect(() => {
    fetchContractors();
  }, []);

  const fetchContractors = async () => {
    const res = await api.get(`/contractors?project_id=${projectId}`);
    setContractors(res.data.data);
  };

  return (
    <div className="space-y-4">
      {contractors.map((c) => (
        <div key={c.id} className="premium-card">
          <h3 className="font-semibold">{c.name}</h3>
          <p>{c.phone}</p>
        </div>
      ))}
    </div>
  );
}