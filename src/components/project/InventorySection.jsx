import { useEffect, useState } from "react";
import api from "../../api/api";

export default function InventorySection() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    const res = await api.get("/inventory");
    setItems(res.data.data);
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="premium-card">
          {item.name} - {item.quantity} {item.unit}
        </div>
      ))}
    </div>
  );
}