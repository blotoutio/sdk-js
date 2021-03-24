import resolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import alias from '@rollup/plugin-alias'
import visualizer from 'rollup-plugin-visualizer'
import define from 'rollup-plugin-define'
import copy from 'rollup-plugin-copy'
import { terser } from 'rollup-plugin-terser'
import gzipPlugin from 'rollup-plugin-gzip'
import cleaner from 'rollup-plugin-cleaner'
import generatePackageJson from 'rollup-plugin-generate-package-json'
import jscc from 'rollup-plugin-jscc'
import serve from 'rollup-plugin-serve'
import path from 'path'
import pkg from './package.json'

const defaultPlugins = (feature, env) => {
  return [
    alias({
      entries: {
        '@blotoutio/sdk-core': '../../sdk-core/dist',
        '@blotoutio/sdk-personal': '../../sdk-personal/dist',
      },
    }),
    resolve(),
    commonjs(),
    jscc({
      values: { _FEATURES: feature },
    }),
    define({
      replacements: {
        'process.env.PACKAGE_VERSION': JSON.stringify(
          process.env.npm_package_version
        ),
        'process.env.NODE_ENV': JSON.stringify(env),
      },
    }),
  ]
}

const createConfig = ({ prod, stats, gzip, feature }) => {
  const name = `index${feature === 'full' ? '.full' : ''}${
    prod ? '.min' : ''
  }.js`

  const config = {
    input: './index.js',
    output: {
      name: 'BlotoutSDK',
      file: `dist/${name}`,
      format: 'umd',
      sourcemap: true,
    },
    plugins: defaultPlugins(feature, prod ? 'production' : 'development'),
  }

  if (gzip) {
    config.plugins.push(gzipPlugin())
  }

  if (prod) {
    config.plugins.push(terser())
  }

  if (stats) {
    config.plugins.push(
      visualizer({
        filename: `dist/stats${gzip ? '-gzip' : ''}.json`,
        json: true,
      })
    )
  }

  return config
}

const getDev = (watch) => {
  return {
    input: './index.js',
    output: {
      name: 'BlotoutSDK',
      file: `dist/index.full.js`,
      format: 'umd',
      sourcemap: true,
    },
    plugins: [
      cleaner({
        targets: ['./dist/'],
      }),
      ...defaultPlugins('full', 'development'),
      copy({
        targets: [{ src: './demo/*', dest: './dist' }],
      }),
      ...(watch
        ? [
            serve({
              port: 9000,
              contentBase: path.join(__dirname, './dist'),
            }),
          ]
        : []),
    ],
  }
}

module.exports = (commandLineArgs) => {
  delete pkg.devDependencies
  delete pkg.scripts

  if (commandLineArgs.watch || commandLineArgs.configDev) {
    return getDev(commandLineArgs.watch)
  }

  const prepare = {
    input: './index.js',
    plugins: [
      cleaner({
        targets: ['./dist/'],
      }),
      generatePackageJson({
        outputFolder: './dist/',
        baseContents: pkg,
      }),
      copy({
        targets: [
          { src: './README.md', dest: './dist/' },
          { src: './LICENSE', dest: './dist/' },
        ],
      }),
    ],
  }

  return [
    prepare,
    createConfig({
      feature: 'basic',
    }),
    createConfig({
      feature: 'basic',
      prod: true,
      stats: true,
    }),
    createConfig({
      feature: 'basic',
      prod: true,
      stats: true,
      gzip: true,
    }),
    createConfig({
      feature: 'full',
    }),
    createConfig({
      feature: 'full',
      prod: true,
      stats: true,
    }),
    createConfig({
      feature: 'full',
      prod: true,
      stats: true,
      gzip: true,
    }),
  ]
}
