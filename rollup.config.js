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

  const plugins = [
    resolve(),
    commonjs(),
    typescript({
      useTsconfigDeclarationDir: false,
    }),
    ...(!commandLineArgs.configDev
      ? [
          cleaner({
            targets: ['./dist/*'],
          }),
        ]
      : []),
  ]

  const cjsPlugins = [
    ...plugins,
    visualizer({
      filename: 'dist/cjs/stats.json',
      json: true,
    }),
    ...(commandLineArgs.configDev
      ? [
          copy({
            targets: [{ src: './src/demo/*', dest: './dist' }],
          }),
          serve({
            port: 9000,
            contentBase: path.join(__dirname, './dist'),
          }),
          livereload(),
        ]
      : []),
  ]

  const cjsConfig = [
    {
      input: './src/index.ts',
      output: {
        file: `dist/cjs/${regularName}.development.js`,
        format: 'cjs',
        sourcemap: true,
      },
      plugins: [
        ...cjsPlugins,
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
    },
    {
      input: './src/index.ts',
      output: {
        file: `dist/cjs/${regularName}.full.development.js`,
        format: 'cjs',
        sourcemap: true,
      },
      plugins: [
        ...cjsPlugins,
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
    },
    {
      input: './src/index.ts',
      output: {
        file: `dist/cjs/${regularName}.production.min.js`,
        format: 'cjs',
        sourcemap: true,
      },
      plugins: [
        ...cjsPlugins,
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
    },
    {
      input: './src/index.ts',
      output: {
        file: `dist/cjs/${regularName}.full.production.min.js`,
        format: 'cjs',
        sourcemap: true,
      },
      plugins: [
        ...cjsPlugins,
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
    },
    {
      input: './src/index.ts',
      output: {
        file: `dist/cjs/${regularName}.production.min.g.js`,
        format: 'cjs',
        sourcemap: true,
      },
      plugins: [
        ...cjsPlugins,
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
      ],
    },
    {
      input: './src/index.ts',
      output: {
        file: `dist/cjs/${regularName}.full.production.min.g.js`,
        format: 'cjs',
        sourcemap: true,
      },
      plugins: [
        ...cjsPlugins,
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
      ],
    },
  ]

  const esmConfig = [
    {
      input: './src/index.ts',
      output: {
        file: `dist/esm/${regularName}.development.js`,
        format: 'esm',
        sourcemap: true,
      },
      plugins: [
        ...plugins,
        visualizer({
          filename: 'dist/esm/stats.json',
          json: true,
        }),
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
    },
    {
      input: './src/index.ts',
      output: {
        file: `dist/esm/${regularName}.full.development.js`,
        format: 'esm',
        sourcemap: true,
      },
      plugins: [
        ...plugins,
        visualizer({
          filename: 'dist/esm/stats.json',
          json: true,
        }),
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
    },
    {
      input: './src/index.ts',
      output: {
        file: `dist/esm/${regularName}.production.min.js`,
        format: 'esm',
        sourcemap: true,
      },
      plugins: [
        ...plugins,
        visualizer({
          filename: 'dist/esm/stats.json',
          json: true,
        }),
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
    },
    {
      input: './src/index.ts',
      output: {
        file: `dist/esm/${regularName}.full.production.min.js`,
        format: 'esm',
        sourcemap: true,
      },
      plugins: [
        ...plugins,
        visualizer({
          filename: 'dist/esm/stats.json',
          json: true,
        }),
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
    },
    {
      input: './src/index.ts',
      output: {
        file: `dist/esm/${regularName}.production.min.g.js`,
        format: 'esm',
        sourcemap: true,
      },
      plugins: [
        ...plugins,
        visualizer({
          filename: 'dist/esm/stats.json',
          json: true,
        }),
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
      ],
    },
    {
      input: './src/index.ts',
      output: {
        file: `dist/esm/${regularName}.full.production.min.g.js`,
        format: 'esm',
        sourcemap: true,
      },
      plugins: [
        ...plugins,
        visualizer({
          filename: 'dist/esm/stats.json',
          json: true,
        }),
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
      ],
    },
  ]

  const umdConfig = [
    {
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
        visualizer({
          filename: 'dist/umd/stats.json',
          json: true,
        }),
      ],
    },
    {
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
        visualizer({
          filename: 'dist/umd/stats.json',
          json: true,
        }),
      ],
    },
    {
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
          filename: 'dist/umd/stats.json',
          json: true,
        }),
      ],
    },
    {
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
          filename: 'dist/umd/stats.json',
          json: true,
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
    },
  ]

  const config = cjsConfig.concat(esmConfig).concat(umdConfig)

  return config
}
