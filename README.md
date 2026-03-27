<div align="center">

# 🚀 ZCRUM

### Agile Project Management, Reimagined

A modern, full-featured **Jira-inspired** project management tool built for teams who move fast. Plan sprints, manage tasks, and ship products — beautifully.

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Screenshots](#screenshots)
- [Contributing](#contributing)

---

## 🧩 About

**ZCRUM** is a full-stack agile project management application inspired by Jira. It empowers teams to plan, track, and deliver projects efficiently through intuitive Kanban boards, sprint planning, and real-time collaboration — all wrapped in a clean, responsive UI.

Whether you're a solo developer or a growing team, ZCRUM gives you the tools to stay organized and ship faster.

---

## ✨ Features

- 🗂 **Project Management** — Create and manage multiple organisations, projects, sprints and issues with ease
- 🏃 **Sprint Planning** — Organize work into focused sprints with start/end dates
- 📌 **Kanban Board** — Drag-and-drop task management across custom workflow stages
- 🎯 **Issue Tracking** — Create, assign, and prioritize issues with labels and statuses
- 👥 **Team Collaboration** — Invite members, assign roles, and work together in real time
- 🔐 **Secure Authentication** — Powered by Clerk with support for social logins
- 🌗 **Light / Dark Mode** — Fully themed UI with user-preferred color scheme
- 📱 **Responsive Design** — Seamless experience across desktop, tablet, and mobile

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 15](https://nextjs.org/) (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS + shadcn/ui |
| **Auth** | [Clerk](https://clerk.com/) |
| **Database** | PostgreSQL (via [Neon](https://neon.tech/)) |
| **ORM** | [Prisma](https://www.prisma.io/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) `v18+`
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A [PostgreSQL](https://www.postgresql.org/) database (or a [Neon](https://neon.tech) serverless instance)
- A [Clerk](https://clerk.com/) account for authentication

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/lazytech614/ZCRUM.git
cd ZCRUM
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory. See the [Environment Variables](#environment-variables) section below.

4. **Set up the database**

```bash
npx prisma generate
npx prisma db push
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

---

## 🔑 Environment Variables

Create a `.env` file in the root of the project with the following variables:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/zcrum"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Clerk Redirect URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/onboarding
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/onboarding
```

> ⚠️ Never commit your `.env` file to version control.

---

## 📁 Project Structure

```
ZCRUM/
├── app/                    # Next.js App Router pages & layouts
│   ├── (auth)/             # Auth-related pages (sign-in, sign-up)
│   ├── (main)/             # Protected app pages
│   │   ├── onboarding/     # New user onboarding flow
│   │   ├── organization/   # Org & project management
│   │   └── project/        # Sprint & board views
│   └── layout.tsx          # Root layout
├── components/             # Reusable UI components
├── lib/                    # Utility functions & server actions
├── prisma/                 # Database schema & migrations
│   └── schema.prisma
├── public/                 # Static assets
└── middleware.ts           # Clerk auth middleware
```

---

## 🤝 Contributing

Contributions are welcome! If you'd like to improve ZCRUM, please follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please make sure your code follows the existing style and all checks pass before submitting.

---

<div align="center">

Made with 💗 by [Rupanjan De](https://github.com/lazytech614)

⭐ If you found this project useful, please consider giving it a star!

</div>