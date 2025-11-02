// components/CategoryCard.tsx
import React from "react";
import Link from "next/link";
import styles from "@/styles/CategoryCard.module.css";

export type Category = { _id?: string; name: string; thumbnail?: string };

interface Props {
  category: Category;
  className?: string;
  style?: React.CSSProperties;
  // optional future prop if you want to show number of books per category
  // count?: number;
}

const CategoryCard: React.FC<Props> = ({ category, className = "", style }) => {
  const href = `/books?category=${encodeURIComponent(category.name)}`;

  // combine external className (if provided) with module class
  const combined = `${styles.card} ${className}`.trim();

  return (
    <Link
      href={href}
      className={combined}
      style={style}
      aria-label={`Category ${category.name}`}
      prefetch={false}
    >
      <div className={styles.cardInner}>
        <img
          src={category.thumbnail || "/samples/category-placeholder.png"}
          alt={category.name}
          className={styles.thumb}
          width={64}
          height={64}
          loading="lazy"
        />

        <div className={styles.content}>
          <div className={styles.title}>{category.name}</div>
          {/* Uncomment and wire if you have counts
              <div className={styles.subtitle}>{count ?? 0} books</div>
          */}
        </div>

        <div className={styles.trailing} aria-hidden="true">
          <svg
            className={styles.chev}
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
