<script>
    import { setContext } from "svelte";
    import { ArtistToFilter } from "~/stores/state.js";
    import AlbumCard from "~/components/cards/albumCard.svelte";
    import Songs from "~/components/cards/_expandedAlbumSongs.svelte";
    import Visibility from "~/components/visibility.svelte";
    import { v4 as uuidv4 } from "uuid";

    export let album = {};
    export let zIndex = 1;
    /** @type {"slim" | "full"} */
    export let type;
    export let filterToArtist = null;

    let contextKey = uuidv4(); // unique key

    setContext(contextKey, {
        getAlbum: () => album,
        getType: () => type,
        getFilterToArtist: () => filterToArtist,
    });

    function stealClick(e) {
        // $ArtistToFilter = filterToArtist ? filterToArtist : null;
    }
</script>

<div class="container type-{type}" style:z-index={1000 - zIndex}>
    <div class="card" on:click={stealClick}>
        <AlbumCard data={album} />
    </div>

    <Visibility steps={100} let:percent let:unobserve>
        {#if percent > 0}
            <div class="disks" use:unobserve>
                <Songs {contextKey} />
            </div>
        {/if}
    </Visibility>
</div>

<style>
    /* covers columns and lister */
    .container :global(.not-by-artist.hide) {
        display: none;
    }

    .container :global(.not-by-artist.highlight) {
        opacity: 0.6;
    }

    .container {
        container-name: album-wrapper;
        container-type: inline-size;
        display: flex;
        flex-direction: column;
        position: relative; /* needed in conjunction with the inline z-index to workaround sl-menu being behind*/
    }

    .container :global(.album-card) {
        flex-shrink: 0;
        width: 200px;
    }

    .disks {
        display: flex;
        flex-direction: column;
        width: 100%;
        /* overflow: hidden; */ /* TODO WAS needed for expanded_table to overflow, is it still needed? */
        margin-inline-start: var(--spacing-md);
    }

    @container (min-width: 500px) {
        .container.type-slim {
            flex-direction: row;
            gap: var(--spacing-lg);
            max-width: 1600px;
        }
    }

    @container (min-width: 1000px) {
        .container.type-full {
            flex-direction: row;
            gap: var(--spacing-lg);
        }
    }
</style>
