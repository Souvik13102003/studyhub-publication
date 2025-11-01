// components/Footer.tsx
import React from "react";

export default function Footer() {
  return (
    <footer style={{ background: "#222", color: "#fff", padding: 20, marginTop: 40 }}>
      <div>Address: 15, Shyamacharan Dey Street, Kolkata - 700073</div>
      <div>Email: studyhubpublication@gmail.com | WhatsApp: 8697220830 | Contact: 8910464335</div>
      <div style={{ marginTop: 8, fontSize: 13 }}>© {new Date().getFullYear()} Study-Hub Publication</div>
    </footer>
  );
}
