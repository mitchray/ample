<script>
    import { Link } from "svelte-routing";
    import { serverURL } from "../../stores/server";

    import Rating from '../../components/rating.svelte';
    import Actions2 from '../../components/action/actions.svelte';

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
                    data-id="art-album-{album.id}"
                    on:error={e => { e.onerror=null; e.target.src=$serverURL + '/image.php?object_id=0&object_type=album&thumb=22' }}
                />
            </Link>
        </div>

        <div class="info">
            <div class="top">
                <div class="details">
                        {#if album.year}
                            <div class="date">
                                <Link to="albums/year/{album.year}" title="{album.year}">{album.year}</Link>
                            </div>
                        {/if}
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
                        data={Object.create({album: album, artist: album.artist})}
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
                    <div class="date">0000</div>
                    <div class="title">Loading album</div>
                    <div class="artist">Loading<br></div>
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
        row-gap: var(--spacing-xxl);
        column-gap: var(--spacing-md);
        grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    }

    :global(.album-scroll) {
        /*grid-template-columns: inherit;*/
    }

    :global(.album-scroll) .album-card,
    :global(.album-card-expanded) .album-card {
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
        margin-bottom: var(--spacing-sm);
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

    .top {
        margin-bottom: var(--spacing-md);
    }

    .title,
    .artist {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .date,
    .date :global(a) {
        color: var(--color-text-secondary);
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