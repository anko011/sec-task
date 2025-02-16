import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from './App';

describe('App', () => {
    it('Should be able to create a new task', async () => {
        const { debug, getByText } = render(<App />);
        expect(getByText(/count is/i)).toBeInTheDocument();
        debug();
    });
});
