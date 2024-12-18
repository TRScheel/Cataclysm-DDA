import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const currentDir = dirname(fileURLToPath(import.meta.url));
export default defineNuxtConfig({
    compatibilityDate: "2024-11-01",
    devtools: { enabled: true },
    devServer: {
        port: 3441,
    },
    build: {
        transpile: ["vuetify"],
    },
    modules: [
        (_options, nuxt) => {
            nuxt.hooks.hook("vite:extendConfig", (config) => {
                // @ts-expect-error
                config.plugins.push(vuetify({ autoImport: true }));
            });
        },
    ],
    pages: true,
    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
    },
    runtimeConfig: {
        public: {
            dataDir: join(currentDir, "../../data"),
            gfxDir: join(currentDir, "../../gfx"),
        },
    },
    nitro: {
        publicAssets: [
            { dir: join(currentDir, "../../data"), baseURL: "/data" },
            { dir: join(currentDir, "../../gfx"), baseURL: "/gfx" },
        ],
    },
});
