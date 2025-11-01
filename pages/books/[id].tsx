// pages/books/[id].tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

type Book = { _id?: string; title: string; author: string; isbn?: string; frontCover?: string; backCover?: string; description?: string };

export default function BookDetail() {
    const router = useRouter();
    const { id } = router.query;
    const [book, setBook] = useState<Book | null>(null);
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/books/${id}`).then((r) => r.json()).then(setBook).catch(() => setBook(null));
    }, [id]);

    if (!book) return <div style={{ padding: 20 }}>Loading…</div>;

    const images = [book.frontCover, book.backCover].filter(Boolean) as string[];

    function next() { setIdx((i) => (i + 1) % images.length); }
    function prev() { setIdx((i) => (i - 1 + images.length) % images.length); }

    return (
        <div style={{ maxWidth: 1000, margin: "24px auto", padding: 12 }}>
            <Link href="/">← Home</Link>
            <div style={{ display: "flex", gap: 24, marginTop: 12 }}>
                <div style={{ flex: "0 0 320px" }}>
                    {images.length > 0 ? (
                        <div>
                            <div style={{ width: 320, height: 420, border: "1px solid #ddd", overflow: "hidden" }}>
                                <img src={images[idx]} alt={`Cover ${idx + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </div>
                            {images.length > 1 && (
                                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                                    <button onClick={prev}>Prev</button>
                                    <button onClick={next}>Next</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div style={{ width: 320, height: 420, background: "#f7f7f7" }}>No image</div>
                    )}
                </div>

                <div style={{ flex: 1 }}>
                    <h1>{book.title}</h1>
                    <div style={{ color: "#666" }}>{book.author}</div>
                    {book.isbn && <div style={{ marginTop: 8 }}>ISBN: {book.isbn}</div>}
                    <h3 style={{ marginTop: 18 }}>Description</h3>
                    <div style={{ color: "#333" }}>{book.description || "No description."}</div>
                </div>
            </div>
        </div>
    );
}
