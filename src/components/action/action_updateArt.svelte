<script>
    import { getContext } from 'svelte';
    import { API } from "../../stores/api";
    import { loadingSpinner } from "../../actions/loadingSpinner";
    import SVGImage from "/src/images/image.svg";
    import SVGPhoto from "/src/images/portrait.svg";

    export let contextKey;

    const { getType, getID } = getContext(contextKey);

    let loaded = false;
    let type = getType();
    let id = getID();

    async function handleAction() {
        loaded = false;
        let result = await $API.updateArt({ type: type, id: id });
        if (result) {
            loaded = true;
        }
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