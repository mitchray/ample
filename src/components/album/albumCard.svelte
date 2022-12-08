<script>
    import { Link } from "svelte-routing";
    import { serverURL } from "../../stores/server";

    import Rating from '../../components/rating.svelte';
    import Actions2 from '../../components/action/actions.svelte';

    import SVGYear from "/src/images/year.svg";
    import SVGTrack from "/src/images/music_note.svg";

    export let data = null; // needed for cardList dynamic components

    let album;
    $: album = data;
</script>

<div class="album-card card">
    {#if album}
        <div class="image-container">
            <Link to="albums/{album.id}" title="{album.name}">
                <img class="image"
                    src="{album.art}&thumb=22"
                    alt="Image of {album.name}"
                    width="200"
                    height="200"
                    on:error={e => { e.onerror=null; e.target.src=$serverURL + '/image.php?object_id=0&object_type=album&thumb=22' }}
                />
            </Link>
        </div>

        <div class="info">
            <div class="top">
                <div class="details">
                    <div class="title"><Link to="albums/{album.id}" title="{album.name}">{album.name}</Link></div>
                    <div class="artist"><Link to="artists/{album.artist.id}" title="{album.artist.name}">{album.artist.name}</Link></div>
                </div>
            </div>

            <div class="bottom">
                <div class="rating-container">
                    <Rating type="album" id="{album.id}" rating="{album.rating}" flag="{album.flag}" averageRating="{album.averagerating}"/>
                </div>

                <div class="actions">
                    <Actions2
                        type="album"
                        mode="miniButtons"
                        id="{album.id}"
                        showShuffle={album.songcount > 1}
                        data={Object.create({albumID: album.id, artistID: album.artist.id})}
                    />
                </div>
            </div>
        </div>
    {:else}
        <div class="image-container">
            <img width="200" height="200" class="image" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="">
        </div>

        <div class="info">
            <div class="top">
                <div class="details">
                    <div class="title">Loading</div>
                    <div class="artist">&nbsp;<br></div>
                </div>
            </div>

            <div class="bottom">
                <div class="rating-container">
                    <Rating />
                </div>

                <div class="actions">
                    <Actions2 type="album" mode="miniButtons" />
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    /* Album grids should have this on the containing element */
    :global(.album-grid) {
        display: grid;
        row-gap: var(--spacing-xxl);
        column-gap: var(--spacing-lg);
        grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    }

    :global(.album-scroll) {
        border: 2px solid var(--color-separator);
        border-radius: 15px;
        padding: var(--spacing-lg);
        gap: var(--spacing-lg);
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-bottom: 20px;
    }

    :global(.album-scroll) .album-card {
        width: 190px;
    }

    .album-card {
        height: 100%; /* equal height with siblings */
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .image-container {
        font-size: 0;
        position: relative;
        z-index: 1;
        justify-content: center;
        display: flex;
        margin-bottom: var(--spacing-md);
        border-radius: 5px;
        overflow: hidden;
        border: 1px solid hsla(0, 0%, 50%, 0.2);
        aspect-ratio: 1 / 1;
    }

    .image-container :global(img) {
        color: transparent;
        height: 100%;
        object-fit: cover;
        width: 100%;
    }

    .info {
        /*padding: var(--spacing-md) var(--spacing-lg) var(--spacing-md) var(--spacing-lg);*/
    }

    .top {
        margin-bottom: var(--spacing-md);
    }

    .title,
    .artist {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .bottom {
        padding-top: 0;
    }

    .rating-container {
        display: flex;
        flex-direction: column;
        margin-bottom: var(--spacing-md);
    }
</style>