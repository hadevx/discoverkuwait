# Discover Kuwait — Frontend

A bilingual (Arabic/English) React web application for exploring Kuwaiti culture, language, history, and geography through interactive quizzes, a dialect dictionary, and an explorable map.

---

## Features

- **Interactive Kuwait Map** — Explore all 6 governorates with location-based progress tracking
- **Quiz Game** — Bilingual multiple-choice quizzes across categories: dialect, history, geography, traditions, and landmarks
- **Kuwaiti Dictionary** — Browse, vote on, and submit Kuwaiti words with Arabic/English meanings
- **Leaderboard** — Real-time rankings of top players
- **User Profiles** — Track points, streaks, quiz history, and explored areas
- **Bilingual UI** — Full Arabic and English language switching
- **Light/Dark Theme** — User-selectable appearance

---

## Tech Stack

| Category | Technologies |
|---|---|
| Framework | React 19, React Router 7 |
| State Management | Redux Toolkit |
| Forms & Validation | React Hook Form, Zod |
| Styling | Tailwind CSS 4, Shadcn UI, Radix UI |
| Charts | Recharts |
| Icons | Lucide React |
| Notifications | Sonner |
| Build Tool | Vite |
| Language | TypeScript |

---

## Project Structure

```
frontend/
├── src/
│   ├── pages/
│   │   ├── home/           # Home page with Kuwait map
│   │   ├── quiz/           # Quiz game page
│   │   ├── dictionary/     # Word dictionary page
│   │   ├── profile/        # User profile & stats
│   │   ├── auth/           # Login & registration
│   │   └── maintenance/    # Maintenance mode page
│   ├── redux/              # Redux store, slices, and API queries
│   ├── App.tsx             # Root routing
│   └── main.tsx            # App entry point
├── components/
│   ├── quiz-game.tsx
│   ├── leaderboard.tsx
│   ├── kuwait-map.tsx
│   ├── governorate-detail.tsx
│   ├── word-card.tsx
│   ├── submit-word-dialog.tsx
│   ├── site-header.tsx
│   ├── site-banner.tsx
│   ├── progress-stats.tsx
│   ├── theme-provider.tsx
│   └── ui/                 # Shadcn UI base components
├── lib/
│   ├── language-context/   # Arabic/English language switching
│   ├── progress-context/   # User progress state
│   └── kuwait-data/        # Static governorate data
├── hooks/                  # Custom React hooks
├── styles/                 # Global CSS
└── public/                 # Static assets
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm
- Backend API running (see `/backend`)

### Installation

```bash
cd frontend
npm install
```

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:4001
```

### Running the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build |

---

## Backend API

This frontend connects to the Express/Node.js backend at `http://localhost:4001` by default. The backend handles:

- User authentication (JWT)
- Quiz data and scoring
- Word dictionary with voting and submissions
- Progress tracking
- Leaderboard data
- Governorate exploration tracking

See the `/backend` directory for backend setup instructions.

---

## Deployment

The production frontend is deployed at **[auknotes.com](https://auknotes.com)** and communicates with the backend at `https://auknotes-backend.webschema.online`.
