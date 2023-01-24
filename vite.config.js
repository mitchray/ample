import { defineConfig } from "vite";
import { svelteSVG } from "rollup-plugin-svelte-svg";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from 'svelte-preprocess';

export default defineConfig(({ command, mode, ssrBuild }) => {
    // Default the base path to /ample/ but set it to / if we're using a remote server
    var basePath = "/ample/"
    if (mode === "remote") {
        basePath = "/";
    }

    return {
        base: basePath,

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
    }
});