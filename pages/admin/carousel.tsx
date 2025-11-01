// pages/admin/carousel.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Item = { _id?: string; title?: string; imageUrl: string; link?: string; order?: number; active?: boolean };

export default function AdminCarousel() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Item>({ imageUrl: "", title: "", link: "", order: 0, active: true });
  const router = useRouter();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetch("/api/admin/carousel", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((data) => setItems(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  function resetForm() {
    setForm({ imageUrl: "", title: "", link: "", order: 0, active: true });
  }

  async function addItem(e: React.FormEvent) {
    e.preventDefault();
    const token = localStorage.getItem("admin_token");
    const res = await fetch("/api/admin/carousel", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
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
    const res = await fetch(`/api/admin/carousel/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    if (res.status === 204) setItems((p) => p.filter((x) => x._id !== id));
    else alert("Delete failed");
  }

  async function toggleActive(item: Item) {
    if (!item._id) return;
    const token = localStorage.getItem("admin_token");
    const res = await fetch(`/api/admin/carousel/${item._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...item, active: !item.active })
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

      <form onSubmit={addItem} style={{ display: "grid", gap: 8, marginBottom: 20 }}>
        <input placeholder="Image URL" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} required />
        <input placeholder="Title (optional)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
        <input placeholder="Link (optional)" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} />
        <div>
          <label>
            Order
            <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} style={{ width: 80, marginLeft: 8 }} />
          </label>
          <label style={{ marginLeft: 12 }}>
            Active
            <input type="checkbox" checked={!!form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} style={{ marginLeft: 6 }} />
          </label>
        </div>
        <div>
          <button type="submit" style={{ padding: "6px 10px" }}>Add</button>
          <button type="button" onClick={resetForm} style={{ marginLeft: 8 }}>Reset</button>
        </div>
      </form>

      <div>
        {items.length === 0 && <div>No items</div>}
        {items.map((it) => (
          <div key={it._id} style={{ display: "flex", gap: 12, alignItems: "center", padding: 8, border: "1px solid #eee", marginBottom: 8 }}>
            <img src={it.imageUrl} alt={it.title} style={{ width: 120, height: 70, objectFit: "cover" }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600 }}>{it.title || "No title"}</div>
              <div style={{ color: "#666" }}>{it.link}</div>
              <div style={{ fontSize: 13, color: "#444" }}>Order: {it.order}</div>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => toggleActive(it)} style={{ padding: "6px 10px" }}>{it.active ? "Disable" : "Enable"}</button>
              <button onClick={() => remove(it._id)} style={{ padding: "6px 10px" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
