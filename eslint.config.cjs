module.exports = [
    {
        files: ["**/*.js", "**/*.jsx"],
        languageOptions: {
            parser: require('@babel/eslint-parser'),
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                },
                requireConfigFile: false,
                babelOptions: {
                    presets: [require('@babel/preset-react')]
                }
            },
            globals: {
                "React": "readonly"
            }
        },
        plugins: {
            react: require('eslint-plugin-react')
        }
    }
];