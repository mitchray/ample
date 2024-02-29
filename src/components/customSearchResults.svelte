<script>
    import { _ } from "svelte-i18n";
    import Lister from "~/components/lister/lister.svelte";
    import {
        songsPreset,
        albumsPreset,
        artistsPreset,
        playlistsPreset,
        forcedCheckbox,
    } from "./lister/columns.js";

    export let loadedTime;
    export let loading;
    export let results = [];
    export let type;

    $: {
        // reset results if type changes
        if (type) {
            results = [];
        }
    }
</script>

{#if loading}
    <p>{$_("text.searching")}</p>
{:else if results.length > 0}
    <div class="total">{$_("text.total")}: {results.length}</div>
    {#key loadedTime}
        {#if type === "song"}
            <Lister
                id="Songs"
                bind:data={results}
                {type}
                columns={[forcedCheckbox, ...songsPreset]}
                virtualList={true}
                actionData={{
                    type: "songs",
                    displayMode: "fullButtons",
                    data: Object.create({ songs: results }),
                }}
            />
        {/if}

        {#if type === "album"}
            <Lister
                id="Albums"
                bind:data={results}
                {type}
                columns={[forcedCheckbox, ...albumsPreset]}
                virtualList={true}
                actionData={{
                    type: "albums",
                    displayMode: "fullButtons",
                    data: Object.create({ albums: results }),
                }}
            />
        {/if}

        {#if type === "artist"}
            <Lister
                id="Artists"
                bind:data={results}
                {type}
                columns={[forcedCheckbox, ...artistsPreset]}
                virtualList={true}
                actionData={{
                    type: "artists",
                    displayMode: "fullButtons",
                    data: Object.create({ artists: results }),
                }}
            />
        {/if}

        {#if type === "playlist"}
            <Lister
                id="Playlists"
                bind:data={results}
                {type}
                columns={[forcedCheckbox, ...playlistsPreset]}
                virtualList={true}
                actionData={{
                    type: "playlists",
                    displayMode: "fullButtons",
                    data: Object.create({ playlists: results }),
                }}
            />
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
