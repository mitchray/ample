<script>
    import { Link } from "svelte-routing";

    import Rating from '../../components/rating.svelte';
    import Actions2 from '../../components/action/actions.svelte';

    import SVGAlbum from "../../../public/images/album.svg";

    export let data = null; // needed for cardList dynamic components

    let song;
    $: song = data;
</script>

<div class="song-card card">
    {#if song}
        <div class="image-container">
            <img class="image" src="{song.art}&thumb=22" alt="Image of {song.name}" width="200" height="200" />
        </div>

        <div class="info">
            <div class="top">
                <div class="title" title="{song.name}"><Link to="song/{song.id}">{song.name}</Link></div>
                <div class="artist"><Link to="artists/{song.artist.id}" title="{song.artist.name}">{song.artist.name}</Link></div>
            </div>

            <div class="bottom">
                <div class="meta">
                    <span class="album"><Link to="albums/{song.album.id}" title="{song.album.name}"><SVGAlbum class="inline"/> {song.album.name}</Link></span>
                </div>

                <Rating type="song" id="{song.id}" rating="{song.rating}" flag="{song.flag}" averageRating="{song.averagerating}" />

                <div class="actions">
                    <Actions2
                        type="song"
                        mode="miniButtons"
                        id="{song.id}"
                        data={Object.create({albumID: song.album.id, artistID: song.artist.id})}
                    />
                </div>
            </div>
        </div>
    {:else}
        <div class="image-container">
            <img class="image" height="200" width="200" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="">
        </div>

        <div class="info">
            <div class="top">
                <div class="title">Loading</div>
                <div class="artist"><br></div>
            </div>

            <div class="bottom">
                <div class="meta">
                    <span class="album"><br></span>
                </div>

                <Rating />

                <div class="actions">
                    <Actions2 type="song" mode="miniButtons" />
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
        border: 2px solid var(--color-separator);
        border-radius: 15px;
        padding: var(--spacing-lg);
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
        padding: var(--spacing-md);
        height: 100%; /* equal height with siblings */
        display: flex;
    }

    .image-container {
        font-size: 0;
        position: relative;
        height: 100%;
        width: 140px;
        aspect-ratio: 1 / 1;
        flex-shrink: 0;
        flex-grow: 0;
        border: 1px solid hsla(0, 0%, 50%, 0.2);
        border-radius: 5px;
        overflow: hidden;
    }

    .image-container :global(.image) {
        object-fit: cover;
        color: transparent;
        height: 100%;
        width: 100%;
    }

    .info {
        margin-left: var(--spacing-md);
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
    }

    .top {
        background-color: var(--color-card-highlight);
        padding: var(--spacing-md) var(--spacing-md);
        margin-bottom: var(--spacing-sm);
        border-radius: 5px;
    }

    .title,
    .artist,
    .album {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .album {
        margin-bottom: var(--spacing-sm);
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