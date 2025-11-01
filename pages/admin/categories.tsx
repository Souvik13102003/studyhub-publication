// pages/admin/categories.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Cat = { _id?: string; name: string; thumbnail?: string };

export default function AdminCategories() {
    const [cats, setCats] = useState<Cat[]>([]);
    const [name, setName] = useState("");
    const [thumbnail, setThumbnail] = useState("");
    const [editing, setEditing] = useState<Cat | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
        if (!token) {
            router.push("/admin/login");
            return;
        }
        fetch("/api/admin/categories", { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then(setCats)
            .catch(() => setCats([]));
    }, [router]);

    async function createOrUpdate(e: React.FormEvent) {
        e.preventDefault();
        const token = localStorage.getItem("admin_token");
        if (!token) return router.push("/admin/login");
        if (editing) {
            // update
            const res = await fetch(`/api/admin/categories/${editing._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name, thumbnail })
            });
            if (res.ok) {
                const updated = await res.json();
                setCats((p) => p.map((c) => (c._id === updated._id ? updated : c)));
                setEditing(null);
                setName("");
                setThumbnail("");
            } else {
                alert("Update failed");
            }
        } else {
            // create
            const res = await fetch("/api/admin/categories", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name, thumbnail })
            });
            if (res.ok) {
                const c = await res.json();
                setCats((p) => [...p, c]);
                setName("");
                setThumbnail("");
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
        const res = await fetch(`/api/admin/categories/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        if (res.status === 204) setCats((p) => p.filter((x) => x._id !== id));
        else alert("Delete failed");
    }

    return (
        <div style={{ maxWidth: 900, margin: "24px auto", padding: 12 }}>
            <h1>Manage Categories</h1>
            <form onSubmit={createOrUpdate} style={{ display: "grid", gap: 8 }}>
                <input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} required />
                <input placeholder="Thumbnail URL (or Cloudinary URL later)" value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} />
                <div>
                    <button type="submit">{editing ? "Update" : "Add"}</button>
                    {editing && <button type="button" onClick={() => { setEditing(null); setName(""); setThumbnail(""); }}>Cancel</button>}
                </div>
            </form>

            <div style={{ marginTop: 20 }}>
                {cats.map((c) => (
                    <div key={c._id} style={{ display: "flex", gap: 12, alignItems: "center", border: "1px solid #eee", padding: 12, marginBottom: 8 }}>
                        <img src={c.thumbnail || "/samples/category-placeholder.png"} alt={c.name} style={{ width: 80, height: 60, objectFit: "cover" }} />
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
