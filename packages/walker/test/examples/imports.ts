const lines = {
    import: [
        "import './import';",
        "import foo1 from './importDefault';",
        "import { default as foo2 } from './importDefaultRename';",
        "import { foo, bar } from './importSome';",
        "import { default as foo3, bar as bar1 } from './importRenames';",
        "import * as foobar from './importAll';"
    ],

    dynamicImport: [
        "import('./dynamicImport');",
        "import('./dynamicImport' + 'plus')",
        "import('./dynamicImport' + x + 'wildcard')"
    ],

    awaitDynamicImport: [
        "const async1 = async () => await import('./dynamicImportAwait');",
        "const async2 = async () => await import('./dynamicImportAwait' + 'plus');",
        "const async3 = async () => await import('./dynamicImportAwait' + x + 'wildcard');"
    ],

    dynamicImportThen: [
        "import('./dynamicImportThen').then(() => {});",
        "import('./dynamicImportThen' + 'plus').then(() => {});",
        "import('./dynamicImportThen' + x + 'wildcard').then(() => {});"
    ],

    require: [
        "require('./require');",
        "require('./require' + 'plus')",
        "require('./require' + x + 'wildcard')"
    ],

    requireResolve: [
        "require.resolve('requireResolve');",
        "require.resolve('requireResolve' + 'plus');",
        "require.resolve('requireResolve' + x + 'plus');"
    ],

    requireEnsure: [
        "require.ensure(['./requireEnsure'], () => {});"
    ],

    requireContext: [
        "require.context('./requireContext');"
    ],

    tsImportRequire: [
        "import foo = require('tsImportRequire')"
    ]
};

export default lines;