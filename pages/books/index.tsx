import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

type Book = {
  _id?: string;
  title: string;
  author: string;
  isbn?: string;
  category?: string;
  frontCover?: string;
};

export default function BooksPage() {
  const router = useRouter();
  const { category: queryCategory } = router.query;
  const [books, setBooks] = useState<Book[]>([]);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState<string>(
    (queryCategory as string) || ""
  );
  const [categories, setCategories] = useState<any[]>([]);

  // 🟢 Fetch categories & initial list
  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => []);

    if (router.isReady) {
      if (queryCategory) setCategory(queryCategory as string);
      fetchList(queryCategory as string, q);
    }
  }, [router.isReady, queryCategory]);

  // 🟢 Fetch books when category changes
  useEffect(() => {
    if (router.isReady) {
      fetchList(category, q);
    }
  }, [category]);

  // 🟢 Debounced search effect — triggers after typing stops for 400ms
  useEffect(() => {
    // if (q.length < 2 && q !== "") return; // don't fetch for very short queries

    const handler = setTimeout(() => {
      fetchList(category, q);
    }, 800);

    return () => clearTimeout(handler); // cleanup previous timeout
  }, [q, category]); // only when query changes

  // ✅ Fetch function with both filters
  function fetchList(selectedCategory?: string, searchQuery?: string) {
    const params = new URLSearchParams();
    if (searchQuery) params.set("q", searchQuery);
    if (selectedCategory || category)
      params.set("category", selectedCategory || category);

    fetch(`/api/books?${params.toString()}`)
      .then((r) => r.json())
      .then(setBooks)
      .catch(() => setBooks([]));
  }

  return (
    <div style={{ maxWidth: 1100, margin: "24px auto", padding: 12 }}>
      <h1>{category ? `${category} Books` : "All Books"}</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <input
          placeholder="Search by title, author, or ISBN"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ flex: 1 }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)} // Triggers auto fetch
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c._id || c.name} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))",
          gap: 18,
        }}
      >
        {books.length > 0 ? (
          books.map((b) => (
            <div key={b._id} style={{ border: "1px solid #eee", padding: 12 }}>
              <Link
                href={`/books/${b._id}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <img
                  src={b.frontCover || "/samples/book-placeholder.png"}
                  alt={b.title}
                  style={{ width: "100%", height: 220, objectFit: "cover" }}
                />
                <div style={{ fontWeight: 700, marginTop: 8 }}>{b.title}</div>
                <div style={{ color: "#666" }}>{b.author}</div>
              </Link>
            </div>
          ))
        ) : (
          <p>No books found.</p>
        )}
      </div>
    </div>
  );
}
