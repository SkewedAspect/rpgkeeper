//----------------------------------------------------------------------------------------------------------------------
// Vite Config
//----------------------------------------------------------------------------------------------------------------------

import 'dotenv/config';
import { defineConfig } from 'vite';

// Vite Plugins
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { BootstrapVueNextResolver } from 'unplugin-vue-components/resolvers';

// Interfaces
import { ServerConfig } from './src/common/interfaces/config';

// Utils
import configUtil from '@strata-js/util-config';

// ---------------------------------------------------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------------------------------------------------

const env = (process.env.ENVIRONMENT ?? 'local').toLowerCase();
configUtil.load(`./config/${ env }.yml`);

const config = configUtil.get<ServerConfig>();

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
                        'darkside',
                    ].includes(tag),
                },
            },
        }),
        Components({
            resolvers: [ BootstrapVueNextResolver() ],
        }),
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
                        },
                    },
                },
            ],
        },
    },
    server: {
        host: config.http.host,
        port: config.http.port,
        proxy: {
            '/auth': `http://127.0.0.1:${ config.http.port - 1 }`,
            '/api': `http://127.0.0.1:${ config.http.port - 1 }`,
            '/version': `http://127.0.0.1:${ config.http.port - 1 }`,
            '/socket.io': {
                target: `http://127.0.0.1:${ config.http.port - 1 }`,
                ws: true,
            },
        },
        open: false,
    },
    define: {
        __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    },
    build: {
        outDir: '../../dist/client',
        emptyOutDir: true,
        cssCodeSplit: true,
        chunkSizeWarningLimit: 650,
        rollupOptions: {
            output: {
                manualChunks: {
                    bootstrapVueNext: [ 'bootstrap-vue-next' ],
                },
            },
        },
    },
});

//----------------------------------------------------------------------------------------------------------------------
