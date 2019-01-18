import { ParserOptions } from '@babel/parser';
const babelParserOptions: ParserOptions = {
    sourceType: 'module',
    plugins: [
        'typescript',
        'dynamicImport',
    ]
}

export default babelParserOptions;