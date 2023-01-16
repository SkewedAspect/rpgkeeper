//----------------------------------------------------------------------------------------------------------------------
// Vite Config
//----------------------------------------------------------------------------------------------------------------------

import { defineConfig } from 'vite';

// Vite Plugins
import vue from '@vitejs/plugin-vue';

//----------------------------------------------------------------------------------------------------------------------

/** @type {import('vite').UserConfig} */
export default defineConfig({
    root: 'src/client',
    publicDir: 'assets',
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    compatConfig: {
                        MODE: 2
                    }
                }
            }
        })
    ],

    // Remove charset warning caused by bootstrap
    css: {
        postcss: {
            plugins: [
                {
                    postcssPlugin: 'internal:charset-removal',
                    AtRule: {
                        charset: (atRule) =>
                        {
                            if(atRule.name === 'charset')
                            {
                                atRule.remove();
                            }
                        }
                    }
                }
            ]
        }
    },
    server: {
        port: 5679,
        proxy: {
            '/auth': 'http://localhost:5678',
            '/api': 'http://localhost:5678',
            '/socket.io': {
                target: 'http://localhost:5678',
                ws: true
            }
        },
        https: false,
        open: false
    },
    resolve: {
        alias: {
            'vue': '@vue/compat',
            'vue-typeahead-bootstrap': 'vue-typeahead-bootstrap/dist/VueTypeaheadBootstrap.umd.js'
        }
    },
    build: {
        outDir: '../../dist/src/client',
        emptyOutDir: true,
        cssCodeSplit: true,
        chunkSizeWarningLimit: 650,
        rollupOptions: {
            output: {
                manualChunks: {
                    bootstrap: [ 'popper.js', 'jquery', 'bootstrap' ],
                    bootstrapVue: [ 'bootstrap-vue' ]
                }
            }
        }
    }
});

//----------------------------------------------------------------------------------------------------------------------
