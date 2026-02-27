import { useEffect, useState } from "react";
import API from "@/api/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";

export default function PhotoSection({ projectId }) {
  const [photos, setPhotos] = useState([]);
  const [url, setUrl] = useState("");

  const fetchPhotos = async () => {
    const res = await API.get(`/photos/${projectId}`);
    setPhotos(res.data.data);
  };

  useEffect(() => {
    fetchPhotos();
  }, [projectId]);

  const addPhoto = async () => {
    if (!url) return;

    await API.post("/photos", {
      project_id: projectId,
      image_url: url,
    });

    setUrl("");
    fetchPhotos();
  };

  const deletePhoto = async (id) => {
    await API.delete(`/photos/${id}`);
    fetchPhotos();
  };

  return (
    <Card>
      <CardContent className="p-6 space-y-4">
        <h3 className="text-xl font-bold">Progress Photos</h3>

        <div className="flex gap-2">
          <Input
            placeholder="Image URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <Button onClick={addPhoto}>Add</Button>
        </div>

        {photos.length === 0 && (
          <p className="text-gray-500">No photos uploaded.</p>
        )}

        <div className="grid grid-cols-3 gap-4">
          {photos.map((photo) => (
            <div key={photo.id} className="relative">
              <img
                src={photo.image_url}
                alt="progress"
                className="rounded-md w-full h-40 object-cover"
              />
              <Trash2
                className="absolute top-2 right-2 h-4 w-4 text-red-500 cursor-pointer bg-white rounded-full p-1"
                onClick={() => deletePhoto(photo.id)}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}