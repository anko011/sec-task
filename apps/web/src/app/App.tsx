import '@radix-ui/themes/styles.css';
import './styles.css';

import { Theme } from '@radix-ui/themes';
import { BrowserRouter } from 'react-router';

import { ApplicationRouter } from './router';

function App() {
    return (
        <Theme appearance="dark" panelBackground="translucent">
            <BrowserRouter>
                <ApplicationRouter />
            </BrowserRouter>
        </Theme>
    );
}

export default App;
