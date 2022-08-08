import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

import path from 'path'

// https://vitejs.dev/config/
export default ({ mode }: any) => {
    process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

    const isDev = process.env.VITE_BACKEND_FQDN === 'backend'
    const proxySettings = {
        '/api': {
            target: 'http://backend:4000',
            changeOrigin: true,
            secure: false,
            rewrite: (path: any) => path.replace(/^\/api/, ''),
        },
    }
    console.log('proxySettings', proxySettings)
    const conf = defineConfig({
        server: {
            port: parseInt(process.env.VITE_FRONTEND_PORT ?? '443'),
            proxy: isDev ? proxySettings : undefined,
        },
        plugins: [
            vue(),
            vuetify({
                autoImport: true,
            }),
            // splitVendorChunkPlugin(),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'src'),
            },
        },
    })
    console.log('conf: ', conf)
    return conf
}
