# YouTube Sentiment Dashboard

React and Vite frontend for the YouTube comment analyzer.

## Local development

```bash
npm ci
npm run dev -- --port 5173
```

Copy `.env.example` to `.env` when the backend is not running at the default
`http://127.0.0.1:8000` address.

## Validation

```bash
npm test
npm run lint
npm run build
```

## Docker

The multi-stage Docker image builds the Vite application and serves it through
Nginx. In the full Compose stack, Nginx proxies `/api` to the backend so the
browser uses a single origin. See `DOCKER.md` in the backend repository for the
complete setup.

The remaining sections are the original Vite reference notes.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# yt-sentiment-dashboard-backend
