import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import jscc from 'rollup-plugin-jscc'
import visualizer from 'rollup-plugin-visualizer'
import define from 'rollup-plugin-define'
import copy from 'rollup-plugin-copy'
import serve from 'rollup-plugin-serve'
import path from 'path'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import gzipPlugin from 'rollup-plugin-gzip'
import cleaner from 'rollup-plugin-cleaner'
import generatePackageJson from 'rollup-plugin-generate-package-json'
import fs from 'fs'

module.exports = (commandLineArgs) => {
  const regularName = `index`

  const data = JSON.parse(
    fs.readFileSync('./package.json', {
      flag: 'r',
    })
  )

  delete data.devDependencies
  delete data.scripts

  const prepare = {
    input: './src/index.js',
    plugins: [
      cleaner({
        targets: ['./dist/'],
      }),
      generatePackageJson({
        outputFolder: './dist/',
        baseContents: data,
      }),
      copy({
        targets: [
          { src: './src/index.js', dest: './dist/' },
          { src: './src/typings/*', dest: './dist/' },
          { src: './README.md', dest: './dist/' },
          { src: './LICENSE', dest: './dist/' },
        ],
      }),
    ],
  }

  const plugins = [
    resolve(),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: false,
    }),
  ]

  let demo = [...plugins]

  if (commandLineArgs.configDev) {
    demo = [
      ...demo,
      copy({
        targets: [{ src: './src/demo/*', dest: './dist' }],
      }),
    ]
  }

  if (commandLineArgs.watch) {
    demo = [
      ...demo,
      serve({
        port: 9000,
        contentBase: path.join(__dirname, './dist'),
      }),
      livereload(),
    ]
  }

  const cjsDevBasic = {
    input: './src/index.ts',
    output: {
      file: `dist/cjs/${regularName}.development.js`,
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      ...plugins,
      jscc({
        values: { _FEATURES: 'basic' },
      }),
      define({
        replacements: {
          'process.env.PACKAGE_VERSION': JSON.stringify(
            process.env.npm_package_version
          ),
          'process.env.NODE_ENV': JSON.stringify('development'),
        },
      }),
    ],
  }

  const cjsDevFull = {
    input: './src/index.ts',
    output: {
      file: `dist/cjs/${regularName}.full.development.js`,
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      ...demo,
      jscc({
        values: { _FEATURES: 'full' },
      }),
      define({
        replacements: {
          'process.env.PACKAGE_VERSION': JSON.stringify(
            process.env.npm_package_version
          ),
          'process.env.NODE_ENV': JSON.stringify('development'),
        },
      }),
    ],
  }

  const cjsProdBasic = {
    input: './src/index.ts',
    output: {
      file: `dist/cjs/${regularName}.production.min.js`,
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      ...plugins,
      jscc({
        values: { _FEATURES: 'basic' },
      }),
      terser(),
      define({
        replacements: {
          'process.env.PACKAGE_VERSION': JSON.stringify(
            process.env.npm_package_version
          ),
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
      }),
    ],
  }

  const cjsProdFull = {
    input: './src/index.ts',
    output: {
      file: `dist/cjs/${regularName}.full.production.min.js`,
      format: 'cjs',
      sourcemap: true,
    },
    plugins: [
      ...plugins,
      jscc({
        values: { _FEATURES: 'full' },
      }),
      terser(),
      define({
        replacements: {
          'process.env.PACKAGE_VERSION': JSON.stringify(
            process.env.npm_package_version
          ),
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
      }),
    ],
  }

  const cjsConfig = [cjsDevBasic, cjsDevFull, cjsProdBasic, cjsProdFull]

  const esmDevBasic = {
    input: './src/index.ts',
    output: {
      file: `dist/esm/${regularName}.development.js`,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      ...plugins,
      jscc({
        values: { _FEATURES: 'basic' },
      }),
      define({
        replacements: {
          'process.env.PACKAGE_VERSION': JSON.stringify(
            process.env.npm_package_version
          ),
          'process.env.NODE_ENV': JSON.stringify('development'),
        },
      }),
    ],
  }

  const esmDevFull = {
    input: './src/index.ts',
    output: {
      file: `dist/esm/${regularName}.full.development.js`,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      ...plugins,
      jscc({
        values: { _FEATURES: 'full' },
      }),
      define({
        replacements: {
          'process.env.PACKAGE_VERSION': JSON.stringify(
            process.env.npm_package_version
          ),
          'process.env.NODE_ENV': JSON.stringify('development'),
        },
      }),
    ],
  }

  const esmProdBasic = {
    input: './src/index.ts',
    output: {
      file: `dist/esm/${regularName}.production.min.js`,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      ...plugins,
      jscc({
        values: { _FEATURES: 'basic' },
      }),
      terser(),
      define({
        replacements: {
          'process.env.PACKAGE_VERSION': JSON.stringify(
            process.env.npm_package_version
          ),
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
      }),
    ],
  }

  const esmProdFull = {
    input: './src/index.ts',
    output: {
      file: `dist/esm/${regularName}.full.production.min.js`,
      format: 'esm',
      sourcemap: true,
    },
    plugins: [
      ...plugins,
      jscc({
        values: { _FEATURES: 'full' },
      }),
      terser(),
      define({
        replacements: {
          'process.env.PACKAGE_VERSION': JSON.stringify(
            process.env.npm_package_version
          ),
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
      }),
    ],
  }

  const esmConfig = [esmDevBasic, esmDevFull, esmProdBasic, esmProdFull]

  const umdDevBasic = {
    input: './src/common/api.module.ts',
    output: {
      name: 'jsPackage',
      file: `dist/umd/${regularName}.development.js`,
      format: 'umd',
      sourcemap: true,
    },
    plugins: [
      ...plugins,
      jscc({
        values: { _FEATURES: 'basic' },
      }),
      define({
        replacements: {
          'process.env.PACKAGE_VERSION': JSON.stringify(
            process.env.npm_package_version
          ),
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
      }),
    ],
  }

  const umdDevFull = {
    input: './src/common/api.module.ts',
    output: {
      name: 'jsPackage',
      file: `dist/umd/${regularName}.full.development.js`,
      format: 'umd',
      sourcemap: true,
    },
    plugins: [
      ...plugins,
      jscc({
        values: { _FEATURES: 'full' },
      }),
      define({
        replacements: {
          'process.env.PACKAGE_VERSION': JSON.stringify(
            process.env.npm_package_version
          ),
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
      }),
    ],
  }

  const umdProdBasic = {
    input: './src/common/api.module.ts',
    output: {
      name: 'jsPackage',
      file: `dist/umd/${regularName}.production.min.js`,
      format: 'umd',
      sourcemap: true,
    },
    plugins: [
      ...plugins,
      jscc({
        values: { _FEATURES: 'basic' },
      }),
      terser(),
      define({
        replacements: {
          'process.env.PACKAGE_VERSION': JSON.stringify(
            process.env.npm_package_version
          ),
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
      }),
      visualizer({
        filename: 'dist/umd/stats-basic.json',
        json: true,
      }),
    ],
  }

  const umdProdFull = {
    input: './src/common/api.module.ts',
    output: {
      name: 'jsPackage',
      file: `dist/umd/${regularName}.full.production.min.js`,
      format: 'umd',
      sourcemap: true,
    },
    plugins: [
      ...plugins,
      jscc({
        values: { _FEATURES: 'full' },
      }),
      terser(),
      define({
        replacements: {
          'process.env.PACKAGE_VERSION': JSON.stringify(
            process.env.npm_package_version
          ),
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
      }),
      visualizer({
        filename: 'dist/umd/stats-full.json',
        json: true,
      }),
    ],
  }

  const umdProdBasicGzip = {
    input: './src/common/api.module.ts',
    output: {
      name: 'jsPackage',
      file: `dist/umd/${regularName}.production.min.js`,
      format: 'umd',
      sourcemap: true,
    },
    plugins: [
      ...plugins,
      jscc({
        values: { _FEATURES: 'basic' },
      }),
      terser(),
      gzipPlugin(),
      define({
        replacements: {
          'process.env.PACKAGE_VERSION': JSON.stringify(
            process.env.npm_package_version
          ),
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
      }),
      visualizer({
        filename: 'dist/umd/stats-basic-gzip.json',
        json: true,
      }),
    ],
  }

  const umdProdFullGzip = {
    input: './src/common/api.module.ts',
    output: {
      name: 'jsPackage',
      file: `dist/umd/${regularName}.full.production.min.js`,
      format: 'umd',
      sourcemap: true,
    },
    plugins: [
      ...plugins,
      jscc({
        values: { _FEATURES: 'full' },
      }),
      terser(),
      gzipPlugin(),
      define({
        replacements: {
          'process.env.PACKAGE_VERSION': JSON.stringify(
            process.env.npm_package_version
          ),
          'process.env.NODE_ENV': JSON.stringify('production'),
        },
      }),
      visualizer({
        filename: 'dist/umd/stats-full-gzip.json',
        json: true,
      }),
    ],
  }

  const umdConfig = [
    umdDevBasic,
    umdDevFull,
    umdProdBasic,
    umdProdFull,
    umdProdBasicGzip,
    umdProdFullGzip,
  ]

  if (commandLineArgs.configDev) {
    return [prepare, cjsDevFull]
  }

  return [prepare, ...cjsConfig, ...esmConfig, ...umdConfig]
}
