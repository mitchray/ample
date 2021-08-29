<script>
    import { Link } from "svelte-routing";

    import Rating from '../components/rating.svelte';
    import Actions from '../components/actions.svelte';

    import SVGArtist from "../../public/images/artist.svg";
    import SVGAlbum from "../../public/images/album.svg";

    export let data = null;

    let song;
    $: song = data;
</script>

<div class="song-card">
    {#if song}
        <div class="image-container">
            <img class="image" height="200" width="200" src="{song.art}&thumb=22" alt="Image of {song.name}" loading="lazy">
        </div>

        <div class="info">
            <div class="details">
                <div class="title" title="{song.name}">{song.name}</div>
                <div class="artist"><Link to="artists/{song.artist.id}" title="{song.artist.name}"><SVGArtist class="inline"/> {song.artist.name}</Link></div>
                <div class="album"><Link to="albums/{song.album.id}" title="{song.album.name}"><SVGAlbum class="inline"/> {song.album.name}</Link></div>
            </div>

            <div class="actions-container">
                <Rating type="song" id="{song.id}" rating="{song.rating}" flag="{song.flag}" averageRating="{song.averagerating}" />

                <div class="actions">
                    <Actions
                        type="song"
                        mode="miniButtons"
                        id="{song.id}"
                        count="1"
                        albumID="{song.album.id}"
                        artistID="{song.artist.id}"
                    />
                </div>
            </div>
        </div>
    {:else}
        <div class="image-container">
            <img class="image" height="200" width="200" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="">
        </div>

        <div class="info">
            <div class="details">
                <div class="title">Loading</div>
                <div class="artist"><br></div>
                <div class="album"><br></div>
            </div>

            <div class="actions-container">
                <Rating />

                <div class="actions">
                    <Actions type="song" mode="miniButtons" />
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    /* Song grids should have this on the containing element */
    :global(.song-grid) {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }

    :global(.song-scroll) {
        gap: 20px;
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-bottom: 20px;
    }

    :global(.song-scroll) .song-card {
        width: 350px;
    }

    .song-card {
        background-color: var(--color-card-background);
        padding: var(--spacing-md);
        border-radius: 10px;
        height: 100%; /* equal height with siblings */
        display: flex;
    }

    .image-container {
        line-height: 0;
        position: relative;
        width: 125px;
        height: 125px;
        flex-shrink: 0;
    }

    .image {
        object-fit: cover;
        border-radius: 5px;
        color: transparent;
        background-color: var(--color-tint-100);
    }

    .info {
        margin-left: var(--spacing-lg);
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
    }

    .title {
        font-weight: 700;
        margin-bottom: var(--spacing-sm);
    }

    .title,
    .artist,
    .album {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .actions-container {
        display: flex;
        flex-direction: column;
        margin-top: var(--spacing-md);
    }

    .actions {
        margin-top: var(--spacing-md);
    }
</style>