// pages/books/[id].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

type BookDetail = {
  _id?: string;
  title?: string;
  author?: string;
  isbn?: string;
  frontCover?: string;
  backCover?: string;
  description?: string;
};

export default function BookDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState<BookDetail | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/books/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then(setBook)
      .catch(() => setBook(null));
  }, [id]);

  return (
    <>
      <Header />
      <main style={{ maxWidth: 1100, margin: "20px auto", padding: 12 }}>
        {!book ? (
          <p>Loading or not found.</p>
        ) : (
          <div style={{ display: "flex", gap: 20 }}>
            <div style={{ width: 340 }}>
              <img src={book.frontCover || "/samples/book-placeholder.png"} alt={book.title} style={{ width: "100%", height: 460, objectFit: "cover" }} />
              {/* Later replace with small carousel for front/back */}
            </div>

            <div style={{ flex: 1 }}>
              <h1>{book.title}</h1>
              <div style={{ color: "#666" }}>{book.author}</div>
              {book.isbn && <div style={{ marginTop: 8 }}>ISBN: {book.isbn}</div>}
              <section style={{ marginTop: 12 }}>
                <h3>Description</h3>
                <p style={{ color: "#444" }}>{book.description || "No description available."}</p>
              </section>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
