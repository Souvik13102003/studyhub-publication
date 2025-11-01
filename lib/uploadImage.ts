// lib/uploadImage.ts
export async function uploadImageFile(file: File, token: string) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd
    });
    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "upload failed" }));
        throw new Error(err.error || "upload failed");
    }
    const data = await res.json();
    return data.url; // cloudinary secure_url
}
