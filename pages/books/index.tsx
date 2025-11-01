// pages/books/index.tsx
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

type Book = { _id?: string; title: string; author: string; frontCover?: string; category?: string };

export default function BooksPage() {
    const router = useRouter();
    const qInitial = (router.query.q as string) || "";
    const catInitial = (router.query.category as string) || "";

    const [q, setQ] = useState<string>(qInitial);
    const [category, setCategory] = useState<string>(catInitial);
    const [books, setBooks] = useState<Book[]>([]);

    useEffect(() => {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (category) params.set("category", category);
        fetch("/api/books?" + params.toString())
            .then((r) => r.json())
            .then(setBooks)
            .catch(() => setBooks([]));
    }, [q, category]);

    return (
        <>
            <Header />
            <main style={{ maxWidth: 1100, margin: "20px auto", padding: 12 }}>
                <h1>Books</h1>
                <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <input placeholder="Search by title / author / ISBN" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1, padding: 8 }} />
                    <input placeholder="Filter by category" value={category} onChange={(e) => setCategory(e.target.value)} style={{ width: 240, padding: 8 }} />
                </div>

                <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(220px,1fr))" }}>
                    {books.map((b) => (
                        <div key={b._id} style={{ border: "1px solid #eee", padding: 12 }}>
                            <img src={b.frontCover || "/samples/book-placeholder.png"} alt={b.title} style={{ width: "100%", height: 240, objectFit: "cover" }} />
                            <h3 style={{ marginTop: 8 }}>{b.title}</h3>
                            <div style={{ color: "#666" }}>{b.author}</div>
                            <Link href={`/books/${b._id}`} style={{ marginTop: 8, display: "inline-block", color: "#0070f3" }}>
                                View
                            </Link>
                        </div>
                    ))}
                </div>
            </main>
            <Footer />
        </>
    );
}
