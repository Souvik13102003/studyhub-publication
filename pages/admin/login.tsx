// pages/admin/login.tsx
import { useState } from "react";
import { useRouter } from "next/router";

export default function AdminLogin() {
    const [secret, setSecret] = useState("");
    const [error, setError] = useState("");
    const router = useRouter();

    async function submit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        try {
            const res = await fetch("/api/admin/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ secret })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data?.error || "Login failed");
                return;
            }
            // store token (localStorage for now)
            localStorage.setItem("admin_token", data.token);
            router.push("/admin/dashboard");
        } catch (err) {
            setError("Network error");
        }
    }

    return (
        <div style={{ maxWidth: 640, margin: "40px auto", padding: 20 }}>
            <h1>Admin Login</h1>
            <form onSubmit={submit} style={{ display: "grid", gap: 12 }}>
                <label>
                    Admin Secret:
                    <input value={secret} onChange={(e) => setSecret(e.target.value)} style={{ width: "100%", padding: 8 }} />
                </label>
                <button type="submit" style={{ padding: "8px 12px" }}>Login</button>
                {error && <div style={{ color: "red" }}>{error}</div>}
            </form>
            <p style={{ marginTop: 12, color: "#666" }}>
                Use the same secret as <code>ADMIN_SECRET</code> in <code>.env.local</code>.
            </p>
        </div>
    );
}
