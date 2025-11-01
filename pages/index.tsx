// pages/index.tsx
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";
import { useEffect, useState } from "react";
import Link from "next/link";

type Category = { _id?: string; name: string; thumbnail?: string };
type Book = {
  _id?: string;
  title: string;
  author: string;
  frontCover?: string;
  category?: string;
};

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

    fetch("/api/carousel")
      .then((r) => r.json())
      .then(setCarousel)
      .catch(() => {});
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => {});
    fetch("/api/books")
      .then((r) => r.json())
      .then(setBooks)
      .catch(() => {});
    let mounted = true;
    fetch("/api/settings")
      .then((r) => r.json())
      .then((d) => {
        if (!mounted) return;
        if (d?.title) setTitle(d.title);
        if (d?.description) setDescription(d.description);
      })
      .catch((e) => console.error("settings fetch", e));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      <Head>
        <title>Study - Hub Publication </title>
      </Head>

      <Header />
      <main style={{ maxWidth: 1100, margin: "20px auto", padding: 12 }}>
        {/* Carousel Section */}
        <Carousel items={carousel} autoplayMs={4500} />

        <section style={{ padding: "36px 24px", background: "#fff" }}>
          <h2 style={{ fontSize: 36, margin: "12px 0" }}> {title} </h2>
          <p style={{ color: "#444", lineHeight: 1.6 }}> {description} </p>
        </section>

        <section style={{ marginTop: 20 }}>
          <h2>Categories </h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {categories.map((c) => (
              <Link
                key={c._id || c.name}
                href={`/books?category=${encodeURIComponent(c.name)}`}
              >
                <div
                  style={{
                    border: "1px solid #eee",
                    padding: 12,
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    cursor: "pointer",
                  }}
                >
                  <img
                    src={c.thumbnail || "/samples/category-placeholder.png"}
                    alt={c.name}
                    style={{
                      width: 64,
                      height: 64,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                  <div> {c.name} </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 20 }}>
          <h2>Featured Books </h2>
          <div
            style={{
              display: "grid",
              gap: 16,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px,1fr))",
            }}
          >
            {books.map((b) => (
              <div
                key={b._id}
                style={{ border: "1px solid #eee", padding: 12 }}
              >
                <img
                  src={b.frontCover || "/samples/book-placeholder.png"}
                  alt={b.title}
                  style={{ width: "100%", height: 260, objectFit: "cover" }}
                />
                <h3 style={{ marginTop: 8 }}> {b.title} </h3>
                <div style={{ color: "#666" }}> {b.author} </div>
                <Link
                  href={`/books/${b._id}`}
                  style={{
                    display: "inline-block",
                    marginTop: 8,
                    color: "#0070f3",
                  }}
                >
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
