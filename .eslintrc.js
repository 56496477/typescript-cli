module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:react/recommended',
        'plugin:prettier/recommended',
        'plugin:react-hooks/recommended'
    ],
    plugins: ['@typescript-eslint'],
    env: {
        browser: true,
        es6: true,
        amd: true,
        browser: true
    },
    settings: {
        react: {
            version: 'detect' // React version. "detect" automatically picks the version you have installed.
        }
    },
    rules: {
        // 禁止使用 var
        'no-var': 'error',
        // 优先使用 interface 而不是 type
        '@typescript-eslint/consistent-type-definitions': [
            'error',
            'interface'
        ],
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/camelcase': 'off',
        'react/display-name': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'react/prop-types': 'off',
        'no-use-before-define': ['error', { variables: false }]
    }
};
