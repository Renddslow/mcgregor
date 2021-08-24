const mri = require('mri');

const pkg = require('./package.json');

const prog = mri(process.argv.slice(2), {
  boolean: ['watch'],
});

require('esbuild').build({
  entryPoints: ['src/index.ts'],
  bundle: true,
  outdir: 'dist',
  platform: 'node',
  format: 'cjs',
  minify: true,
  watch: prog.watch,
  external: [...Object.keys(pkg.devDependencies), ...Object.keys(pkg.dependencies)],
});
