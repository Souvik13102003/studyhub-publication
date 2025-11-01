// pages/contact.tsx
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";

export default function ContactPage() {
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [bookName, setBookName] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setStatus(null);

        // client-side validation
        if (!name.trim()) return setStatus({ type: "error", text: "Please enter your name." });
        if (!phone.trim()) return setStatus({ type: "error", text: "Please enter your phone number." });

        setLoading(true);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: name.trim(), phone: phone.trim(), email: email.trim(), bookName: bookName.trim(), message: message.trim() })
            });

            const body = await res.json().catch(() => ({}));
            if (!res.ok) {
                setStatus({ type: "error", text: body?.error || "Submission failed. Try again." });
            } else {
                setStatus({ type: "success", text: "Thank you — your message has been sent!" });
                setName(""); setPhone(""); setEmail(""); setBookName(""); setMessage("");
            }
        } catch (err) {
            console.error(err);
            setStatus({ type: "error", text: "Network error. Please try again." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Head>
                <title>Contact Us — Study-Hub Publication</title>
            </Head>

            <main style={{ maxWidth: 920, margin: "28px auto", padding: 16 }}>
                <nav style={{ marginBottom: 12 }}>
                    <Link href="/">Home</Link> / <strong>Contact Us</strong>
                </nav>

                <h1>Contact Us</h1>
                <p>If you'd like a book, feedback or general query, use this form. Fields marked * are required.</p>

                <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12, marginTop: 12 }}>
                    <label>
                        Name*<br />
                        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={{ width: "100%" }} />
                    </label>

                    <label>
                        Phone*<br />
                        <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" style={{ width: "100%" }} />
                    </label>

                    <label>
                        Email<br />
                        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: "100%" }} />
                    </label>

                    <label>
                        Book name* (if applicable)<br />
                        <input value={bookName} onChange={(e) => setBookName(e.target.value)} placeholder="Book title (optional)" style={{ width: "100%" }} />
                    </label>

                    <label>
                        Feedback / Message<br />
                        <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Your message" rows={6} style={{ width: "100%" }} />
                    </label>

                    <div>
                        <button type="submit" disabled={loading} style={{ padding: "8px 14px" }}>{loading ? "Sending…" : "Submit"}</button>
                    </div>

                    {status && (
                        <div style={{ padding: 10, borderRadius: 4, background: status.type === "success" ? "#e6ffed" : "#ffecec", color: status.type === "success" ? "#0a6d2f" : "#a61616" }}>
                            {status.text}
                        </div>
                    )}
                </form>

                <section style={{ marginTop: 28, padding: 12, background: "#f8f8f8", borderRadius: 6 }}>
                    <h3>Visit or call</h3>
                    <div>Address: 15, Shyamacharan Dey Street, Kolkata - 700073</div>
                    <div>Email: studyhubpublication@gmail.com</div>
                    <div>WhatsApp: 8697220830 | Contact: 8910464335</div>
                </section>
            </main>
        </>
    );
}
