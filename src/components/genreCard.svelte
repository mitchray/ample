<script>
    import { Link } from "svelte-routing";

    import Actions from '../components/actions.svelte';

    import SVGGenre from "../../public/images/label.svg";
    import SVGArtist from "../../public/images/artist.svg";
    import SVGAlbum from "../../public/images/album.svg";
    import SVGSong from "../../public/images/music_note.svg";

    export let data = null;

    let genre;
    $: genre = data;
</script>

<div class="genre-card card">
    {#if genre}
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
    {:else}
        <div class="info">
            <div class="top">
                <div class="title">Loading</div>
            </div>

            <div class="bottom">
                <div class="actions">
                    <Actions type="genre" mode="miniButtons" />
                </div>
            </div>
        </div>
    {/if}
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
</style>