import { useEffect, useState } from "react";
import api from "../../api/api";

export default function ShoppingSection({ projectId }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const res = await api.get(`/shopping/${projectId}`);
    setItems(res.data.data);
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="premium-card flex justify-between">
          <span>{item.item_name}</span>
          <span>
            {item.purchased ? "Purchased" : "Pending"}
          </span>
        </div>
      ))}
    </div>
  );
}