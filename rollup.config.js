import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import pkg from './package.json'
// import { terser } from 'rollup-plugin-terser'
// import babel from 'rollup-plugin-babel'

export default [
  // browser-friendly UMD build
  {
    input: 'src/index.js',
    output: {
      name: pkg.name,
      file: pkg.browser,
      format: 'umd'
    },
    plugins: [
      resolve(), // so Rollup can find `ms`
      // babel({
      //   presets: [['@babel/preset-env', { modules: false }]],
      //   exclude: 'node_modules/**' // only transpile our source code
      // }),
      commonjs() // so Rollup can convert `ms` to an ES module
    ]
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  {
    input: 'src/index.js',
    // external: ['ms'],
    output: [
      { file: pkg.main, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins: [
      // babel({
      //   presets: [['@babel/preset-env', { modules: false }]],
      //   exclude: 'node_modules/**',
      // }),
      // terser()
    ]
  }
]