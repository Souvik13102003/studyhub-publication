This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.




_-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-_



# 📚 Study-Hub Publication  
_A Catalogue Website for Books (Admin + User Portal)_

---

## 🏗️ Overview

**Study-Hub Publication** is a book catalogue web application inspired by [Bhagabati Publication](https://bhagabatipublication.com).  
It is **not an e-commerce website** — it’s a **dynamic book showcase platform** where users can browse, search, and filter books,  
and administrators can manage carousels, categories, books, and user feedbacks from an **Admin Dashboard**.

---

## ✨ Features

### 👤 User Role
- 🔍 Search books by **Title**, **Author**, **ISBN**, or **Category**
- 🗂️ Filter books by category
- 📖 View book details with **front/back cover carousel**
- 📨 Send feedback or book request from the **Contact Us** page

### 🧑‍💼 Admin Role
- 🔑 Secure admin login using **ADMIN_SECRET**
- 🖼️ Manage homepage **Carousel posters**
- 🏷️ Add / Edit / Delete **Categories**
- 📚 Manage **Books** (Title, Author, ISBN, Category, Cover Images)
- 📝 Edit **Homepage title & description** dynamically
- 💬 View / Delete / Export **User Feedbacks**
- ☁️ Integrated with **Cloudinary** for image uploads
- 🧾 MongoDB (Atlas) for secure and scalable data storage

---

## 🗂️ Folder Structure

STUDYHUB-PUBLICATION
│
├── components/
│ ├── Header.tsx # Top navigation bar
│ └── Footer.tsx # Footer section
│
├── lib/
│ ├── admin.ts # Admin token helper
│ ├── mongodb.ts # MongoDB connection setup
│ ├── uploadImage.ts # Cloudinary upload helper
│ └── verifyAdmin.ts # Admin verification middleware
│
├── models/
│ ├── Book.ts # Book schema
│ ├── Carousel.ts # Hero carousel schema
│ ├── Category.ts # Category schema
│ ├── Feedback.ts # User feedback schema
│ └── Setting.ts # Site settings (title, description)
│
├── pages/
│ ├── admin/
│ │ ├── books.tsx # Manage books (CRUD + upload)
│ │ ├── carousel.tsx # Manage hero carousel
│ │ ├── categories.tsx # Manage categories
│ │ ├── dashboard.tsx # Admin dashboard
│ │ ├── feedbacks.tsx # View user feedbacks
│ │ ├── login.tsx # Admin login
│ │ └── site-settings.tsx # Manage homepage title & description
│ │
│ ├── api/
│ │ ├── admin/
│ │ │ ├── books/
│ │ │ │ ├── [id].ts
│ │ │ │ └── index.ts
│ │ │ ├── carousel/
│ │ │ │ ├── [id].ts
│ │ │ │ └── index.ts
│ │ │ ├── categories/
│ │ │ │ ├── [id].ts
│ │ │ │ └── index.ts
│ │ │ ├── feedbacks.ts
│ │ │ ├── login.ts
│ │ │ ├── settings.ts
│ │ │ ├── upload.ts
│ │ │ └── verify.ts
│ │ │
│ │ ├── books/
│ │ │ ├── [id].ts
│ │ │ └── index.ts
│ │ ├── carousel/index.ts
│ │ ├── categories/index.ts
│ │ ├── contact.ts
│ │ └── settings.ts
│ │
│ ├── books/
│ │ ├── [id].tsx # Book detail page (carousel view)
│ │ └── index.tsx # Books list with search & filters
│ │
│ ├── contact.tsx # Public contact/feedback page
│ ├── index.tsx # Home page (dynamic content)
│ └── _app.tsx # Global styles/layout
│
├── public/ # Static assets (logo, icons)
├── styles/ # Global CSS
├── .env.local # Environment variables
├── next.config.js
├── package.json
└── README.md



---

## ⚙️ Environment Variables

Create a file named `.env.local` in the project root with the following:

```env
MONGODB_URI=mongodb+srv://<your_mongodb_uri>
ADMIN_SECRET=studyhub_admin_secret
SENDGRID_API_KEY=

# Cloudinary Configuration
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=


_-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__-_-_-__

🔐 Admin Panel Access

Login Page: /admin/login

Default Secret: studyhub_admin_secret
(can be changed in .env.local)

Once logged in:

/admin/dashboard → overview

/admin/books → manage books

/admin/carousel → manage hero banners

/admin/categories → manage book categories

/admin/feedbacks → view messages

/admin/site-settings → edit homepage title/description

🌍 MongoDB Structure
| Collection     | Description                               |
| -------------- | ----------------------------------------- |
| **books**      | Stores book details with cover URLs       |
| **categories** | Stores book categories                    |
| **carousels**  | Hero section images                       |
| **feedbacks**  | User feedbacks submitted via contact form |
| **settings**   | Homepage title and description            |




