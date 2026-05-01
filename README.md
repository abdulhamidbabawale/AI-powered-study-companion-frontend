# AI-Powered Study Companion — Frontend

A React 19 + TypeScript frontend for an AI-driven study tool. Users upload PowerPoint presentations to generate flashcards and summaries, chat with an AI tutor, and track assessments with due-date reminders.

## Features

- **AI Chat** — Multi-turn conversations with an AI tutor, scoped to uploaded study material
- **Material Upload** — Upload `.pptx` files; the backend processes them and auto-generates flashcards and a summary
- **Flashcards** — Interactive flip-card viewer generated from uploaded slides
- **Summaries** — AI-generated text summary of uploaded material
- **Assessment Tracking** — Create, edit, complete, and delete assessments (exams, quizzes, assignments) with due dates and reminder notifications
- **Dashboard** — Overview of recent chats, uploaded materials, and upcoming assessment reminders
- **Responsive Layout** — Collapsible sidebar navigation with mobile support

## Tech Stack

| Layer | Library |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Routing | React Router v7 |
| Server state | TanStack React Query v5 |
| Forms | Formik + Yup |
| HTTP | Axios (auto-attaches JWT) |
| UI components | shadcn/ui (Radix Nova) |
| Styling | Tailwind CSS v4 (CSS variable theme, `oklch` palette) |
| Icons | lucide-react |
| Font | Geist Variable |

## Project Structure

```
src/
├── api/
│   └── client.ts              # Axios instance with Bearer token + 401 redirect interceptors
├── components/
│   ├── AppLayout.tsx          # Protected page wrapper (sidebar + reminder banners)
│   ├── AppSidebar.tsx         # Collapsible navigation sidebar
│   ├── chat/                  # Chat UI: MessageList, MessageBubble, ChatInput,
│   │                          #   FlashcardsPanel, SummaryPanel, UploadPanel
│   ├── assessments/           # AssessmentForm dialog, ReminderBanner
│   └── ui/                    # shadcn/ui primitives — do not edit manually
├── hooks/
│   ├── useAuth.ts             # Login, register, logout mutations
│   ├── useChat.ts             # Chat history query + send message mutation
│   ├── useDashboard.ts        # Dashboard stats queries
│   ├── useStudyTools.ts       # Material upload + processing poll + flashcards/summary
│   └── useAssessments.ts      # Assessment CRUD with React Query
├── lib/
│   ├── auth.ts                # JWT decode utility (getUserId)
│   └── utils.ts               # cn() class merging utility
├── pages/
│   ├── Login.tsx              # Sign-in / sign-up toggle
│   ├── Dashboard.tsx          # Stats, recent chats, recent materials
│   ├── Chat.tsx               # Chat + study tools split layout
│   └── Assessments.tsx        # Assessment list with upcoming/completed sections
├── routes/
│   └── ProtectedRoute.tsx     # Redirects to /login if no token in localStorage
├── services/
│   ├── auth.service.ts        # /auth/login, /auth/register
│   ├── chat.service.ts        # /ai/chat, /ai/chats
│   ├── material.service.ts    # /materials/upload, /materials/user
│   ├── assessment.service.ts  # /assessments CRUD
│   └── ai.service.ts          # /ai/flashcards, /ai/summary, /ai/ask
├── types/                     # TypeScript interfaces (one file per domain)
└── App.tsx                    # BrowserRouter + route definitions
```

## Routes

| Path | Access | Page |
|---|---|---|
| `/login` | Public | Sign-in / sign-up |
| `/` | Protected | Dashboard |
| `/chat/new` | Protected | Start a new chat |
| `/chat/:chatId` | Protected | Continue an existing chat |
| `/assessments` | Protected | Assessment manager |

## Getting Started

### Prerequisites

- Node.js 18+
- The FastAPI backend running at `http://127.0.0.1:8000`

### Installation

```bash
npm install
```

### Environment

Create a `.env` file in the project root:

```env
VITE_API_URL=http://127.0.0.1:8000/api/v1
```

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
npm run preview
```

### Linting

```bash
npm run lint
```

## Architecture Notes

### Auth

- JWT stored in `localStorage` under `token`
- The Axios interceptor in [src/api/client.ts](src/api/client.ts) attaches `Authorization: Bearer <token>` to every request and redirects to `/login` on a 401 response
- `getUserId()` in [src/lib/auth.ts](src/lib/auth.ts) decodes the JWT payload to extract the user ID (reads `.sub`)

### State Management

React Query owns all server state. Custom hooks in `src/hooks/` wrap service functions in `useQuery` (reads) and `useMutation` (writes). Components never call service functions directly.

### Adding a Feature

1. Add types to `src/types/<domain>.ts`
2. Add API calls to `src/services/<domain>.service.ts`
3. Wrap in a React Query hook at `src/hooks/use<Feature>.ts`
4. Build the page at `src/pages/<Feature>.tsx`
5. Register the route in `src/App.tsx`
6. Add a nav item in `src/components/AppSidebar.tsx`

### Styling

Tailwind v4 — no `tailwind.config.js`. All theme tokens (colors, radius, sidebar width) are defined as CSS variables in `src/index.css` using the `@theme` block. The color palette uses `oklch`. Use `cn()` from `@/lib/utils` for conditional classnames. Install missing shadcn components with `npx shadcn@latest add <component>` — do not edit files inside `src/components/ui/` manually.

## Backend API

Base URL: `http://127.0.0.1:8000/api/v1`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/login` | Login → `{ access_token, message, token_type }` |
| POST | `/auth/register` | Register → `{ message, user_id }` |
| POST | `/ai/chat` | Start a new chat |
| POST | `/ai/ask/{chat_id}` | Send a message to an existing chat |
| GET | `/ai/chat/{chat_id}` | Get chat history |
| GET | `/ai/chats` | Get all chats for the current user |
| GET | `/ai/flashcards/{chat_id}` | Get generated flashcards |
| GET | `/ai/summary/{chat_id}` | Get generated summary |
| POST | `/materials/upload` | Upload a `.pptx` file (`multipart/form-data`) |
| GET | `/materials/user/all` | Get all materials for the current user |
| GET | `/materials/{material_id}` | Get a single material |
| GET | `/assessments/` | List assessments (paginated) |
| POST | `/assessments/` | Create an assessment |
| GET | `/assessments/{id}` | Get a single assessment |
| PATCH | `/assessments/{id}` | Update an assessment |
| PATCH | `/assessments/{id}/complete` | Mark assessment as complete |
| DELETE | `/assessments/{id}` | Delete an assessment |
