//----------------------------------------------------------------------------------------------------------------------
// Vite Config
//----------------------------------------------------------------------------------------------------------------------

import path from 'path';
import { defineConfig } from 'vite';

// Vite Plugins
import { createVuePlugin } from 'vite-plugin-vue2';

//----------------------------------------------------------------------------------------------------------------------

export default defineConfig({
    root: 'client',
    publicDir: 'static',
    plugins: [
        createVuePlugin()
    ],
    server: {
        port: 8089,
        proxy: {
            '/api': 'http://localhost:8090',
            '/config': 'http://localhost:8090',
            '/session': 'http://localhost:8090',
            '/version': 'http://localhost:8090',
            '/socket.io': {
                target: 'http://localhost:8090',
                ws: true
            }
        },
        https: false,
        open: false
    },
    resolve: {
        alias: [
            {
                find: /~(.+)/,
                replacement: path.join(process.cwd(), 'node_modules/$1')
            },
            {
                find: 'bootstrap-vue$',
                replacement: 'bootstrap-vue/src/index.js'
            },
            {
                find: 'vue',
                replacement: 'vue/dist/vue.esm.js'
            }
        ]
    },
    build: {
        outDir: '../../dist/client',
        emptyOutDir: true,
        cssCodeSplit: true,
        chunkSizeWarningLimit: 650,
        rollupOptions: {
            output: {
                manualChunks: {
                    bootstrap: [ 'popper.js', 'jquery', 'bootstrap' ],
                    bootstrapVue: [ 'bootstrap-vue' ],
                }
            }
        }
    }
});

//----------------------------------------------------------------------------------------------------------------------
