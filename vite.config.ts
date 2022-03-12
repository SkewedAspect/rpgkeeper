//----------------------------------------------------------------------------------------------------------------------
// Vite Config
//----------------------------------------------------------------------------------------------------------------------

import path from 'path';
import { defineConfig } from 'vite';

// Vite Plugins
import { createVuePlugin } from 'vite-plugin-vue2';

//----------------------------------------------------------------------------------------------------------------------

export default defineConfig({
    root: 'src/client',
    publicDir: 'assets',
    plugins: [
        createVuePlugin()
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
            },
            {
                find: 'vue-typeahead-bootstrap',
                replacement: 'vue-typeahead-bootstrap/dist/VueTypeaheadBootstrap.umd.js'
            },
            {
                find: 'vuelidate/lib/validators',
                replacement: 'vuelidate/dist/validators.min.js'
            },
            {
                find: 'vuelidate',
                replacement: 'vuelidate/dist/vuelidate.min.js'
            }
        ]
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
