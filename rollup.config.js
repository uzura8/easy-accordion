import nodeResolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: 'src/js/EasyAccordion.js',
  output: {
    file: 'dist/js/EasyAccordion.js',
    format: 'umd',
    name: 'EasyAccordion',
  },
  plugins: [
    nodeResolve(),
    commonjs(),
  ]
};
