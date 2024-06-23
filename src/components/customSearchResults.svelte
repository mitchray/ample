<script>
    import { _ } from "svelte-i18n";
    import Actions from "~/components/action/actions.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import {
        albumsPreset,
        artistsPreset,
        playlistsPreset,
        songsPreset,
    } from "~/components/lister/columns.js";

    export let loadedTime;
    export let loading;
    export let results = [];
    export let type;

    let tabulator = null;

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
            <div class="lister-tabulator">
                <div class="lister-tabulator__actions">
                    <Actions
                        type="songs"
                        displayMode="fullButtons"
                        showShuffle={true}
                        data={{ songs: results }}
                    />

                    <MassRater bind:tabulator type="song" />
                </div>

                <Tabulator
                    bind:tabulator
                    bind:data={results}
                    columns={songsPreset}
                    options={{
                        persistenceID: "songs",
                    }}
                ></Tabulator>
            </div>
        {/if}

        {#if type === "album"}
            <div class="lister-tabulator">
                <div class="lister-tabulator__actions">
                    <Actions
                        type="albums"
                        displayMode="fullButtons"
                        showShuffle={true}
                        data={{ albums: results }}
                    />

                    <MassRater bind:tabulator type="album" />
                </div>

                <Tabulator
                    bind:tabulator
                    bind:data={results}
                    columns={albumsPreset}
                    options={{
                        persistenceID: "albums",
                    }}
                ></Tabulator>
            </div>
        {/if}

        {#if type === "artist"}
            <div class="lister-tabulator">
                <div class="lister-tabulator__actions">
                    <Actions
                        type="artists"
                        displayMode="fullButtons"
                        showShuffle={true}
                        data={{ artists: results }}
                    />

                    <MassRater bind:tabulator type="artist" />
                </div>

                <Tabulator
                    bind:tabulator
                    bind:data={results}
                    columns={artistsPreset}
                    options={{
                        persistenceID: "artists",
                    }}
                ></Tabulator>
            </div>
        {/if}

        {#if type === "playlist"}
            <div class="lister-tabulator">
                <div class="lister-tabulator__actions">
                    <Actions
                        type="playlists"
                        displayMode="fullButtons"
                        showShuffle={true}
                        data={{ playlists: results }}
                    />

                    <MassRater bind:tabulator type="playlist" />
                </div>

                <Tabulator
                    bind:tabulator
                    bind:data={results}
                    columns={playlistsPreset}
                    options={{
                        persistenceID: "playlists",
                    }}
                ></Tabulator>
            </div>
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
