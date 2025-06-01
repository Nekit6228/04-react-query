import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './components/App/App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import 'modern-normalize/modern-normalize.css';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';


const queryClient = new QueryClient();

createRoot(document.getElementById('root') as  HTMLDivElement).render(
  <QueryClientProvider client={queryClient}>
  <StrictMode>
    <App />
    <ReactQueryDevtools initialIsOpen={true} />
  </StrictMode>,
  </QueryClientProvider>
  
)