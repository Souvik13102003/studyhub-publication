// pages/index.tsx
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Carousel from "../components/Carousel";
import Hero from "@/components/Hero";
import CategoryCard, {
  Category as CategoryType,
} from "@/components/CategoryCard";
import BookCard, { Book as BookType } from "@/components/BookCard";
import gridStyles from "@/styles/BooksGrid.module.css";
import { useEffect, useState } from "react";
import Link from "next/link";

type Book = {
  _id?: string;
  title: string;
  author: string;
  frontCover?: string;
  category?: string;
};

export default function Home() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [title, setTitle] = useState("WELCOME TO STUDY-HUB PUBLICATION");
  const [description, setDescription] = useState(
    "We have the biggest bestsellers to the hardest-to-find, out-of-print rarities brought to you."
  );
  const [carousel, setCarousel] = useState<any[]>([]);

  useEffect(() => {
    // fetch categories, books and carousel in parallel (no duplicates)
    Promise.all([
      fetch("/api/categories")
        .then((r) => r.json())
        .catch(() => []),
      fetch("/api/books")
        .then((r) => r.json())
        .catch(() => []),
      fetch("/api/carousel")
        .then((r) => r.json())
        .catch(() => []),
    ]).then(([cats, bks, car]) => {
      setCategories(cats);
      setBooks(bks);
      setCarousel(car);
    });

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

        {/* Hero Section*/}
        <Hero title={title} description={description} />

        {/* Categories Section */}
        <section style={{ marginTop: 20 }}>
          <h2>Categories </h2>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {categories.map((c) => (
              <CategoryCard key={c._id || c.name} category={c} />
            ))}
          </div>
        </section>

        {/* Featured Books Section */}
        <section style={{ marginTop: 20 }}>
          <h2>Featured Books</h2>

          <div className={gridStyles.grid}>
            {books.map((b) => (
              <BookCard key={b._id} book={b} />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
