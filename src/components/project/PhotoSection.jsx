import { useMemo, useState } from "react";
import { Camera, ImageOff, UploadCloud } from "lucide-react";

import api from "@/api/api";
import { useProject } from "@/context/ProjectContext";
import useProjectData from "@/hooks/useProjectData";
import { normalizeBase64Payload, normalizeImageUrl, toBase64 } from "@/lib/photos";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function MissingImageCard() {
  return (
    <Card className="mb-4 break-inside-avoid rounded-2xl border">
      <CardContent className="flex h-52 items-center justify-center text-sm text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <ImageOff className="h-4 w-4" />
          Image unavailable
        </span>
      </CardContent>
    </Card>
  );
}

function formatDate(value) {
  if (!value) return "Unknown date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

function photoStage(index, total) {
  if (total === 1) return "Progress";
  if (index === 0) return "Before";
  if (index === total - 1) return "After";
  return "Progress";
}

function photoStageClass(stage) {
  if (stage === "Before") return "border-blue-200 bg-blue-50 text-blue-700";
  if (stage === "After") return "border-emerald-200 bg-emerald-50 text-emerald-700";
  return "border-amber-200 bg-amber-50 text-amber-700";
}

export default function PhotoSection() {
  const { selectedProject } = useProject();
  const projectId = selectedProject?.id;

  const [uploading, setUploading] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const {
    data: photos,
    loading,
    error,
    setError,
    refetch,
  } = useProjectData({
    projectId,
    fetcher: async (id) => {
      const res = await api.get(`/photos/${id}`);
      return Array.isArray(res.data?.data) ? res.data.data : [];
    },
  });

  const orderedPhotos = useMemo(() => {
    const safePhotos = Array.isArray(photos) ? photos : [];
    return [...safePhotos].sort((a, b) => {
      const left = new Date(a?.created_at || 0).getTime();
      const right = new Date(b?.created_at || 0).getTime();
      return left - right;
    });
  }, [photos]);

  const uploadPhotos = async (event) => {
    const files = Array.from(event.target.files || []);
    if (!projectId || files.length === 0) return;

    try {
      setUploading(true);
      setError("");

      for (const file of files) {
        const dataUrl = await toBase64(file);
        const image_base64 = normalizeBase64Payload(dataUrl);

        await api.post("/photos", {
          project_id: projectId,
          image_base64,
          file_name: file.name,
        });
      }

      await refetch();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload photos");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  };

  if (!projectId) {
    return (
      <Card className="rounded-2xl border">
        <CardContent className="py-10 text-center text-muted-foreground">
          Select a project to manage photos.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="animate-fade-in space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Photo Timeline</h2>
        <p className="text-sm text-muted-foreground">Capture and review progress with before/after timeline context.</p>
      </div>

      <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-emerald-300 bg-emerald-50/50 p-6 text-center text-sm text-emerald-900 transition hover:border-emerald-400 hover:bg-emerald-50">
        <span className="inline-flex items-center gap-2 font-medium">
          <UploadCloud className="h-4 w-4" />
          {uploading ? "Uploading photos..." : "Click to upload project photos"}
        </span>
        <input type="file" multiple accept="image/*" className="hidden" onChange={uploadPhotos} />
      </label>

      {(loading || uploading) && (
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="mb-4 h-52 animate-pulse break-inside-avoid rounded-2xl border bg-slate-100" />
          ))}
        </div>
      )}
      {!!error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !uploading && orderedPhotos.length === 0 && (
        <Card className="rounded-2xl border">
          <CardContent className="flex flex-col items-center gap-3 py-8 text-center text-muted-foreground">
            <Camera className="h-8 w-8 text-slate-400" />
            <p>No project photos uploaded yet.</p>
            <p className="text-xs">Upload photos to build a before/after timeline.</p>
          </CardContent>
        </Card>
      )}

      <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
        {orderedPhotos.map((photo, index) => {
          const imageUrl = normalizeImageUrl(photo?.image_url, import.meta.env.VITE_API_URL);
          const stage = photoStage(index, orderedPhotos.length);

          if (!imageUrl) {
            return <MissingImageCard key={photo?.id || `missing-${index}`} />;
          }

          return (
            <Card
              key={photo.id || `photo-${index}`}
              className="group mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-2xl border shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
              onClick={() => setPreviewPhoto({ url: imageUrl, stage, created_at: photo?.created_at })}
            >
              <CardContent className="relative p-0">
                <img
                  src={imageUrl}
                  alt="Project"
                  className="h-auto w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/15" />
                <div className="absolute left-2 top-2 flex flex-col gap-1">
                  <Badge className={photoStageClass(stage)}>{stage}</Badge>
                  <Badge className="border-slate-200 bg-slate-50 text-slate-700">{formatDate(photo?.created_at)}</Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog open={Boolean(previewPhoto)} onOpenChange={(open) => !open && setPreviewPhoto(null)}>
        <DialogContent className="max-h-[90vh] max-w-4xl overflow-hidden rounded-2xl p-2">
          <DialogHeader className="px-3 pt-3">
            <DialogTitle>
              {previewPhoto?.stage || "Photo"} • {formatDate(previewPhoto?.created_at)}
            </DialogTitle>
          </DialogHeader>
          {previewPhoto?.url && (
            <img src={previewPhoto.url} alt="Preview" className="max-h-[78vh] w-full rounded-xl object-contain" />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
