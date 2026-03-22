export function normalizeBase64Payload(value) {
  return String(value || "")
    .trim()
    .replace(/^data:image\/[a-zA-Z0-9.+-]+;base64,/, "");
}

export function normalizeImageUrl(value, apiBaseUrl) {
  const raw = String(value || "").trim();

  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;

  const base = String(apiBaseUrl || "").replace(/\/+$/, "");
  if (!base) return raw;

  if (raw.startsWith("/")) {
    return `${base}${raw}`;
  }

  return `${base}/${raw}`;
}

export function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });
}
