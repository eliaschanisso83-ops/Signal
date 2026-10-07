import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/tokens.css';
import './styles/base.css';
import './design-system/ds.css';
import './styles/pages.css';
import './styles/landing.css';
import App from './App.tsx';
import { initI18n } from './i18n';

/* Inicializa o i18n antes do primeiro render: o idioma-fonte (en) está no
 * bundle, então a pintura inicial nunca aparece sem texto. */
await initI18n();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
