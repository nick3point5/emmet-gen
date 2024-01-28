import terser from '@rollup/plugin-terser'

export default {
	input: './build/main.js',
	output: [
		{
			file: './dist/main.min.js',
			format: 'es',
			plugins: [terser({compress: {unsafe: true}})]
		}
	]
}