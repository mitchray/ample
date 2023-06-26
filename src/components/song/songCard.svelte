<script>
    import { _ } from 'svelte-i18n';
    import { serverURL } from "../../stores/server";
    import { cleanArtURL, formatTotalTime } from "../../logic/helper";
    import Rating from '../../components/rating.svelte';
    import Actions from '../../components/action/actions.svelte';
    import SVGAlbum from "/src/images/album.svg";

    export let data = null; // needed for cardList dynamic components

    let song;
    $: song = data;
</script>

<div class="song-card card">
    {#if song}
        <div class="top">
            <div class="image-container">
                <img class="image"
                     src="{cleanArtURL(song.art)}&thumb=11"
                     alt="Image of {song.name}"
                     width="96"
                     height="96"
                     data-id="art-album-{song.album?.id}"
                     on:error={e => { e.onerror=null; e.target.src=$serverURL + '/image.php?object_id=0&object_type=song&thumb=22' }}
                />
            </div>

            <div class="info">
                <div class="time secondary-info">{formatTotalTime(song.time)}</div>
                <div class="title" title="{song.name}"><a href="#/song/{song.id}">{song.name}</a></div>
                <div class="artist secondary-info"><a href="#/artists/{song.artist.id}" title="{song.artist.name}">{song.artist.name}</a></div>
                <div class="album secondary-info"><a href="#/albums/{song.album.id}" title="{song.album.name}"><SVGAlbum class="inline"/> {song.album.name}</a></div>

                <Rating type="song" id="{song.id}" rating="{song.rating}" flag="{song.flag}" averageRating="{song.averagerating}" />
            </div>
        </div>

        <div class="actions">
            <Actions
                type="song"
                mode="miniButtons"
                id="{song.id}"
                data={Object.create({
                    album: song.album,
                    artists: song.artists,
                    albumArtist: song.albumartist
                })}
            />
        </div>
    {:else}
        <div class="top">
            <div class="image-container">
                <img class="image"
                     height="96"
                     width="96"
                     src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                     alt=""
                >
            </div>

            <div class="info">
                <div class="time">0:00</div>
                <div class="title">{$_('text.loading')}</div>
                <div class="artist"><br></div>
                <div class="album"><br></div>
                <Rating />
            </div>
        </div>

        <div class="actions">
            <Actions type="song" mode="miniButtons" />
        </div>
    {/if}
</div>

<style>
    /* Song grids should have this on the containing element */
    :global(.song-grid) {
        row-gap: var(--spacing-xl);
        column-gap: var(--spacing-md);
        grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
    }

    :global(.song-scroll) {
        gap: var(--spacing-xxl);
    }

    :global(.song-scroll) .song-card {
        width: 230px;
    }

    .song-card {
        height: 100%; /* equal height with siblings */
    }

    .top {
        display: flex;
    }

    .image-container {
        font-size: 0;
        position: relative;
        height: 96px;
        aspect-ratio: 1 / 1;
        flex-shrink: 0;
        flex-grow: 0;
        border: 1px solid hsla(0, 0%, 50%, 0.2);
        border-radius: 3px;
        overflow: hidden;
        align-self: start;
    }

    .image-container :global(.image) {
        object-fit: cover;
        color: transparent;
        width: 100%;
    }

    .info {
        margin-inline-start: var(--spacing-md);
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
    }

    .title,
    .artist,
    .album {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .album {
        margin-block-end: var(--spacing-sm);
    }

    .actions {
        margin-block-start: var(--spacing-md);
    }
</style>