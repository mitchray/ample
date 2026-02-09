<script>
    import { _ } from "@rgglez/svelte-i18n";
    import Actions from "~/components/action/actions.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import {
        albumsPreset,
        artistsPreset,
        playlistsPreset,
        songsPreset,
        genresPreset,
    } from "~/components/lister/columns.js";

    let {
        loadedTime = $bindable(),
        loading = $bindable(),
        results = $bindable(),
        type = $bindable(),
    } = $props();

    let tabulator = $state();

    $effect(() => {
        // reset results if type changes
        if (type) {
            results = [];
        }
    });
</script>

{#if loading}
    <p>{$_("text.searching")}</p>
{:else if results.length > 0}
    <div class="total">{$_("text.total")}: {results.length}</div>
    {#key loadedTime}
        {#if type === "song"}
            <Actions
                type="songs"
                displayMode="fullButtons"
                showShuffle={true}
                data={{ getSongs: () => tabulator.getData("active") }}
            />

            <Tabulator
                bind:tabulator
                bind:data={results}
                columns={songsPreset}
                type="songs"
                options={{
                    persistenceID: "songs",
                }}
            ></Tabulator>
        {/if}

        {#if type === "album"}
            <Actions
                type="albums"
                displayMode="fullButtons"
                showShuffle={true}
                data={{ getAlbums: () => tabulator.getData("active") }}
            />

            <Tabulator
                bind:tabulator
                bind:data={results}
                columns={albumsPreset}
                type="albums"
                options={{
                    persistenceID: "albums",
                }}
            ></Tabulator>
        {/if}

        {#if type.includes("artist")}
            <Actions
                type="artists"
                displayMode="fullButtons"
                showShuffle={true}
                data={{
                    getArtists: () => tabulator.getData("active"),
                }}
            />

            <Tabulator
                bind:tabulator
                bind:data={results}
                columns={artistsPreset}
                type="artists"
                options={{
                    persistenceID: "artists",
                }}
            ></Tabulator>
        {/if}

        {#if type === "playlist"}
            <Actions
                type="playlists"
                displayMode="fullButtons"
                showShuffle={true}
                data={{
                    getPlaylists: () => tabulator.getData("active"),
                }}
            />

            <Tabulator
                bind:tabulator
                bind:data={results}
                columns={playlistsPreset}
                type="playlists"
                options={{
                    persistenceID: "playlists",
                }}
            ></Tabulator>
        {/if}

        {#if type === "genre"}
            <Tabulator
                bind:tabulator
                bind:data={results}
                columns={genresPreset}
                type="genres"
                options={{
                    layout: "fitDataFill",
                }}
            ></Tabulator>
        {/if}
    {/key}
{:else}
    <p>{$_("text.noItemsFound")}</p>
{/if}

<style>
    .total {
        margin-block-end: var(--spacing-lg);
    }
</style>
