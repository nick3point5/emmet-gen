import terser from '@rollup/plugin-terser'

export default {
	input: './build/main.js',
	output: [
		{
			file: './dist/bundle.min.js',
			format: 'es',
			plugins: [terser()]
		}
	]
}