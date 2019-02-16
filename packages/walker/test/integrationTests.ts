import * as babelParser from '@babel/parser';
import walkFile from '../lib/walkFile';
import visitors from '../../visitors/lib/visitors';

const babelParserOptions: babelParser.ParserOptions = {
    sourceType: 'module',
    plugins: [
        'typescript',
        'dynamicImport',
    ]
};

describe("import", () => {
    it("import './import';", () => {
        const importLine = "import './import';";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })

    it("import foo1 from './importDefault';", () => {
        const importLine = "import foo1 from './importDefault';";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })

    it("import { default as foo2 } from './importDefaultRename';", () => {
        const importLine = "import { default as foo2 } from './importDefaultRename';";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })

    it("import { foo, bar } from './importSome';", () => {
        const importLine = "import { foo, bar } from './importSome';";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })

    it("import { default as foo3, bar as bar1 } from './importRenames';", () => {
        const importLine = "import { default as foo3, bar as bar1 } from './importRenames';";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })

    it("import * as foobar from './importAll';", () => {
        const importLine = "import * as foobar from './importAll';";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })
})

describe("dynamicImport", () => {
    it("import('./dynamicImport');", () => {
        const importLine = "import('./dynamicImport');";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })

    it("import('./dynamicImport' + 'plus')", () => {
        const importLine = "import('./dynamicImport' + 'plus')";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })

    it("import('./dynamicImport' + x + 'wildcard')", () => {
        const importLine = "import('./dynamicImport' + x + 'wildcard')";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })
})

describe("awaitDynamicImport", () => {
    it("const async1 = async () => await import('./dynamicImportAwait');", () => {
        const importLine = "const async1 = async () => await import('./dynamicImportAwait');";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })

    it("const async2 = async () => await import('./dynamicImportAwait' + 'plus');", () => {
        const importLine = "const async2 = async () => await import('./dynamicImportAwait' + 'plus');";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })

    it("const async3 = async () => await import('./dynamicImportAwait' + x + 'wildcard');", () => {
        const importLine = "const async3 = async () => await import('./dynamicImportAwait' + x + 'wildcard');";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })
})

describe("dynamicImportThen", () => {
    it("import('./dynamicImportThen').then(() => {});", () => {
        const importLine = "import('./dynamicImportThen').then(() => {});";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })

    it("import('./dynamicImportThen' + 'plus').then(() => {});", () => {
        const importLine = "import('./dynamicImportThen' + 'plus').then(() => {});";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })

    it("import('./dynamicImportThen' + x + 'wildcard').then(() => {});", () => {
        const importLine = "import('./dynamicImportThen' + x + 'wildcard').then(() => {});";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })
})

describe("require", () => {
    it("require('./require');", () => {
        const importLine = "require('./require');";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })

    it("require('./require' + 'plus')", () => {
        const importLine = "require('./require' + 'plus')";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })

    it("require('./require' + x + 'wildcard')", () => {
        const importLine = "require('./require' + x + 'wildcard')";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })
})

describe("requireResolve", () => {
    it("require.resolve('requireResolve');", () => {
        const importLine = "require.resolve('requireResolve');";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })

    it("require.resolve('requireResolve' + 'plus');", () => {
        const importLine = "require.resolve('requireResolve' + 'plus');";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })

    it("require.resolve('requireResolve' + x + 'plus');", () => {
        const importLine = "require.resolve('requireResolve' + x + 'plus');";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })
})

describe("requireEnsure", () => {
    it("require.ensure(['./requireEnsure'], () => {});", () => {
        const importLine = "require.ensure(['./requireEnsure'], () => {});";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })
})

describe("requireContext", () => {
    it("require.context('./requireContext');", () => {
        const importLine = "require.context('./requireContext');";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })
})

describe("tsImportRequire", () => {
    it("import foo = require('tsImportRequire')", () => {
        const importLine = "import foo = require('tsImportRequire')";
        const file = babelParser.parse(
            importLine, babelParserOptions);
        const result = walkFile(file, visitors);

        expect(result.dependencies).toHaveLength(1);
    })
})