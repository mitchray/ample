<script>
    import { Link } from "svelte-routing";
    import { serverURL } from "../../stores/server";

    import AlbumSongs from '../../components/album/albumSongs.svelte';
    import Rating from '../../components/rating.svelte';
    import Visibility from '../../components/visibility.svelte';
    import Actions2 from '../../components/action/actions.svelte';

    import SVGArtist from "../../../public/images/artist.svg";
    import SVGYear from "../../../public/images/year.svg";

    export let data;

    let album;
    $: album = data;
</script>

<div class="album-card-expanded card">
    <div class="info">
        <div class="image-container">
            <img width="125"
                height="125"
                class="image"
                src="{album.art}&thumb=22"
                alt="Image of {album.name}"
                loading="lazy"
                on:error={e => { e.onerror=null; e.target.src=$serverURL + '/image.php?object_id=0&object_type=album&thumb=22' }}
            >
        </div>

        <div class="details">
            <div class="title"><Link to="albums/{album.id}">{album.name}</Link></div>
            <div class="artist"><Link to="artists/{album.artist.id}"><SVGArtist class="inline"/> {album.artist.name}</Link></div>
            <div class="year">
                {#if album.year > 0}
                    <Link to="albums/year/{album.year}"><SVGYear class="inline"/> {album.year}</Link> &bull;
                {:else}
                    <br>
                {/if}
                {album.songcount} {parseInt(album.songcount) === 1 ? 'song' : 'songs'}
            </div>

            <div class="actions-container">
                <Rating type="album" id="{album.id}" rating="{album.rating}" flag="{album.flag}" averageRating="{album.averagerating}"/>

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
    </div>

    <Visibility steps={100} let:percent let:unobserve>
        {#if percent > 0}
            <div class="songs" use:unobserve>
                <AlbumSongs id={album.id} />
            </div>
        {/if}
    </Visibility>

</div>

<style>
    :global(.album-card-expanded + .album-card-expanded) {
        margin-top: var(--spacing-xxxl);
    }

    .album-card-expanded {
        max-width: 2000px;
    }

    .image {
        max-width: 125px;
    }

    .image-container {
        margin-right: var(--spacing-lg);
        border: 1px solid hsla(0, 0%, 50%, 0.2);
        line-height: 0;
        border-radius: 5px;
        overflow: hidden;
    }

    .info {
        display: flex;
        margin-bottom: var(--spacing-md);
        background-color: var(--color-card-primary);
        box-shadow: var(--shadow-md);
        padding: var(--spacing-lg);
        border-radius: 6px;
        max-width: fit-content;
    }

    .title {
        margin-bottom: var(--spacing-md);
    }

    .actions-container {
        margin-top: var(--spacing-md);
    }

    @media all and (min-width: 1280px) {
        .album-card-expanded :global(.song-list) {
            column-count: 2;
            column-gap: var(--spacing-xxl);
            column-fill: auto;
        }

        .album-card-expanded :global(.song-list.split) {
            column-fill: balance;
        }

        .album-card-expanded :global(.song-row) {
            min-height: 60px;
        }
    }

    @media all and (min-width: 2000px) {
        .album-card-expanded :global(.song-list) {
            column-count: 3;
        }
    }
</style>