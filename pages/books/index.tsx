// pages/books/index.tsx
import { useEffect, useState } from "react";
import Link from "next/link";

type Book = { _id?: string; title: string; author: string; isbn?: string; category?: string; frontCover?: string };

export default function BooksPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [q, setQ] = useState("");
    const [category, setCategory] = useState("");
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/categories").then(r => r.json()).then(setCategories).catch(() => []);
        fetchList();
    }, []);

    function fetchList() {
        const params = new URLSearchParams();
        if (q) params.set("q", q);
        if (category) params.set("category", category);
        fetch(`/api/books?${params.toString()}`).then(r => r.json()).then(setBooks).catch(() => setBooks([]));
    }

    return (
        <div style={{ maxWidth: 1100, margin: "24px auto", padding: 12 }}>
            <h1>All Books</h1>

            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                <input placeholder="Search by title, author or ISBN" value={q} onChange={(e) => setQ(e.target.value)} style={{ flex: 1 }} />
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">All categories</option>
                    {categories.map((c) => <option key={c._id || c.name} value={c.name}>{c.name}</option>)}
                </select>
                <button onClick={fetchList}>Search</button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))", gap: 18 }}>
                {books.map((b) => (
                    <div key={b._id} style={{ border: "1px solid #eee", padding: 12 }}>
                        <Link href={`/books/${b._id}`} style={{ textDecoration: "none", color: "inherit" }}>
                            <img src={b.frontCover || "/samples/book-placeholder.png"} alt={b.title} style={{ width: "100%", height: 220, objectFit: "cover" }} />
                            <div style={{ fontWeight: 700, marginTop: 8 }}>{b.title}</div>
                            <div style={{ color: "#666" }}>{b.author}</div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
