import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App';

const root = document.getElementById('root');
if (root == null) throw new Error('No root provided');

createRoot(root).render(
    <StrictMode>
        <App />
    </StrictMode>
);
