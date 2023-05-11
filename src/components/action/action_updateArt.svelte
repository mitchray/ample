<script>
    import { getContext } from 'svelte';
    import { API } from "../../stores/api";
    import { loadingSpinner } from "../../actions/loadingSpinner";
    import SVGImage from "/src/images/image.svg";
    import SVGPhoto from "/src/images/portrait.svg";
    import { addAlert } from "../../logic/alert";
    import { cleanArtURL } from "../../logic/helper";

    export let contextKey;

    const { getType, getID } = getContext(contextKey);

    let loaded = false;
    let type = getType();
    let id = getID();

    async function handleAction() {
        loaded = false;

        addAlert({title: 'Starting art update', style: 'info'});

        $API.updateArt({ type: type, id: id })
            .then(result => {
                if (result?.success) {
                    addAlert({title: 'Updated art', style: 'success'});

                    let images = document.querySelectorAll(`img[data-id=art-${type}-${id}]`);
                    images.forEach(image => {
                        // reload the original image url (including thumb param) to update the cache
                        fetch(image.src, { cache: 'reload', mode: 'no-cors' });

                        // replace the visible image with the updated art
                        image.src = cleanArtURL(result.art);
                    })
                } else {
                    addAlert({title: 'Failed to update art', message: `${result.error?.errorCode}: ${result.error?.errorMessage}`, style: 'warning'});
                }

                loaded = true;
            })
    }
</script>

<button
    type="button"
    on:click={handleAction}
    title="Update {type === 'artist' ? 'artist image' : 'album art'}"
    use:loadingSpinner={loaded}
>
    {#if type === 'artist'}
        <SVGPhoto />
    {:else}
        <SVGImage />
    {/if}
</button>