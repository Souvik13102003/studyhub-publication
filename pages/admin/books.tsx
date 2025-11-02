// pages/admin/books.tsx
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { uploadImageFile } from "@/lib/uploadImage";

type Book = {
  _id?: string;
  title: string;
  author: string;
  isbn?: string;
  category?: string;
  frontCover?: string;
  backCover?: string;
  description?: string;
};

type Category = { _id?: string; name: string; thumbnail?: string };

export default function AdminBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<Book>({
    title: "",
    author: "",
    isbn: "",
    category: "",
    frontCover: "",
    backCover: "",
    description: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingFront, setUploadingFront] = useState(false);
  const [uploadingBack, setUploadingBack] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("admin_token")
        : null;
    if (!token) {
      // call router.push but don't return its Promise from the effect
      router.push("/admin/login");
      return;
    }

    fetch("/api/admin/books", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setBooks)
      .catch(() => setBooks([]));

    // load categories for dropdown
    fetch("/api/admin/categories", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, [router]);

  // helper to check blob preview
  const isBlobUrl = (val?: string) => !!val && val.startsWith("blob:");

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    // prevent submitting while uploading
    if (uploadingFront || uploadingBack) {
      return alert(
        "Please wait for image uploads to finish before submitting."
      );
    }

    // prevent accidentally submitting blob previews
    if (isBlobUrl(form.frontCover) || isBlobUrl(form.backCover)) {
      return alert(
        "Please wait for image uploads to complete (local preview detected)."
      );
    }

    const token = localStorage.getItem("admin_token");
    if (!token) return router.push("/admin/login");

    if (editingId) {
      const res = await fetch(`/api/admin/books/${editingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) return alert("Update failed");
      const updated = await res.json();
      setBooks((p) => p.map((b) => (b._id === updated._id ? updated : b)));
      setEditingId(null);
    } else {
      const res = await fetch("/api/admin/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Create failed" }));
        return alert(err?.error || "Create failed");
      }
      const created = await res.json();
      setBooks((p) => [created, ...p]);
    }

    setForm({
      title: "",
      author: "",
      isbn: "",
      category: "",
      frontCover: "",
      backCover: "",
      description: "",
    });
  }

  function editBook(b: Book) {
    setEditingId(b._id || null);
    setForm({
      title: b.title,
      author: b.author,
      isbn: b.isbn || "",
      category: b.category || "",
      frontCover: b.frontCover || "",
      backCover: b.backCover || "",
      description: b.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function remove(id?: string) {
    if (!id) return;
    if (!confirm("Delete book?")) return;
    const token = localStorage.getItem("admin_token");
    const res = await fetch(`/api/admin/books/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.status === 204) setBooks((p) => p.filter((b) => b._id !== id));
    else alert("Delete failed");
  }

  // Front cover change handler
  async function handleFrontFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const token = localStorage.getItem("admin_token") || "";
    // create preview
    const preview = URL.createObjectURL(f);
    // keep track of the preview so we can revoke it later if needed
    setForm((p) => ({ ...p, frontCover: preview }));

    try {
      setUploadingFront(true);
      const url = await uploadImageFile(f);
      // revoke preview if it was a blob URL we created
      try {
        if (isBlobUrl(preview)) URL.revokeObjectURL(preview);
      } catch {}
      setForm((p) => ({ ...p, frontCover: url }));
    } catch (err: any) {
      // keep preview visible but notify user
      alert("Front image upload failed: " + (err?.message || err));
    } finally {
      setUploadingFront(false);
    }
  }

  // Back cover change handler
  async function handleBackFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const token = localStorage.getItem("admin_token") || "";
    const preview = URL.createObjectURL(f);
    setForm((p) => ({ ...p, backCover: preview }));

    try {
      setUploadingBack(true);
      const url = await uploadImageFile(f);
      try {
        if (isBlobUrl(preview)) URL.revokeObjectURL(preview);
      } catch {}
      setForm((p) => ({ ...p, backCover: url }));
    } catch (err: any) {
      alert("Back image upload failed: " + (err?.message || err));
    } finally {
      setUploadingBack(false);
    }
  }

  // revoke any leftover object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (isBlobUrl(form.frontCover)) {
        try {
          URL.revokeObjectURL(form.frontCover as string);
        } catch {}
      }
      if (isBlobUrl(form.backCover)) {
        try {
          URL.revokeObjectURL(form.backCover as string);
        } catch {}
      }
    };
    // we intentionally skip adding `form` to deps to avoid revoking mid-edit
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const anyUploading = uploadingFront || uploadingBack;

  return (
    <div style={{ maxWidth: 1100, margin: "24px auto", padding: 12 }}>
      <h1>Manage Books</h1>

      <form onSubmit={submit} style={{ display: "grid", gap: 8 }}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          placeholder="Author"
          value={form.author}
          onChange={(e) => setForm({ ...form, author: e.target.value })}
          required
        />
        <input
          placeholder="ISBN (optional)"
          value={form.isbn}
          onChange={(e) => setForm({ ...form, isbn: e.target.value })}
        />
        <select
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="">Select category (optional)</option>
          {categories.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* replace front/back inputs with file upload + preview */}
        <label>
          Front cover
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFrontFileChange}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {form.frontCover ? (
                <img
                  src={form.frontCover}
                  alt="front"
                  style={{ width: 86, height: 110, objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{ width: 86, height: 110, background: "#f3f3f3" }}
                />
              )}
              {uploadingFront && (
                <small style={{ marginTop: 6 }}>Uploading front...</small>
              )}
            </div>
          </div>
        </label>

        <label>
          Back cover
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleBackFileChange}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {form.backCover ? (
                <img
                  src={form.backCover}
                  alt="back"
                  style={{ width: 86, height: 110, objectFit: "cover" }}
                />
              ) : (
                <div
                  style={{ width: 86, height: 110, background: "#f3f3f3" }}
                />
              )}
              {uploadingBack && (
                <small style={{ marginTop: 6 }}>Uploading back...</small>
              )}
            </div>
          </div>
        </label>

        <textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div>
          <button type="submit" disabled={anyUploading}>
            {anyUploading
              ? "Please wait..."
              : editingId
              ? "Update Book"
              : "Add Book"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({
                  title: "",
                  author: "",
                  isbn: "",
                  category: "",
                  frontCover: "",
                  backCover: "",
                  description: "",
                });
                setUploadingFront(false);
                setUploadingBack(false);
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div style={{ marginTop: 24 }}>
        {books.map((b) => (
          <div
            key={b._id}
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              border: "1px solid #eee",
              padding: 12,
              marginBottom: 8,
            }}
          >
            <img
              src={b.frontCover || "/samples/book-placeholder.png"}
              alt={b.title}
              style={{ width: 86, height: 110, objectFit: "cover" }}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700 }}>{b.title}</div>
              <div style={{ color: "#666" }}>{b.author}</div>
              <div style={{ fontSize: 13 }}>{b.isbn}</div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => editBook(b)}>Edit</button>
              <button onClick={() => remove(b._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
