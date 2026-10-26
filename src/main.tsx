import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { CursorProvider } from './context/CursorContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CursorProvider>
      <App />
    </CursorProvider>
  </StrictMode>,
);
