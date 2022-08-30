<script>
    import { getContext } from 'svelte';
    import { MediaPlayer } from "../../stores/player";
    import { loadingSpinner } from "../../actions/loadingSpinner";
    import SVGPlayNext from "../../../public/images/menu_open.svg";

    export let contextKey;

    const { getSongs } = getContext(contextKey);

    let loaded = false;

    async function handleAction() {
        loaded = false;
        let songs = await getSongs();
        $MediaPlayer.playNext(songs);
        loaded = true;
    }
</script>

<button
    type="button"
    class="icon-button"
    on:click={handleAction}
    title="Play Next"
    use:loadingSpinner={loaded}
>
    <SVGPlayNext style="transform: scale(0.85);" />
</button>