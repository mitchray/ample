<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { API } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { errorHandler } from "~/logic/helper.js";

    let { actionContext } = $props();

    const { items, apiType } = actionContext;

    let loading = $state(false);
    let label =
        apiType === "artist"
            ? $_("text.updateArtistImage")
            : $_("text.updateAlbumArt");

    async function handleAction() {
        loading = true;

        for (const item of items) {
            let result = await $API.updateArt({ type: apiType, id: item.id });
            if (result.error) {
                errorHandler("updating art", result.error);
            }

            if (result.success) {
                let images = document.querySelectorAll(
                    `img[data-id=art-${apiType}-${item.id}]`,
                );
                images.forEach((image) => {
                    fetch(image.src, { cache: "reload", mode: "no-cors" });
                    image.src = result.art;
                });
            }
        }

        loading = false;
    }
</script>

<sl-menu-item {loading} onclick={handleAction} title={label}>
    <MaterialSymbol
        name={apiType === "artist" ? "portrait" : "image"}
        slot="prefix"
    />
    {label}
</sl-menu-item>
