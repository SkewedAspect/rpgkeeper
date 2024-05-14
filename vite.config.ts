//----------------------------------------------------------------------------------------------------------------------
// Vite Config
//----------------------------------------------------------------------------------------------------------------------

import { defineConfig } from 'vite';

// Vite Plugins
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { BootstrapVueNextResolver } from 'unplugin-vue-components/resolvers';

//----------------------------------------------------------------------------------------------------------------------

/** @type {import('vite').UserConfig} */
export default defineConfig({
    root: 'src/client',
    publicDir: 'assets',
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => [
                        'proficiency',
                        'ability',
                        'boost',
                        'force',
                        'challenge',
                        'difficulty',
                        'setback',
                        'success',
                        'advantage',
                        'advantage',
                        'triumph',
                        'lightside',
                        'forcepoint',
                        'failure',
                        'threat',
                        'threat',
                        'despair',
                        'darkside'
                    ].includes(tag)
                }
            }
        }),
        Components({
            resolvers: [ BootstrapVueNextResolver() ]
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
        open: false
    },
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
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
                    bootstrapVue: [ 'bootstrap-vue' ]
                }
            }
        }
    }
});

//----------------------------------------------------------------------------------------------------------------------
