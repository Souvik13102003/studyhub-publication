export interface Book {
  _id?: string;
  title: string;
  author: string;
  isbn?: string;
  category?: string;
  frontCover?: string;
  backCover?: string;
  description?: string;
}

export interface Category {
  _id?: string;
  name: string;
  thumbnail?: string;
}
