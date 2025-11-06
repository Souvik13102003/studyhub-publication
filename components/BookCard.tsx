// components/BookCard.tsx
import React from "react";
import Link from "next/link";
import styles from "@/styles/BookCard.module.css";

export type Book = {
  _id?: string;
  title: string;
  author: string;
  frontCover?: string;
  category?: string;
};

interface Props {
  book: Book;
  className?: string;
  style?: React.CSSProperties;
}

const BookCard: React.FC<Props> = ({ book, className = "", style }) => {
  const rootClass = `${styles.card} ${className}`.trim();

  return (
    <article
      className={rootClass}
      style={style}
      aria-labelledby={`book-title-${book._id}`}
    >
      <Link href={`/books/${book._id}`} className={styles.link}>
        <div className={styles.cover} role="img" aria-label={book.title}>
          <img
            src={book.frontCover || "/samples/default-book-front-cover.png"}
            alt={book.title}
            loading="lazy"
            draggable={false}
          />
        </div>

        <div className={styles.content}>
          {book.category && (
            <span className={styles.category}>{book.category}</span>
          )}

          <h3 id={`book-title-${book._id}`} className={styles.title}>
            {book.title}
          </h3>

          <div className={styles.author}>{book.author}</div>

          <p>View Details →</p>
        </div>
      </Link>
    </article>
  );
};

export default BookCard;
