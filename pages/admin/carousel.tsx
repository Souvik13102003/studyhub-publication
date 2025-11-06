// pages/admin/carousel.tsx
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { uploadImageFile } from "@/lib/uploadImage";

type Item = {
  _id?: string;
  title?: string;
  imageUrl: string;
  order?: number;
  active?: boolean;
};

export default function AdminCarousel() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<Item>({
    imageUrl: "",
    title: "",
    order: 0,
    active: true,
  });
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
    fetch("/api/admin/carousel", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => setItems(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  function resetForm() {
    setForm({ imageUrl: "", title: "", order: 0, active: true });
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const preview = URL.createObjectURL(file);
    setForm((prev) => ({ ...prev, imageUrl: preview }));

    try {
      setUploading(true);
      const url = await uploadImageFile(file);
      setForm((prev) => ({ ...prev, imageUrl: url }));
    } catch (err: any) {
      alert("Image upload failed: " + (err?.message || err));
    } finally {
      setUploading(false);
    }
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("admin_token");
    const res = await fetch("/api/admin/carousel", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      const created = await res.json();
      setItems((p) => [created, ...p]);
      resetForm();
    } else {
      alert("Create failed");
    }
  }

  async function remove(id?: string) {
    if (!id) return;
    if (!confirm("Delete this item?")) return;
    const token = localStorage.getItem("admin_token");
    const res = await fetch(`/api/admin/carousel/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 204) setItems((p) => p.filter((x) => x._id !== id));
    else alert("Delete failed");
  }

  async function toggleActive(item: Item) {
    if (!item._id) return;
    const token = localStorage.getItem("admin_token");
    const res = await fetch(`/api/admin/carousel/${item._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ ...item, active: !item.active }),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems((p) => p.map((it) => (it._id === updated._id ? updated : it)));
    } else alert("Update failed");
  }

  if (loading) return <div style={{ padding: 20 }}>Loading…</div>;

  return (
    <div style={{ maxWidth: 1000, margin: "24px auto", padding: 12 }}>
      <h1>Manage Carousel</h1>

      <form
        onSubmit={addItem}
        style={{ display: "grid", gap: 8, marginBottom: 20 }}
      >
        <input
          placeholder="Title (optional)"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <label>
          Cover Image
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {form.imageUrl ? (
                <img
                  src={form.imageUrl}
                  alt="preview"
                  style={{
                    width: 120,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 4,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 120,
                    height: 80,
                    background: "#f3f3f3",
                    borderRadius: 4,
                  }}
                />
              )}
              {uploading && (
                <small style={{ marginTop: 4 }}>Uploading...</small>
              )}
            </div>
          </div>
        </label>
        <div>
          <label>
            Order
            <input
              type="number"
              value={form.order}
              onChange={(e) =>
                setForm({ ...form, order: Number(e.target.value) })
              }
              style={{ width: 80, marginLeft: 8 }}
            />
          </label>
          <label style={{ marginLeft: 12 }}>
            Active
            <input
              type="checkbox"
              checked={!!form.active}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              style={{ marginLeft: 6 }}
            />
          </label>
        </div>
        <div>
          <button type="submit" style={{ padding: "6px 10px" }}>
            Add
          </button>
          <button type="button" onClick={resetForm} style={{ marginLeft: 8 }}>
            Reset
          </button>
        </div>
      </form>

      <div>
        {items.length === 0 && <div>No items</div>}
        {items.map((it) => (
          <div
            key={it._id}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              padding: 8,
              border: "1px solid #eee",
              marginBottom: 8,
            }}
          >
            <img
              src={it.imageUrl}
              alt={it.title}
              style={{ width: 120, height: 70, objectFit: "cover" }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{it.title || "No title"}</div>
              <div style={{ fontSize: 13, color: "#444" }}>
                Order: {it.order}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button
                onClick={() => toggleActive(it)}
                style={{ padding: "6px 10px" }}
              >
                {it.active ? "Disable" : "Enable"}
              </button>
              <button
                onClick={() => remove(it._id)}
                style={{ padding: "6px 10px" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
