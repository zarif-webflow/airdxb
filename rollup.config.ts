import { defineConfig } from 'rollup';
import cjsPlugin from '@rollup/plugin-commonjs';
import reslovePlugin from '@rollup/plugin-node-resolve';
import replacePlugin from '@rollup/plugin-replace';
import tsPlugin from '@rollup/plugin-typescript';
import esbuildPlugin from 'rollup-plugin-esbuild';
import livereloadPlugin from 'rollup-plugin-livereload';
import servePlugin from 'rollup-plugin-serve';

export default defineConfig({
  input: {
    select: './src/features/select.ts',
    'line-chart': './src/features/line-chart.ts',
    'multi-step-form': './src/features/multi-step-form.ts',
    'search-address': './src/features/search-address.ts',
    'trigger-reveals': './src/features/trigger-reveals.ts',
    'bar-charts': './src/features/bar-charts.ts',
  },
  output: {
    format: 'module',
    dir: 'dist',
    manualChunks: {
      'motion-one': ['motion'],
      popper: ['@floating-ui/dom', '@zag-js/interact-outside'],
    },
    chunkFileNames(chunkInfo) {
      return `chunks/${chunkInfo.name}.js`;
    },
  },
  plugins: [
    replacePlugin({
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    cjsPlugin(),
    tsPlugin(),
    reslovePlugin(),
    esbuildPlugin({ minify: true, target: 'es2020', platform: 'browser' }),
    servePlugin({
      contentBase: 'dist',
      port: 3000,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    }),
    livereloadPlugin({ watch: 'dist', inject: false, verbose: true }),
  ],
});
