import { defineConfig } from "vite";
import { svelteSVG } from "rollup-plugin-svelte-svg";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from 'svelte-preprocess';

export default defineConfig({
    base: "/ample/",

    // TODO temporary while javascript-ampache is still local
    server: {
        fs: {
            allow: ['..']
        }
    },

    plugins: [
        svelteSVG({
            enforce: "pre",
        }),

        svelte({
            hot: {
                preserveLocalState: true
            },
            preprocess: sveltePreprocess({
                sourceMap: false,
                postcss: {
                    plugins: [require('autoprefixer')()]
                }
            }),
        })
    ]
});