// components/Hero.tsx
import React from "react";
import styles from "../styles/Hero.module.css";

interface HeroProps {
  title: string;
  description: string;
}

const Hero: React.FC<HeroProps> = ({ title, description }) => {
  return (
    <section className={styles.heroWrap} aria-labelledby="hero-title">
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.accent} aria-hidden="true" />

          <div className={styles.content}>
            <h2 id="hero-title" className={styles.title}>
              {title}
            </h2>

            <p
              className={styles.description}
              style={{ whiteSpace: "pre-line" }}
            >
              {description}
            </p>

            <div className={styles.ctaRow}>
              <a
                href="/books"
                className={styles.primaryBtn}
                aria-label="Browse books"
              >
                Browse Books
              </a>
              <a
                href="/contact"
                className={styles.linkBtn}
                aria-label="Contact us"
              >
                Contact Us →
              </a>
            </div>

            <div className={styles.smallMeta}>
              Catalogue updated regularly — new arrivals & bestsellers.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
