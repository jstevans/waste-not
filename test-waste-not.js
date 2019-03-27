const { default: wastenot } = require('waste-not/dist/waste-not/lib/index');

const config = {
    files: ['packages/**/*.*', 'node_modules/**/*', '*.js', '*.json', '*.lock'], 
    tsConfig: './tsconfig.json'
}

console.log("STARTED");

const start = new Date(); 
wastenot(config).then(a => {
    const end = new Date(); 
    console.log('DONE');
    debugger; 
})
