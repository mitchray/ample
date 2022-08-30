<script>
    import { getContext } from 'svelte';
    import { MediaPlayer } from "../../stores/player";
    import { shuffleArray } from "../../logic/helper";
    import { loadingSpinner } from "../../actions/loadingSpinner";
    import SVGShuffle from "../../../public/images/shuffle.svg";

    export let contextKey;

    const { getSongs, getShowShuffle } = getContext(contextKey);

    let loaded = false;

    async function handleAction() {
        loaded = false;
        let songs = await getSongs();
        songs = shuffleArray(songs);
        $MediaPlayer.playLast(songs);
        loaded = true;
    }
</script>

{#if getShowShuffle()}
    <button
        type="button"
        on:click={handleAction}
        title="Shuffle Last"
        use:loadingSpinner={loaded}
    >
        <SVGShuffle />
    </button>
{/if}