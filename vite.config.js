import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";
import autoprefixer from "autoprefixer";
import path from "path";
//import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
    base: "", // relative paths

    // allow using javascript-ampache locally for testing
    server: {
        fs: {
            allow: [".."],
        },
    },

    resolve: {
        alias: {
            "~": path.resolve("./src"),
        },
    },

    plugins: [
        svelte({
            hot: {
                preserveLocalState: true,
            },
            preprocess: sveltePreprocess({
                sourceMap: false,
                postcss: {
                    plugins: [autoprefixer()],
                },
            }),
            onwarn: (warning, handler) => {
                // handled within shoelace components
                if (warning.code === "a11y-no-static-element-interactions")
                    return;

                // handled within shoelace components
                if (warning.code === "a11y-click-events-have-key-events")
                    return;

                // proceed with other warnings normally
                handler(warning);
            },
        }),
        // visualizer({
        //     open: true,
        // }),
    ],

    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes("node_modules")) {
                        return "vendor";
                    }
                },
            },
        },
    },
});
