import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/js/SimpleAccordion.js',
  output: {
    file: 'dist/js/SimpleAccordion.js',
    format: 'umd',
    name: 'SimpleAccordion',
  },
  plugins: [
    nodeResolve(),
    commonjs(),
  ]
};
