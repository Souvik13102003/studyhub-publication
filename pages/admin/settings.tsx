// pages/admin/settings.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "@/components/Header"; // optional header for admin pages

export default function AdminSettings() {
    const [loading, setLoading] = useState(true);
    const [homeTitle, setHomeTitle] = useState("");
    const [homeDescription, setHomeDescription] = useState("");
    const router = useRouter();

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
        if (!token) {
            router.push("/admin/login");
            return;
        }
        fetch("/api/admin/settings", { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((data) => {
                setHomeTitle(data.homeTitle || "");
                setHomeDescription(data.homeDescription || "");
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [router]);

    async function save(e: React.FormEvent) {
        e.preventDefault();
        const token = localStorage.getItem("admin_token");
        const res = await fetch("/api/admin/settings", {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ homeTitle, homeDescription })
        });
        if (res.ok) alert("Saved");
        else alert("Save failed");
    }

    if (loading) return <div style={{ padding: 20 }}>Loading…</div>;

    return (
        <div style={{ maxWidth: 900, margin: "24px auto", padding: 12 }}>
            <h1>Site Settings</h1>
            <form onSubmit={save} style={{ display: "grid", gap: 12 }}>
                <label>
                    Home Title
                    <input value={homeTitle} onChange={(e) => setHomeTitle(e.target.value)} style={{ width: "100%", padding: 8 }} />
                </label>
                <label>
                    Home Description
                    <textarea value={homeDescription} onChange={(e) => setHomeDescription(e.target.value)} style={{ width: "100%", padding: 8, height: 120 }} />
                </label>
                <button type="submit" style={{ padding: "8px 12px" }}>Save</button>
            </form>
        </div>
    );
}
