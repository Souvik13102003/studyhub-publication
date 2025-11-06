// pages/about.tsx
import React from "react";
import Link from "next/link";

export default function About() {
  return (
    <main
      style={{
        maxWidth: 900,
        margin: "40px auto",
        padding: "0 20px",
        lineHeight: 1.6,
      }}
    >
      <h1
        style={{
          fontSize: 32,
          fontWeight: 700,
          color: "#222",
          marginBottom: 20,
        }}
      >
        About Study-Hub Publication
      </h1>

      <section style={{ marginBottom: 32 }}>
        <p>
          <strong>Study-Hub Publication</strong> is dedicated to supporting
          learners, educators, and authors by providing high-quality academic
          resources and publications. Based in Kolkata, we aim to make learning
          materials more accessible, affordable, and aligned with modern
          educational standards.
        </p>

        <p>
          Our mission is to bridge the gap between knowledge and opportunity by
          publishing insightful books, study materials, and digital content that
          empower students and professionals alike. From textbooks and guides to
          reference materials, every publication is designed with clarity and
          precision.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, marginBottom: 12, color: "#333" }}>
          Our Vision
        </h2>
        <p>
          To become a trusted name in educational publishing by continuously
          improving the quality and reach of our learning materials. We envision
          a future where education is accessible to everyone, regardless of
          location or background.
        </p>
      </section>

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: 24, marginBottom: 12, color: "#333" }}>
          Contact Information
        </h2>
        <p>
          <strong>Address:</strong> 15, Shyamacharan Dey Street, Kolkata -
          700073
        </p>
        <p>
          <strong>Email:</strong>{" "}
          <a
            href="mailto:studyhubpublication@gmail.com"
            style={{ color: "#0066cc" }}
          >
            studyhubpublication@gmail.com
          </a>
        </p>
        <p>
          <strong>WhatsApp:</strong>{" "}
          <a
            href="https://wa.me/918697220830"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "#0066cc" }}
          >
            8697220830
          </a>
        </p>
        <p>
          <strong>Contact:</strong> 8910464335
        </p>
      </section>

      <section>
        <h2 style={{ fontSize: 24, marginBottom: 12, color: "#333" }}>
          Get in Touch
        </h2>
        <p>
          Whether you’re an author looking to publish your work or a student
          searching for quality study materials, we’d love to hear from you.
          Reach out to us via email or WhatsApp for any inquiries,
          collaborations, or bulk orders.
        </p>
      </section>

      <div style={{ marginTop: 40 }}>
        <Link href="/" style={{ color: "#0066cc", textDecoration: "none" }}>
          ← Back to Home
        </Link>
      </div>
    </main>
  );
}
