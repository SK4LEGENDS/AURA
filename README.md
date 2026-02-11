# 🌌 AURA (Advanced User Research AI)
[![Aura Architecture](https://img.shields.io/badge/Architecture-RAG-blueviolet)](/docs)
[![Privacy First](https://img.shields.io/badge/Privacy-Local_LLM-emerald)](/docs/security)

Aura is a state-of-the-art, privacy-first RAG (Retrieval-Augmented Generation) platform that transforms your documents and URLs into an intelligent, searchable knowledge base. By combining local LLM power with professional-grade visualizations, Aura provides insights you can trust, verified by source citations.

---

## 🚀 Today's Major Breakthroughs

### 📊 Ultra-Robust Visualization Engine (Level 4 Resilience)
Our new visualization engine is designed to be "pollution-proof." Even if the AI provides messy or truncated JSON, Aura's **Triple-Lock** security ensures the data is recovered:
- **Delimited JSON Protocol**: Uses `<<<GRAPH_JSON>>>` markers to isolate data from conversational noise.
- **Advanced "Surgery" Engine**: Surgically extracts numbers from complex hallucinations and repairs mangled JSON structures on the fly.
- **Interactive Graph Editor**: Switch between 9+ chart types (Radar, Funnel, Gantt, etc.) in real-time without re-generating the response.
- **Professional Exports**: Export high-resolution charts as PNG, SVG, or PDF for reports.

### 🛡️ Source-Grounded Integrity
- **Chunk Highlighting**: See exactly which parts of your documents influenced a response.
- **Infinite Traceability**: Click any citation to open the source document and jump directly to the relevant context.

### ⚡ Professional Workspace Experience
- **PWA Ready**: Install Aura as a desktop or mobile app with full offline-aware capability.
- **Micro-Actions**: Instant response copying, feedback loops, and advanced keyboard shortcuts.
- **Skeleton Loaders**: A smoother, modern UX with progressive data loading.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Framer Motion
- **Intelligence**: Ollama (llama3.2 & nomic-embed-text)
- **Data Engine**: Firestore, Firebase Admin, PDF-Parse, Mammoth
- **Visualizations**: Recharts, Canvas API, jsPDF

## ⚙️ Getting Started

### 1. Prerequisites
- [Ollama](https://ollama.com/) installed and running.
- [Node.js](https://nodejs.org/) v18+.

### 2. Environment Setup
Create a `.env` file in the root:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_id
FIREBASE_CLIENT_EMAIL=your_email
FIREBASE_PRIVATE_KEY=your_key
OLLAMA_BASE_URL=http://localhost:11434
```

### 3. Installation
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to start chatting with your intelligence.

---

## 📖 Learn More
Explore our full technical documentation at [/docs](http://localhost:3000/docs).

