# LucCarts 🛒

**Campus-Focused Grocery Delivery for the University of Oklahoma**

LucCarts is a modern, scalable grocery delivery web application designed specifically for student life. Inspired by Instacart, it connects students with local campus stores and restaurants, delivering essentials directly to dorm doors.

## 🚀 Key Improvements & Cloud Architecture

This project has been completely re-architected to be **cloud-native** and **highly scalable**, transitioning from a local demo to a robust production-ready backend.

*   **☁️ Cloud-Based Backend**: Powered by **Supabase** (PostgreSQL), ensuring data persistence, reliability, and real-time capabilities.
*   **🔒 Secure Authentication**: Robust user management and session handling via Supabase Auth.
*   **🛡️ Scalable Security**: Implements **Row Level Security (RLS)** to protect user data and order history at the database level.
*   **⚡ Modern Performance**: Built with **Next.js 15 (App Router)** and **React 19** for server-side rendering and optimal performance.
*   **🎨 Dynamic UI**: Styled with **Tailwind CSS v4** for a responsive, accessible, and premium user experience.

## 🛠️ Tech Stack

*   **Frontend**: Next.js 15, React 19, TypeScript
*   **Styling**: Tailwind CSS v4, React Icons
*   **State Management**: Zustand (Persistent Carts)
*   **Database**: Supabase (PostgreSQL)
*   **Authentication**: Supabase Auth
*   **Deployment**: Ready for Scalable Cloud Deployment

## 📦 Features

1.  **Live Product Catalog**: Real-time fetching of products from the cloud database.
2.  **Smart Cart**: Persistent cart state that survives page reloads.
3.  **Secure Checkout**: Order processing with durable records in the database.
4.  **Student-Centric**: Tailored specifically for the OU campus community.

---
*Built for convenience, speed, and student life.*
