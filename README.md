# Majlis

A React 19 + TypeScript + Vite app with routing, i18n, theme toggling, and data-fetching helpers. The project is structured by feature and shared components to keep teams aligned as it grows.

## Tech Stack

- React 19 + Vite 8
- TypeScript
- React Router
- TanStack Query
- i18next + react-i18next
- Tailwind CSS (with shadcn/ui utilities)
- Zod + React Hook Form
- Sonner (toasts)

## Getting Started

```bash
npm install
npm run dev
```

## Scripts

- `npm run dev` Start the Vite dev server
- `npm run build` Type-check and build for production
- `npm run preview` Preview the production build
- `npm run lint` Run ESLint

## Project Structure

```
.
├── public/
├── src/
│   ├── assets/                 # Static assets (images, icons)
│   ├── components/             # Shared UI and app-level components
│   │   ├── common/             # Common widgets (language, theme, etc.)
│   │   ├── context/            # React context providers
│   │   ├── DevTools/           # Development-only tools
│   │   ├── feedbacks/          # Loading, error, and empty states
│   │   ├── providers/          # App providers (query, theme, etc.)
│   │   └── ui/                 # Reusable UI primitives (shadcn-style)
│   ├── constants/              # App-wide constants and configs
│   ├── features/               # Feature-based modules
│   │   ├── friends/
│   │   └── posts/
│   │       ├── components/
│   │       ├── constants/
│   │       ├── hooks/
│   │       ├── services/
│   │       └── types/
│   ├── hooks/                  # Shared custom hooks
│   ├── lib/                    # Utilities and helpers
│   ├── pages/                  # Route pages
│   ├── routes/                 # Router configuration
│   ├── services/               # API clients and base fetchers
│   ├── translations/           # i18n resources
│   │   ├── ar/
│   │   └── en/
│   ├── types/                  # Shared TypeScript types
│   ├── i18n.ts                 # i18n setup
│   ├── index.css               # Global styles
│   └── main.tsx                # App entry point
├── components.json             # shadcn/ui config
├── eslint.config.js            # ESLint config
├── index.html                  # Vite HTML template
├── package.json
├── tsconfig*.json
└── vite.config.ts
```

## Notes for Teammates

- Add new functionality inside `src/features/<feature-name>`.
- Put shared components in `src/components` and shared hooks in `src/hooks`.
- Add translations to `src/translations/en` and `src/translations/ar`.
