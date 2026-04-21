// Client-side image utilities: resize + base64 encode.

const MAX_EDGE = 1600;
const QUALITY = 0.82;

export async function resizeAndEncode(
  file: File,
): Promise<{ blob: Blob; base64: string; filename: string; mime: string }> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('No 2D context');
  ctx.drawImage(bitmap, 0, 0, w, h);

  const mime = 'image/jpeg';
  const blob: Blob = await new Promise((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('toBlob failed'))), mime, QUALITY),
  );

  const base64 = await blobToBase64(blob);
  const cleanName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-|-$/g, '');
  const filename = `${cleanName || 'image'}.jpg`;

  return { blob, base64, filename, mime };
}

export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const s = r.result as string;
      resolve(s.split(',')[1]);
    };
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });
}

export function blobToObjectURL(blob: Blob): string {
  return URL.createObjectURL(blob);
}

export function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
