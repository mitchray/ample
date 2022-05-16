<script>
    import { onMount } from 'svelte';
    import { Link } from "svelte-routing";

    import Actions from '../components/actions.svelte';

    import SVGArtist from "../../public/images/artist.svg";
    import SVGAlbum from "../../public/images/album.svg";
    import SVGSong from "../../public/images/music_note.svg";

    export let data = null;

    let angle = 0;
    let genre;
    $: genre = data;

    onMount(() => {
        for (let i = 0; i < genre.name.length; i++) {
            angle += genre.name.charCodeAt(i);
        }
    });
</script>

<div class="genre-card card" data-name="genre-{genre.name.replace(/\s+/g, '-').toLowerCase()}" style="--angle: {angle}deg">
    <div class="info">
        <div class="title genre-title" title="{genre.name}">
            <Link to="genres/{genre.id}">{genre.name}</Link>
        </div>

        <div class="meta">
            <Link to="genres/{genre.id}/artists"><SVGArtist class="inline" /> {genre.artists}</Link>
            <Link to="genres/{genre.id}/albums"><SVGAlbum class="inline" /> {genre.albums}</Link>
            <Link to="genres/{genre.id}/songs"><SVGSong class="inline" /> {genre.songs}</Link>
        </div>

        <div class="bottom">
            <div class="actions">
                <Actions type="artistGenre" mode="miniButtons" data="{genre.name}" count="1" />
            </div>
        </div>
    </div>
</div>

<style>
    /* Genre grids should have this on the containing element */
    :global(.genre-grid) {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }

    :global(.genre-scroll) {
        border: 2px solid var(--color-separator);
        border-radius: 15px;
        padding: var(--spacing-lg);
        gap: 20px;
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-bottom: 20px;
    }

    :global(.genre-scroll) .genre-card {
        width: 250px;
    }

    .genre-card {
        padding: var(--spacing-md);
        height: 100%; /* equal height with siblings */
        display: flex;
        position: relative;
        z-index: 1;
        overflow: hidden;
    }

    .info {
        margin-left: var(--spacing-md);
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
    }

    .title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .title.genre-title {
        --roboto-opsz: 50;
        line-height: 1.1;
        margin: var(--spacing-md) 0 var(--spacing-md);
        letter-spacing: 0.02em;
        font-weight: 300;
        font-stretch: 80%;
        font-size: 20px;
    }

    .meta {
        display: flex;
        gap: var(--spacing-lg);
    }

    .bottom {
        display: flex;
        flex-direction: column;
    }

    .actions {
        margin-top: var(--spacing-md);
    }

    /*  COLORS  */
    :global(.genre-card[data-name]:after) {
        content: '';
        background-color: hsla(0,0%,50%,0.3);
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: -1;
        mask-image: linear-gradient(var(--angle), transparent 30%, hsla(0,0%,0%, 1.0) 30.5%, hsla(0,0%,0%, 0.7) 50%, hsla(0,0%,0%, 0.3) 80%, hsla(0,0%,0%, 0) 100%);
        opacity: 0.2;
    }

    :global(.theme-is-light .genre-card[data-name]:after) {
        opacity: 0.15;
    }

    :global(.genre-card[data-name*="rock"]:after),
    :global(.genre-card[data-name*="grunge"]:after) {
        background-color: red;
    }

    :global(.genre-card[data-name*="easy"]:after),
    :global(.genre-card[data-name*="classical"]:after),
    :global(.genre-card[data-name*="piano"]:after) {
        background-color: darkorange;
    }

    :global(.genre-card[data-name*="electr"]:after),
    :global(.genre-card[data-name*="house"]:after),
    :global(.genre-card[data-name*="drum"]:after) {
        background-color: yellow;
    }

    :global(.genre-card[data-name*="rap"]:after),
    :global(.genre-card[data-name*="hip"]:after),
    :global(.genre-card[data-name*="reggae"]:after) {
        background-color: lime;
    }

    :global(.genre-card[data-name*="indie"]:after),
    :global(.genre-card[data-name*="indy"]:after),
    :global(.genre-card[data-name*="folk"]:after) {
        background-color: olivedrab;
    }

    :global(.genre-card[data-name*="blues"]:after),
    :global(.genre-card[data-name*="country"]:after),
    :global(.genre-card[data-name*="jazz"]:after),
    :global(.genre-card[data-name*="soul"]:after) {
        background-color: cyan;
    }

    :global(.genre-card[data-name*="metal"]:after),
    :global(.genre-card[data-name*="thrash"]:after) {
        background-color: steelblue;
    }

    :global(.genre-card[data-name*="posthardcore"]:after),
    :global(.genre-card[data-name*="post-hardcore"]:after),
    :global(.genre-card[data-name*="punk"]:after),
    :global(.genre-card[data-name*="emo"]:after) {
        background-color: magenta;
    }
</style>