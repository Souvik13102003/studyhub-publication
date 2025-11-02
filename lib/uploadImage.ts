// lib/uploadImage.ts
// Upload directly from browser to Cloudinary using unsigned preset.
// Requires NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET set.

export async function uploadImageFile(file: File) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const unsignedPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UNSIGNED_PRESET;

  if (!cloudName || !unsignedPreset) {
    throw new Error(
      "Cloudinary unsigned preset not configured (NEXT_PUBLIC_CLOUDINARY_* env vars)"
    );
  }

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", unsignedPreset);

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const res = await fetch(url, {
    method: "POST",
    body: form,
  });

  if (!res.ok) {
    // Cloudinary returns JSON with message on errors
    const body = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(body?.error?.message || body?.error || "Upload failed");
  }

  const data = await res.json();
  // data.secure_url is the https url
  return data.secure_url;
}
