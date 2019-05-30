import { ParserOptions } from '@babel/parser';
const babelParserOptions: ParserOptions = {
    sourceType: 'module',
    plugins: [
        'typescript',
        'dynamicImport',
        'jsx',
        ['decorators', { 'decoratorsBeforeExport': true, }],
        'asyncGenerators',
        'classProperties',
        'doExpressions',
        'functionBind',
        'functionSent',
        'numericSeparator',
        'objectRestSpread',
        'optionalCatchBinding',
        'optionalChaining'
    ]
}

export default babelParserOptions;
