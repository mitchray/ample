<script>
    import { getContext } from 'svelte';
    import { MediaPlayer } from "../../stores/player";
    import { shuffleArray } from "../../logic/helper";
    import { loadingSpinner } from "../../actions/loadingSpinner";
    import SVGShuffle from "/src/images/shuffle.svg";

    export let contextKey;

    const { getSongs, getShowShuffle } = getContext(contextKey);

    let loaded = false;

    async function handleAction() {
        loaded = false;
        let songs = await getSongs();
        songs = shuffleArray(songs);
        $MediaPlayer.playNow(songs);
        loaded = true;
    }
</script>

{#if getShowShuffle()}
    <button
        type="button"
        class="shuffle icon-button button--secondary"
        on:click={handleAction}
        title="Shuffle"
        use:loadingSpinner={loaded}
    >
        <SVGShuffle style="transform: scale(0.85);" />
    </button>
{/if}
