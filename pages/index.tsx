// pages/index.tsx
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import Link from "next/link";

type Category = { _id?: string; name: string; thumbnail?: string };
type Book = { _id?: string; title: string; author: string; frontCover?: string; category?: string };

export default function Home() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [title, setTitle] = useState("WELCOME TO STUDY-HUB PUBLICATION");
    const [description, setDescription] = useState(
        "We have the biggest bestsellers to the hardest-to-find, out-of-print rarities brought to you."
    );
    const [carousel, setCarousel] = useState<any[]>([]);

    useEffect(() => {
        fetch("/api/categories")
            .then((r) => r.json())
            .then(setCategories)
            .catch(() => setCategories([]));
        fetch("/api/books")
            .then((r) => r.json())
            .then(setBooks)
            .catch(() => setBooks([]));
        fetch("/api/settings").then(r => r.json()).then(s => {
            setTitle(s.homeTitle || "WELCOME TO STUDY-HUB PUBLICATION");
            setDescription(s.homeDescription || "");
        }).catch(() => { });

        fetch("/api/carousel").then(r => r.json()).then(setCarousel).catch(() => { });
        fetch("/api/categories").then(r => r.json()).then(setCategories).catch(() => { });
        fetch("/api/books").then(r => r.json()).then(setBooks).catch(() => { });
    }, []);

    return (
        <>
            <Head>
                <title>Study-Hub Publication</title>
            </Head>

            <Header />
            <main style={{ maxWidth: 1100, margin: "20px auto", padding: 12 }}>
                <section style={{ marginTop: 18 }}>
                    <div style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 12 }}>
                        {carousel.map((c) => (
                            <a key={c._id} href={c.link || "#"} style={{ minWidth: 520, display: "block" }}>
                                <img src={c.imageUrl} alt={c.title} style={{ width: "100%", height: 260, objectFit: "cover", borderRadius: 6 }} />
                            </a>
                        ))}
                    </div>
                </section>

                <section style={{ background: "#fff", padding: 18, borderRadius: 6 }}>
                    <h1>{title}</h1>
                    <p style={{ color: "#555" }}>{description}</p>
                </section>

                <section style={{ marginTop: 20 }}>
                    <h2>Categories</h2>
                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                        {categories.map((c) => (
                            <Link key={c._id || c.name} href={`/books?category=${encodeURIComponent(c.name)}`}>
                                <div style={{ border: "1px solid #eee", padding: 12, display: "flex", gap: 12, alignItems: "center", cursor: "pointer" }}>
                                    <img src={c.thumbnail || "/samples/category-placeholder.png"} alt={c.name} style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 6 }} />
                                    <div>{c.name}</div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                <section style={{ marginTop: 20 }}>
                    <h2>Featured Books</h2>
                    <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))" }}>
                        {books.map((b) => (
                            <div key={b._id} style={{ border: "1px solid #eee", padding: 12 }}>
                                <img src={b.frontCover || "/samples/book-placeholder.png"} alt={b.title} style={{ width: "100%", height: 260, objectFit: "cover" }} />
                                <h3 style={{ marginTop: 8 }}>{b.title}</h3>
                                <div style={{ color: "#666" }}>{b.author}</div>
                                <Link href={`/books/${b._id}`} style={{ display: "inline-block", marginTop: 8, color: "#0070f3" }}>
                                    View Details
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            </main>

            <Footer />
        </>
    );
}
