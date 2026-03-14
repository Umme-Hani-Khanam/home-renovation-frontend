import { useCallback, useEffect, useMemo, useState } from "react";
import { Camera, ImageOff, LoaderCircle, UploadCloud } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";

import api from "@/api/api";

import { useProject } from "@/context/ProjectContext";
import useProjectData from "@/hooks/useProjectData";
import ProjectSelector from "@/components/project/ProjectSelector";
import {
  applyImageFallback,
  createOptimisticPhotos,
  normalizeBase64Payload,
  normalizeImageUrl,
  revokeOptimisticPhotos,
  toBase64,
} from "@/lib/photos";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

function MissingImageCard() {
  return (
    <Card className="app-card mb-4 break-inside-avoid rounded-3xl">
      <CardContent className="flex h-56 items-center justify-center text-sm text-muted-foreground">
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
  if (stage === "Before") return "status-badge status-progress";
  if (stage === "After") return "status-badge status-success";
  return "status-badge status-pending";
}

export default function Photos() {
  const reduceMotion = useReducedMotion();
  const { selectedProject } = useProject();

  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({ current: 0, total: 0 });
  const [pendingPhotos, setPendingPhotos] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");
  const [previewPhoto, setPreviewPhoto] = useState(null);

  useEffect(() => () => revokeOptimisticPhotos(pendingPhotos), [pendingPhotos]);

  const fetchPhotos = useCallback(async (projectId) => {
    const res = await api.get(`/photos/${projectId}`);
    return Array.isArray(res.data?.data) ? res.data.data : [];
  }, []);

  const {
    data: photos,
    loading,
    error,
    setError,
    refetch,
  } = useProjectData({
    projectId: selectedProject?.id,
    fetcher: fetchPhotos,
  });

  const orderedPhotos = useMemo(() => {
    const safePhotos = Array.isArray(photos) ? photos : [];
    return [...safePhotos].sort((a, b) => {
      const left = new Date(a?.created_at || 0).getTime();
      const right = new Date(b?.created_at || 0).getTime();
      return left - right;
    });
  }, [photos]);

  const displayPhotos = useMemo(
    () => [...pendingPhotos, ...orderedPhotos],
    [orderedPhotos, pendingPhotos]
  );

  const handleUpload = async (event) => {
    if (!selectedProject?.id) return;

    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    const optimisticPhotos = createOptimisticPhotos(files);
    let uploadedCount = 0;
    let failedCount = 0;
    let lastErrorMessage = "";

    try {
      setUploading(true);
      setUploadMessage("");
      setError("");
      setUploadStatus({ current: 0, total: files.length });
      setPendingPhotos(optimisticPhotos);

      for (const [index, file] of files.entries()) {
        try {
          const dataUrl = await toBase64(file);
          const image_base64 = normalizeBase64Payload(dataUrl);

          await api.post("/photos", {
            project_id: selectedProject.id,
            image_base64,
            file_name: file.name,
          });

          uploadedCount += 1;
        } catch (err) {
          failedCount += 1;
          lastErrorMessage =
            err.response?.data?.message || "One or more photos failed to upload.";
        } finally {
          setUploadStatus({ current: index + 1, total: files.length });
        }
      }

      await refetch();

      if (uploadedCount > 0 && failedCount === 0) {
        setUploadMessage(
          `${uploadedCount} photo${uploadedCount > 1 ? "s" : ""} uploaded successfully.`
        );
      }

      if (failedCount > 0) {
        setError(
          uploadedCount > 0
            ? `${uploadedCount} uploaded, ${failedCount} failed. ${lastErrorMessage}`
            : lastErrorMessage
        );
      }
    } catch (err) {
      setError(err.response?.data?.message || "Photo upload failed");
    } finally {
      revokeOptimisticPhotos(optimisticPhotos);
      setPendingPhotos([]);
      setUploading(false);
      setUploadStatus({ current: 0, total: 0 });
      event.target.value = "";
    }
  };

  return (
    <motion.div
      className="space-y-8"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight">Project Photos</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Upload and review project progress photos.
        </p>
      </div>

      <ProjectSelector required />

      {selectedProject && (
        <label className="block cursor-pointer rounded-[28px] border border-emerald-200/70 bg-white/70 p-6 text-center shadow-lg shadow-emerald-950/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-emerald-300 hover:shadow-2xl">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-900">
            {uploading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <UploadCloud className="h-4 w-4" />
            )}
            {uploading ? "Uploading photos..." : "Click to upload one or more images"}
          </span>
          <p className="mt-2 text-xs text-emerald-800/75">
            Images appear immediately while the final public URL is being saved.
          </p>
          {uploading && uploadStatus.total > 0 && (
            <div className="mx-auto mt-4 max-w-md">
              <div className="mb-2 flex items-center justify-between text-xs text-emerald-900">
                <span>Upload progress</span>
                <span>
                  {uploadStatus.current}/{uploadStatus.total}
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-emerald-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                  style={{ width: `${(uploadStatus.current / uploadStatus.total) * 100}%` }}
                />
              </div>
            </div>
          )}
          <input type="file" multiple accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      )}

      {(loading || uploading) && (
        <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div
              key={item}
              className="mb-4 h-56 animate-pulse break-inside-avoid rounded-3xl border bg-slate-100"
            />
          ))}
        </div>
      )}
      {!!error && <p className="text-red-600">{error}</p>}
      {!!uploadMessage && !uploading && <p className="text-sm text-emerald-700">{uploadMessage}</p>}

      {selectedProject && !loading && !uploading && displayPhotos.length === 0 && (
        <Card className="app-card rounded-3xl">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
            <Camera className="h-8 w-8 text-slate-400" />
            <p>No photos uploaded yet.</p>
          </CardContent>
        </Card>
      )}

      <div className="columns-1 gap-4 sm:columns-2 xl:columns-3">
        {displayPhotos.map((photo, index) => {
          const imageUrl = normalizeImageUrl(photo?.image_url, import.meta.env.VITE_API_URL);
          const stage = photoStage(index, displayPhotos.length);

          if (!imageUrl) {
            return <MissingImageCard key={photo?.id || `missing-${index}`} />;
          }

          return (
            <Card
              key={photo.id || `photo-${index}`}
              className="app-card group mb-4 cursor-pointer break-inside-avoid overflow-hidden rounded-3xl"
              onClick={() =>
                setPreviewPhoto({ url: imageUrl, stage, created_at: photo?.created_at })
              }
            >
              <CardContent className="relative p-0">
                <img
                  src={imageUrl}
                  alt="Project progress"
                  className="h-auto w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.035]"
                  onError={applyImageFallback}
                />
                <div className="absolute inset-0 bg-black/0 transition group-hover:bg-black/15" />
                <div className="absolute left-2 top-2 flex flex-col gap-1">
                  <Badge className={photoStageClass(stage)}>{stage}</Badge>
                  {photo?.pending && (
                    <Badge className="status-badge border-emerald-300 bg-emerald-50 text-emerald-700">
                      Uploading
                    </Badge>
                  )}
                  <Badge className="status-badge border-slate-300 bg-slate-50 text-slate-700 dark:border-slate-600 dark:bg-slate-800/70 dark:text-slate-200">
                    {formatDate(photo?.created_at)}
                  </Badge>
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
              {previewPhoto?.stage || "Photo"} - {formatDate(previewPhoto?.created_at)}
            </DialogTitle>
          </DialogHeader>
          {previewPhoto?.url && (
            <img
              src={previewPhoto.url}
              alt="Preview"
              className="max-h-[78vh] w-full rounded-xl object-contain"
              onError={applyImageFallback}
            />
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
