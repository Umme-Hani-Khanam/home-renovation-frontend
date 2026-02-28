import { useEffect, useState } from "react";
import api from "../../api/api";

export default function PhotoSection({ projectId }) {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const res = await api.get(`/photos/${projectId}`);
    setPhotos(res.data.data);
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {photos.map((photo) => (
        <img
          key={photo.id}
          src={photo.image_url}
          alt="Project"
          className="rounded-xl border border-[var(--border)]"
        />
      ))}
    </div>
  );
}