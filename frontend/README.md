# AccessTech Frontend

This is the frontend client for the **AccessTech** intelligence learning ecosystem. Built with React, Vite, and Tailwind CSS.

## Features
- **Responsive & Accessible UI**: Dark/Light mode support via `next-themes` and High Contrast themes.
- **Multilingual Support**: Real-time localization in English, Tamil, and Hindi via `react-i18next`.
- **Dynamic Routing**: Managed by React Router v7.
- **State Management**: Context-based global accessibility and authentication state.

## Installation & Setup

1. Install module dependencies:
```bash
npm install
```

2. Run the development server locally:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
```

## Dependencies Highlights
- **UI Components:** Shadcn UI, Radix UI Primitives, Lucide Icons, React Icons.
- **Styling:** Tailwind CSS, `tailwind-merge`, `clsx`, `tailwindcss-animate`.
- **HTTP Client:** Axios hooked to the FastAPI backend.
- **PDF Generation:** Triggered directly via API calls to backend services, handling multilingual Indic scripts properly.

## Build and Deployment
Please refer to the root `README.md` for full project deployment instructions on platforms such as Vercel.
