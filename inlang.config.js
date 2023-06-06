export async function defineConfig(env) {
    const { default: pluginJson } = await env.$import(
        "https://cdn.jsdelivr.net/gh/samuelstroschein/inlang-plugin-json@2/dist/index.js",
    )

    return {
        referenceLanguage: "en",
        plugins: [
            pluginJson({
                pathPattern: "./languages/{language}.json",
            }),
        ],
    }
}