<script>
    import { Link } from "svelte-routing";

    import AlbumSongs from '../components/albumSongs.svelte';
    import Rating from '../components/rating.svelte';
    import Visibility from '../components/visibility.svelte';
    import Actions from '../components/actions.svelte';

    import SVGArtist from "../../public/images/artist.svg";
    import SVGYear from "../../public/images/year.svg";

    export let data;

    let album;
    $: album = data;
</script>

<div class="album-card-expanded">
    <div class="info">
        <div class="image-container">
            <img width="125" height="125" class="image" src="{album.art}&thumb=22" alt="Image of {album.name}" loading="lazy">
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
                    <Actions
                        type="album"
                        mode="miniButtons"
                        id="{album.id}"
                        count="{album.songcount}"
                        albumID="{album.id}"
                        artistID="{album.artist.id}"
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
        margin-top: var(--spacing-xxl);
    }

    .album-card-expanded {
        padding: var(--spacing-lg);
        border-radius: 10px;
        border: 2px solid var(--color-lines);
        max-width: 2000px;
    }

    .image {
        border-radius: 5px;
        max-width: 125px;
    }

    .image-container {
        margin-right: var(--spacing-lg);
    }

    .info {
        display: flex;
        margin-bottom: var(--spacing-md);
    }

    .title {
        font-weight: 700;
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