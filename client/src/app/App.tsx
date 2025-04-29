import '@radix-ui/themes/styles.css';
import './styles.css';

import { BrowserRouter } from 'react-router';

import { ThemeProvider } from '~/features/themes/change';

import { ApplicationRouter } from './router';

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <ApplicationRouter />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
