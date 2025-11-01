// pages/admin/dashboard.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function AdminDashboard() {
    const [loading, setLoading] = useState(true);
    const [ok, setOk] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const token = typeof window !== "undefined" ? localStorage.getItem("admin_token") : null;
        if (!token) {
            router.push("/admin/login");
            return;
        }
        fetch("/api/admin/verify", { headers: { Authorization: `Bearer ${token}` } })
            .then((r) => r.json())
            .then((data) => {
                if (data?.valid) setOk(true);
                else {
                    localStorage.removeItem("admin_token");
                    router.push("/admin/login");
                }
            })
            .catch(() => {
                localStorage.removeItem("admin_token");
                router.push("/admin/login");
            })
            .finally(() => setLoading(false));
    }, [router]);

    if (loading) return <div style={{ padding: 20 }}>Checking admin session…</div>;
    if (!ok) return null;

    return (
        <div style={{ maxWidth: 1100, margin: "24px auto", padding: 12 }}>
            <h1>Admin Dashboard</h1>
            <p>Welcome — use the menu below to manage site content.</p>

            <nav style={{ display: "flex", gap: 12, marginTop: 18 }}>
                <Link href="/admin/settings">Site Settings</Link>
                <Link href="/admin/carousel">Carousel</Link>
                <Link href="/admin/categories">Categories</Link>
                <Link href="/admin/books">Books</Link>
                <Link href="/admin/feedbacks">Feedbacks</Link>
            </nav>

            <section style={{ marginTop: 24 }}>
                <h2>Quick actions</h2>
                <ul>
                    <li><Link href="/admin/books">Manage Books</Link></li>
                    <li><Link href="/admin/categories">Manage Categories</Link></li>
                    <li><Link href="/admin/carousel">Manage Carousel</Link></li>
                </ul>
            </section>
        </div>
    );
}
