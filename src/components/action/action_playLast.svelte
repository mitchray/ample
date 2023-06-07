<script>
    import { _ } from 'svelte-i18n';
    import { getContext } from 'svelte';
    import { MediaPlayer } from "../../stores/player";
    import { loadingSpinner } from "../../actions/loadingSpinner";
    import SVGQueue from "/src/images/playlist_add.svg";

    export let contextKey;

    const { getSongs } = getContext(contextKey);

    let loaded = false;

    async function handleAction() {
        loaded = false;
        let songs = await getSongs();
        $MediaPlayer.playLast(songs);
        loaded = true;
    }
</script>

<button
    type="button"
    class="icon-button"
    on:click={handleAction}
    title="{$_('title.playLast')}"
    use:loadingSpinner={loaded}
>
    <SVGQueue style="transform: scale(0.85);" />
</button>