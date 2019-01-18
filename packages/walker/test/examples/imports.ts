const lines = ["import './exports';",
    "import foo1 from './exports';",
    "import { default as foo2 } from './exports';",
    "import { foo, bar } from './exports';",
    "import { default as foo3, bar as bar1 } from './exports';",
    "import * as foobar from './exports';",
    "",
    "import('./exports');",
    "const asyncFah = async() => await import('./exports');",
    "import('./exports').then(() => {});",
    "",
    "require('./exports');",
    "",
    "require.ensure(['./exports'], () => {});",
    "require.context('./exports');"];

export default lines.join('\n');