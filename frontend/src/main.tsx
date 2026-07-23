import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AdminApp } from './admin/AdminApp';
import './styles/index.css';

// A tiny path-based switch keeps the portfolio and the admin area in one SPA
// without pulling in a full router. Vite's dev server and preview both serve
// index.html for /admin (SPA fallback), so a hard refresh there works too.
const isAdmin = window.location.pathname.replace(/\/+$/, '').startsWith('/admin');

createRoot(document.getElementById('root')!).render(
  <StrictMode>{isAdmin ? <AdminApp /> : <App />}</StrictMode>,
);
