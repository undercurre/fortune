import {defineConfig} from 'vite'
import uni from '@dcloudio/vite-plugin-uni'


export default defineConfig({
	plugins: [
		uni()
	],
	server: {
		port: 5173,
		proxy: {
			'/api': {
			  target: 'http://114.132.238.217:8000',
			  changeOrigin: true,
			}
		}
	}
})