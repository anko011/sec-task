import react from '@zemd/eslint-react';

export default [
    ...react(),
    {
        rules: {
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            'react/prefer-read-only-props': 'off',
            'react/no-unstable-nested-components': 'off',
            'jsx-a11y/label-has-associated-control': 'off',
            'no-restricted-syntax': 'off',
            '@typescript-eslint/promise-function-async': 'off',
            '@typescript-eslint/no-unnecessary-condition': 'off'
        }
    }
];
