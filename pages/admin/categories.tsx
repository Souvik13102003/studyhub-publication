// pages/admin/categories.tsx
import { useEffect, useState } from "react";
import { useRef } from "react";
import { useRouter } from "next/router";
import { uploadImageFile } from "@/lib/uploadImage";

type Cat = { _id?: string; name: string; thumbnail?: string };

export default function AdminCategories() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [editing, setEditing] = useState<Cat | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("admin_token")
        : null;
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetch("/api/admin/categories", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setCats)
      .catch(() => setCats([]));
  }, [router]);

  async function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;

    // Local preview while uploading
    const preview = URL.createObjectURL(f);
    setThumbnail(preview);

    try {
      setUploading(true);
      const url = await uploadImageFile(f); // <--- Cloudinary upload here
      setThumbnail(url); // <--- Save Cloudinary URL in state
    } catch (err: any) {
      alert("Thumbnail upload failed: " + (err?.message || err));
    } finally {
      setUploading(false);
    }
  }

  async function createOrUpdate(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("admin_token");
    if (!token) return router.push("/admin/login");
    if (editing) {
      // update
      const res = await fetch(`/api/admin/categories/${editing._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, thumbnail }),
      });
      if (res.ok) {
        const updated = await res.json();
        setCats((p) => p.map((c) => (c._id === updated._id ? updated : c)));
        setEditing(null);
        setName("");
        setThumbnail("");
        if (fileInputRef.current) fileInputRef.current.value = ""; // ✅ Clear file input
      } else {
        alert("Update failed");
      }
    } else {
      // create
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, thumbnail }),
      });
      if (res.ok) {
        const c = await res.json();
        setCats((p) => [...p, c]);
        setName("");
        setThumbnail("");
        if (fileInputRef.current) fileInputRef.current.value = ""; // ✅ Clear file input
      } else {
        const err = await res.json();
        alert(err?.error || "Create failed");
      }
    }
  }

  async function editItem(c: Cat) {
    setEditing(c);
    setName(c.name);
    setThumbnail(c.thumbnail || "");
  }

  async function remove(id?: string) {
    if (!id) return;
    if (!confirm("Delete category?")) return;
    const token = localStorage.getItem("admin_token");
    const res = await fetch(`/api/admin/categories/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 204) setCats((p) => p.filter((x) => x._id !== id));
    else alert("Delete failed");
  }

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 12 }}>
      <h1>Manage Categories</h1>
      <form onSubmit={createOrUpdate} style={{ display: "grid", gap: 8 }}>
        <input
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <label>
          Thumbnail
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              ref={fileInputRef}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {thumbnail ? (
                <img
                  src={thumbnail}
                  alt="thumbnail"
                  style={{ width: 80, height: 60, objectFit: "cover" }}
                />
              ) : (
                <div style={{ width: 80, height: 60, background: "#f3f3f3" }} />
              )}
              {uploading && (
                <small style={{ marginTop: 4 }}>Uploading...</small>
              )}
            </div>
          </div>
        </label>

        <div>
          <button type="submit">{editing ? "Update" : "Add"}</button>
          {editing && (
            <button
              type="button"
              onClick={() => {
                setEditing(null);
                setName("");
                setThumbnail("");
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div style={{ marginTop: 20 }}>
        {cats.map((c) => (
          <div
            key={c._id}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              border: "1px solid #eee",
              padding: 12,
              marginBottom: 8,
            }}
          >
            <img
              src={c.thumbnail || "/samples/category-placeholder.png"}
              alt={c.name}
              style={{ width: 80, height: 60, objectFit: "cover" }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{c.name}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => editItem(c)}>Edit</button>
              <button onClick={() => remove(c._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
