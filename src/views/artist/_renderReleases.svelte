<script>
    import { setContext } from "svelte";
    import AlbumCard from "~/components/cards/albumCard.svelte";
    import GenericCard from "~/components/cards/genericCard.svelte";
    import ExpandedAlbum from "~/components/cards/expandedAlbumCard.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { albumsPreset } from "~/components/lister/columns.js";

    let { view, items, filterToArtistID = null } = $props();

    let tabulator = $state(null);

    setContext("filterToArtistID", filterToArtistID);
</script>

{#if view === "table"}
    <div class="lister-tabulator">
        <Tabulator
            bind:tabulator
            data={items}
            columns={albumsPreset}
            type="albums"
            options={{ persistenceID: "albums" }}
        ></Tabulator>
    </div>
{/if}

{#if view === "card-small"}
    <div class="card-container generic-grid">
        {#each items as album (album.id)}
            <GenericCard data={album} type="album" />
        {/each}
    </div>
{/if}

{#if view === "card"}
    <div class="card-container album-grid">
        {#each items as album (album.id)}
            <AlbumCard data={album} />
        {/each}
    </div>
{/if}

{#if view === "expanded_columns"}
    <div class="albums-expanded">
        {#each items as album, i (album.id)}
            <ExpandedAlbum type="slim" {album} zIndex={i} />
        {/each}
    </div>
{/if}

{#if view === "expanded_table"}
    <div class="albums-expanded">
        {#each items as album, i (album.id)}
            <ExpandedAlbum type="full" {album} zIndex={i} />
        {/each}
    </div>
{/if}

<style>
    .card-container {
        justify-self: unset !important;
        display: grid;
    }

    .albums-expanded {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xxxl);
    }
</style>
