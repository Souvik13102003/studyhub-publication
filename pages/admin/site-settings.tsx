// pages/admin/site-settings.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AdminSiteSettings() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // require admin token (simple check) otherwise redirect to login
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("admin_token");
    if (!token) {
      router.push("/admin/login");
      return;
    }
    fetchSettings();
  }, [router]);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/settings");
      if (!res.ok) {
        setMsg("Failed to load settings");
        return;
      }
      const data = await res.json();
      setTitle(data.title || "");
      setDescription(data.description || "");
    } catch (e) {
      console.error(e);
      setMsg("Network error while loading");
    }
  }

  async function save() {
    setMsg(null);
    setLoading(true);
    try {
      const token = localStorage.getItem("admin_token") || "";
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ title, description })
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        setMsg("Save failed: " + (b?.error || res.statusText));
      } else {
        setMsg("Saved successfully.");
      }
    } catch (e) {
      console.error(e);
      setMsg("Network error while saving.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
      <h1>Site Settings — Home</h1>
      {msg && <div style={{ marginBottom: 12, padding: 8, background: "#f0f8ff" }}>{msg}</div>}
      <div style={{ display: "grid", gap: 12 }}>
        <label>
          Title (shown as big heading on Home)
          <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ width: "100%" }} />
        </label>
        <label>
          Description (shown under title)
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={6} style={{ width: "100%" }} />
        </label>

        <div>
          <button onClick={save} disabled={loading}>{loading ? "Saving…" : "Save"}</button>
        </div>
      </div>
    </div>
  );
}
