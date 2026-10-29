import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
import './styles/fonts.css';
import './styles/styles.css';

const qc = new QueryClient({
  defaultOptions: { queries: { staleTime: 60 * 60 * 1000, retry: false, refetchOnWindowFocus: false } },
});

// HashRouter: URLs look like /#/info/ror1b, so Spring Boot needs no extra routing config.
createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={qc}>
      <HashRouter>
        <App />
      </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>,
);
