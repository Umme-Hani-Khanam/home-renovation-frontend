export const PLACEHOLDER_PHOTO_SRC = "/placeholder-photo.svg";

export function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function normalizeBase64Payload(value) {
  if (!value) return "";
  const raw = String(value).trim();

  if (raw.startsWith("data:image/")) {
    return raw;
  }

  return `data:image/png;base64,${raw}`;
}

export function normalizeImageUrl(imageUrl, apiBaseUrl) {
  if (!imageUrl) return "";

  const url = String(imageUrl).trim();
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:image/")) {
    return url;
  }

  if (url.startsWith("/")) {
    const base = String(apiBaseUrl || "").replace(/\/api\/?$/, "").replace(/\/$/, "");
    return `${base}${url}`;
  }

  return url;
}

export function createOptimisticPhotos(files) {
  return files.map((file, index) => ({
    id: `pending-${Date.now()}-${index}`,
    image_url: URL.createObjectURL(file),
    created_at: new Date().toISOString(),
    pending: true,
    file_name: file.name,
  }));
}

export function revokeOptimisticPhotos(photos) {
  for (const photo of photos || []) {
    if (photo?.pending && photo.image_url?.startsWith("blob:")) {
      URL.revokeObjectURL(photo.image_url);
    }
  }
}

export function applyImageFallback(event) {
  const img = event.currentTarget;
  if (img.dataset.fallbackApplied === "true") return;
  img.dataset.fallbackApplied = "true";
  img.src = PLACEHOLDER_PHOTO_SRC;
}
