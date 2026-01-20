//----------------------------------------------------------------------------------------------------------------------
// Vite Config
//----------------------------------------------------------------------------------------------------------------------

import { resolve } from 'path';
import 'dotenv/config';
import { defineConfig } from 'vite';

// Vite Plugins
import checker from 'vite-plugin-checker';
import vue from '@vitejs/plugin-vue';
import Components from 'unplugin-vue-components/vite';
import { BootstrapVueNextResolver } from 'bootstrap-vue-next';

// Interfaces
import type { ServerConfig } from './src/server/src/interfaces/config.ts';

// Utils
import configUtil from '@strata-js/util-config';
import { getVersion } from './src/server/src/utils/version.ts';

// ---------------------------------------------------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------------------------------------------------

const env = (process.env.ENVIRONMENT ?? 'local').toLowerCase();
configUtil.load(`./config/${ env }.yml`);

const config = configUtil.get<ServerConfig>();

//----------------------------------------------------------------------------------------------------------------------

/** @type {import('vite').UserConfig} */
export default defineConfig({
    root: 'src/client/src',
    publicDir: 'assets',
    resolve: {
        alias: {
            '@rpgk/core': resolve(__dirname, 'src/core/src'),
            '@rpgk/systems': resolve(__dirname, 'src/systems/src'),
            '@client': resolve(__dirname, 'src/client/src'),
            '@server': resolve(__dirname, 'src/server/src'),
        },
    },
    plugins: [
        checker({
            eslint: {
                lintCommand: 'eslint "src/client/src/**/*.{ts,js,vue}" '
                    + '"src/systems/src/**/client/**/*.{ts,js,vue}" "src/systems/src/client.ts" '
                    + '--max-warnings=0',
                useFlatConfig: true,
            },
            typescript: true,
            root: process.cwd(),
            vueTsc: true,
        }),
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
                        'triumph',
                        'lightside',
                        'forcepoint',
                        'failure',
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
        preprocessorOptions: {
            scss: {
                quietDeps: true,
                silenceDeprecations: [ 'import' ],
            },
        },
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
        __APP_VERSION__: JSON.stringify((await getVersion()).version.full),
    },
    build: {
        outDir: '../../../dist/client',
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
