import '@radix-ui/themes/styles.css';
import './styles.css';

import { RouterProvider } from 'react-router';

import { router } from './router';

function App() {
    return <RouterProvider router={router} />;
}

export default App;
