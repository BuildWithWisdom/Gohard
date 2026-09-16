# Gohard AI

<div align="center">

  <h1>🧠 Gohard AI</h1>
  <p><strong>An Adaptive 1-on-1 AI Educator & Autonomous Learning Companion</strong></p>

  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
  [![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![Hono](https://img.shields.io/badge/Hono-REST_API-E36002?style=for-the-badge&logo=hono&logoColor=white)](https://hono.dev/)
  [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
  [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon_DB-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech/)
  [![Cloudflare AI Gateway](https://img.shields.io/badge/Cloudflare-AI_Gateway-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://ai.cloudflare.com/)

</div>

---

## 🌟 Overview

**Gohard AI** is not just another generic chatbot—it is an **Adaptive 1-on-1 AI Educator**. 

Engineered from first principles, Gohard dynamically analyzes a learner's knowledge depth, pace, and confidence to deliver custom analogies, mental models, and step-by-step interactive lessons.

---

## ✨ Key Features

- 🧠 **Adaptive Teaching Engine**: Background memory extraction analyzes learner interactions to adjust explanation styles (analogy-driven, Socratic, code-first) and knowledge pacing.
- 💬 **Interactive Master Educator**: Designed to teach complex topics intuitively rather than regurgitating raw text answers.
- ⚡ **Multi-Model LLM Gateway**: Powered by Cloudflare AI Gateway for ultra-fast, multi-provider inference (NVIDIA Nemotron, Qwen, Llama, DeepSeek).
- 🔐 **Secure Authentication**: Complete JWT-based authentication flow with `bcrypt` password hashing, protected API middleware, and zero-trust parameter scoping.
- 🎟️ **ChatGPT-Style Guest Mode**: Seamless 1-message guest experience allowing instant trial before prompting account creation.
- 📚 **Course & Lesson Workspace**: Custom workspace featuring rich Markdown formatting, syntax highlighting, and interactive Mermaid diagram rendering.
- 🌐 **Clean Glassmorphism UI**: Dark mode UI built with custom CSS design tokens, smooth animations, and responsive sidebars.

---

## 🏗️ Architecture Overview

```mermaid
graph TD
    Client["🖥️ React + Vite Frontend"]
    Server["⚡ Hono REST API Server"]
    Auth["🔐 JWT Auth Middleware"]
    MemoryEngine["🧠 Adaptive Analyst Memory Engine"]
    DB[("🐘 Neon PostgreSQL (Prisma ORM)")]
    CFGateway["🌐 Cloudflare AI Gateway"]

    Client -->|REST / JWT Header| Server
    Server --> Auth
    Auth -->|Verified Payload| Server
    Server --> DB
    Server --> MemoryEngine
    MemoryEngine -->|Structured Profile| DB
    Server -->|Multi-Model Stream| CFGateway
```

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: React 18 + Vite
- **Styling**: Modern Vanilla CSS (Design Tokens, Glassmorphism, CSS Variables)
- **Icons**: Lucide React
- **Rendering**: Custom Markdown Engine + Prism Syntax Highlighter + Mermaid Diagram Visualizer

### **Backend API**
- **Framework**: Hono (Node.js runtime)
- **Database**: PostgreSQL (Neon Cloud) via Prisma ORM
- **Authentication**: JWT (`hono/jwt`) + `bcryptjs` password hashing
- **AI Gateway**: Cloudflare AI Gateway (`@cf/baai/bge-small-en-v1.5` embeddings)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **PostgreSQL Database** (e.g. Neon PostgreSQL)

### 1. Clone & Install Dependencies

```bash
# Clone the repository
git clone https://github.com/BuildWithWisdom/Gohard.git
cd Gohard

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 2. Environment Variables Setup

Create a `.env` file in the `/server` directory:

```env
DATABASE_URL="postgresql://user:password@your-neon-host/neondb?sslmode=require"
CLOUDFLARE_ACCOUNT_ID="your_account_id"
CLOUDFLARE_API_TOKEN="your_api_token"
CLOUDFLARE_GATEWAY_ID="ai-engineer"
JWT_SECRET="your_cryptographically_secure_jwt_secret_key"
```

### 3. Database Migration

```bash
cd server
npx prisma db push
```

### 4. Run Development Servers

```bash
# Start backend server (runs on http://localhost:3000)
cd server
npm run dev

# In a separate terminal, start frontend dev server
npm run dev
```

---

## 📂 Project Structure

```
Gohard/
├── index.html
├── src/
│   └── renderer/
│       ├── assets/            # Static images & logo assets
│       ├── components/        # React UI components (Sidebar, AuthScreen, LessonWorkspace, GohardLogo)
│       ├── context/           # React AuthContext & Global Providers
│       ├── services/          # Client API services (authService, llmService, courseService)
│       ├── App.tsx            # Main Application Layout & Router
│       └── theme.css          # Core Design System & Tokens
├── server/
│   ├── prisma/                # Prisma DB Schema & Migrations
│   ├── src/
│   │   ├── db/                # Prisma Client Instance
│   │   ├── modules/
│   │   │   ├── auth/          # Auth Controller, Routes, Middleware & Service
│   │   │   ├── chat/          # LLM Streaming Routes & Chat Controller
│   │   │   ├── course/        # Course Generation & Lesson Services
│   │   │   └── memory/        # Adaptive Analyst Memory & Vector Store
│   │   └── index.ts           # Main Hono Server Entry Point
│   └── package.json
└── README.md
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).