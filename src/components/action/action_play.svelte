<script>
    import { _ } from 'svelte-i18n';
    import { getContext } from 'svelte';
    import { MediaPlayer } from "../../stores/player";
    import { loadingSpinner } from "../../actions/loadingSpinner";
    import SVGPlay from "/src/images/play.svg";

    export let contextKey;

    const { getSongs } = getContext(contextKey);

    let loaded = false;

    async function handleAction() {
        loaded = false;
        let songs = await getSongs();
        $MediaPlayer.playNow(songs);
        loaded = true;
    }
</script>

<button
    type="button"
    class="play icon-button button--primary"
    on:click={handleAction}
    title="{$_('text.play')}"
    use:loadingSpinner={loaded}
>
    <SVGPlay />
</button>