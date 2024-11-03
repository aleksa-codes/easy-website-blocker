import React from 'react';
import ReactDOM from 'react-dom/client';
import { Blocked } from '@/blocked/blocked';
import '@/index.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Blocked />
  </React.StrictMode>,
);
