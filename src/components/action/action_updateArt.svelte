<script>
    import { _ } from 'svelte-i18n';
    import { getContext } from 'svelte';
    import { API } from "../../stores/api";
    import { loadingSpinner } from "../../actions/loadingSpinner";
    import SVGImage from "/src/images/image.svg";
    import SVGPhoto from "/src/images/portrait.svg";
    import { addAlert } from "../../logic/alert";

    export let contextKey;

    const { getType, getID } = getContext(contextKey);

    let loaded = false;
    let type = getType();
    let id = getID();

    async function handleAction() {
        loaded = false;

        $API.updateArt({ type: type, id: id })
            .then(result => {
                if (result?.success) {
                    let images = document.querySelectorAll(`img[data-id=art-${type}-${id}]`);
                    images.forEach(image => {
                        // reload the original image url (including thumb param) to update the cache
                        fetch(image.src, { cache: 'reload', mode: 'no-cors' });

                        // replace the visible image with the updated art
                        image.src = result.art;
                    })
                } else {
                    addAlert({title: $_('text.artUpdateFail'), message: `${result.error?.errorCode}: ${result.error?.errorMessage}`, style: 'warning'});
                }

                loaded = true;
            })
    }
</script>

<button
    type="button"
    on:click={handleAction}
    title="{type === 'artist' ? $_('text.updateArtistImage') : $_('text.updateAlbumArt')}"
    use:loadingSpinner={loaded}
>
    {#if type === 'artist'}
        <SVGPhoto />
    {:else}
        <SVGImage />
    {/if}
</button>