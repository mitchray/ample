<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { getContext } from "svelte";
    import { API } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { errorHandler } from "~/logic/helper.js";

    let { contextKey } = $props();

    const { _type, _item } = getContext(contextKey);

    let loading = $state(false);
    let label =
        $_type === "artist"
            ? $_("text.updateArtistImage")
            : $_("text.updateAlbumArt");

    async function handleAction() {
        loading = true;

        $API.updateArt({ type: $_type, id: $_item.id }).then((result) => {
            if (result.error) {
                errorHandler("updating art", result.error);
            }

            if (result.success) {
                let images = document.querySelectorAll(
                    `img[data-id=art-${$_type}-${$_item.id}]`,
                );
                images.forEach((image) => {
                    // reload the original image url (including thumb param) to update the cache
                    fetch(image.src, { cache: "reload", mode: "no-cors" });

                    // replace the visible image with the updated art
                    image.src = result.art;
                });
            }

            loading = false;
        });
    }
</script>

<sl-menu-item {loading} onclick={handleAction} title={label}>
    <MaterialSymbol
        name={$_type === "artist" ? "portrait" : "image"}
        slot="prefix"
    />
    {label}
</sl-menu-item>
