import { defineConfig, splitVendorChunkPlugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
    build: {
        // To point out the exact line on the bundled js file.
        sourcemap: 'true'
    },
    plugins: [
        react(),
        VitePWA({ 
            registerType: 'autoUpdate', 
            workbox     : {
                // Cache up to 5mb, to be in limit with our current compiled vendor-.js file size of 3.5mb.
                maximumFileSizeToCacheInBytes: 5000000,
            },
        }),
        // To divide chunks into index-.js and vendor-.js.
        splitVendorChunkPlugin()
    ],
    preview: {
        port: 8888,
        // open: '/landingpage'
    },
    server: {
        port: 3000,
        open: '/landingpage'
    }       
})