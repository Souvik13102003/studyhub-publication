// components/Header.tsx
import Link from "next/link";
import React from "react";

export default function Header() {
  return (
    <header style={headerStyle}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={logoStyle}>SH</div>
        <div>
          <div style={{ fontWeight: 700 }}>Study-Hub Publication</div>
          <div style={{ fontSize: 12, color: "#555" }}>Catalogue of Books</div>
        </div>
      </div>

      <nav style={{ display: "flex", gap: 16 }}>
        <Link href="/">Home</Link>
        <Link href="/books">Books</Link>
        <Link href="/about">About Us</Link>
        <Link href="/contact">Contact Us</Link>
      </nav>
    </header>
  );
}

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "12px 20px",
  borderBottom: "1px solid #eee",
  background: "#fff"
};

const logoStyle: React.CSSProperties = {
  width: 52,
  height: 52,
  background: "#f4c542",
  borderRadius: 6,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: 700
};
