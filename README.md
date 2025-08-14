<div>

# 🕵️ Anonymous Message App

[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![Shadcn/UI](https://img.shields.io/badge/UI-Shadcn%2FUI-blueviolet)](https://ui.shadcn.com/)
[![Zod](https://img.shields.io/badge/Validation-Zod-brightgreen)](https://zod.dev/)
[![Resend](https://img.shields.io/badge/Email-Resend-orange)](https://resend.com/)
[![License](https://img.shields.io/badge/License-MIT-lightgrey)](LICENSE)

A **modern and secure** anonymous message-sending platform built with **Next.js**, **Shadcn/UI**, and **Zod**.  
Users can create a **unique anonymous ID** and send messages to others **without revealing their identity**.

**Live Demo:** [mystery-messaage.vercel.app](https://mystery-messaage.vercel.app/) 🚀

---

## 📌 Features

- 🔑 **Unique Anonymous ID Generation**  
  Create your personal anonymous link to share with friends.

- ✉ **Send & Receive Messages**  
  Anyone with your ID can send you a message without knowing your identity.

- 📬 **Email Notifications (via Resend)**  
  Get notified with your OTP for email verification.

- 🛡 **Validation & Security**  
  Zod-based form validation and secure API endpoints.

- 🎨 **Clean UI**  
  Built with [Shadcn/UI](https://ui.shadcn.com/) for a clean and responsive design.

- 🚀 **Deployed on Vercel** for blazing-fast performance.

---

## 🛠 Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **UI Library:** [Shadcn/UI](https://ui.shadcn.com/)
- **Validation:** [Zod](https://zod.dev/)
- **Email Service:** [Resend](https://resend.com/)
- **Styling:** Tailwind CSS
- **Database:** (MongoDB)
- **Pipeline:** (Aggregation Pipeline in MONGO DB)
- **Hosting:** [Vercel](https://vercel.com/)
  
---

## 📂 Folder Structure
<pre> ``` anonimousend/ │ ├── src/app/ # Next.js app router pages, API, models & layouts ├── components/ # Reusable UI components ├── lib/ # Utility functions & helpers ├── public/ # Static assets ├── styles/ # Global styles (Tailwind config) ├── package.json └── README.md ``` </pre>

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository
git clone [https://github.com/Gourang12332/anony-next.git](https://github.com/Gourang12332/anony-next.git)
cd anony-next

### 2️⃣ Install Dependencies
npm install

### 3️⃣ Setup Environment Variables
<pre> ``` MONGODB_URI=your_database_connection_string RESEND_API_KEY=your_resend_api_key ``` </pre>

### 4️⃣ Run the Development Server
npm run dev

