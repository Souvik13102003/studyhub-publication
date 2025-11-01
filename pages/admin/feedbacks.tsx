// pages/admin/feedbacks.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Feedback = {
  _id?: string;
  name?: string;
  phone?: string;
  email?: string;
  bookName?: string;
  message?: string;
  read?: boolean;
  createdAt?: string;
};

export default function AdminFeedbacks() {
  const [items, setItems] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // ensure this runs only in browser
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("admin_token");
    if (!token) {
      // if no token, redirect to login
      router.push("/admin/login");
      return;
    }
    fetchList(token);
    // if you want polling, uncomment below
    // const iv = setInterval(() => fetchList(localStorage.getItem("admin_token") || ""), 60000);
    // return () => clearInterval(iv);
  }, [router]);

  async function fetchList(token?: string) {
    setLoading(true);
    setApiError(null);
    try {
      const t = token || (typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "");
      const headers: Record<string, string> = {};
      if (t) headers["Authorization"] = `Bearer ${t}`;

      const res = await fetch("/api/admin/feedbacks", { headers });

      if (!res.ok) {
        let msg = `Server returned ${res.status}`;
        try {
          const body = await res.json();
          if (body?.error) msg += ` — ${body.error}`;
        } catch (e) {
          // ignore JSON parse error
        }
        setApiError(msg);
        setItems([]);
        return;
      }

      const data = await res.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (e: any) {
      console.error("fetchList error", e);
      setApiError("Network error: " + (e?.message || String(e)));
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function markRead(id?: string, read = true) {
    if (!id) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
    try {
      const res = await fetch(`/api/admin/feedbacks?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ read })
      });
      if (res.ok) {
        setItems((p) => p.map((it) => (it._id === id ? { ...it, read } : it)));
      } else {
        // refetch or surface error
        fetchList(token);
      }
    } catch (e) {
      console.error("markRead error", e);
    }
  }

  async function remove(id?: string) {
    if (!id) return;
    if (!confirm("Delete this feedback?")) return;
    const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
    try {
      const res = await fetch(`/api/admin/feedbacks?id=${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      if (res.status === 204) setItems((p) => p.filter((it) => it._id !== id));
      else fetchList(token);
    } catch (e) {
      console.error("remove error", e);
    }
  }

  function exportCSV() {
    if (!items || items.length === 0) {
      alert("No feedback to export");
      return;
    }
    const header = ["Name", "Phone", "Email", "Book Name", "Message", "Read", "Created At"];
    const rows = items.map((it) => [
      it.name || "",
      it.phone || "",
      it.email || "",
      it.bookName || "",
      (it.message || "").replace(/\r?\n/g, " "),
      it.read ? "Yes" : "No",
      it.createdAt || ""
    ]);
    const csv = [header, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `feedbacks_${new Date().toISOString().slice(0, 19)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div style={{ maxWidth: 1100, margin: "24px auto", padding: 12 }}>
      <h1>Feedbacks</h1>

      {apiError && (
        <div style={{ background: "#ffecec", color: "#a61616", padding: 10, borderRadius: 6, marginBottom: 12 }}>
          <strong>Error:</strong> {apiError}
          <div style={{ marginTop: 6 }}>
            <small>If you recently changed server/admin secret, please re-login at /admin/login.</small>
          </div>
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <button onClick={() => exportCSV()} style={{ marginRight: 8 }}>
          Export CSV
        </button>
        <button
          onClick={() => {
            if (!confirm("Delete all feedbacks?")) return;
            const t = typeof window !== "undefined" ? localStorage.getItem("admin_token") || "" : "";
            fetch("/api/admin/feedbacks", { method: "DELETE", headers: { Authorization: `Bearer ${t}` } }).then(() => fetchList(t));
          }}
        >
          Delete All
        </button>
      </div>

      {loading ? (
        <div>Loading…</div>
      ) : (
        <div>
          {items.length === 0 && <div>No feedbacks yet.</div>}
          {items.map((it) => (
            <div key={it._id} style={{ border: "1px solid #eee", padding: 12, marginBottom: 8, background: it.read ? "#fafafa" : "#fff8e6" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <div>
                  <strong>{it.name || "Anonymous"}</strong> <span style={{ color: "#666" }}>{it.email}</span>
                  <div style={{ color: "#333", marginTop: 8 }}>{it.message}</div>
                  <div style={{ color: "#666", marginTop: 6 }}>
                    <small>
                      Phone: {it.phone || "—"} | Book: {it.bookName || "—"}
                    </small>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                  {!it.read ? (
                    <button onClick={() => markRead(it._id, true)}>Mark read</button>
                  ) : (
                    <button onClick={() => markRead(it._id, false)}>Mark unread</button>
                  )}
                  <button onClick={() => remove(it._id)}>Delete</button>
                  <div style={{ color: "#999", fontSize: 12 }}>{it.createdAt ? new Date(it.createdAt).toLocaleString() : ""}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
