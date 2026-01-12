<script>
    import { createQuery } from "@tanstack/svelte-query";
    import { API, User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import Actions from "~/components/action/actions.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import {
        albumsPreset,
        artistsPreset,
        songsPreset,
    } from "~/components/lister/columns.js";
    import { _ } from "@rgglez/svelte-i18n";

    let { id, type } = $props();

    let tabulator = $state(null);

    const query = createQuery(() => ({
        queryKey: ["genre", id, type],
        queryFn: async () => {
            let result = {};

            switch (type) {
                case "artist":
                    result = await $API.genreArtists({
                        filter: id,
                        limit: 100,
                    });
                    break;
                case "album":
                    result = await $API.genreAlbums({
                        filter: id,
                        limit: 100,
                    });
                    break;
                case "song":
                    result = await $API.genreSongs({
                        filter: id,
                        limit: 100,
                    });
                    break;
                default:
                    break;
            }

            if (result.error) {
                errorHandler("getting genre type " + type, result.error);
                return [];
            }

            return result[type];
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let items = $derived(query.data || {});
</script>

{#if query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if query.isError}
    <p>Error: {query.error.message}</p>
{:else if query.isSuccess}
    {#if items?.length === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        {#if type === "artist"}
            <div class="lister-tabulator">
                <div class="lister-tabulator__actions">
                    <Actions
                        type="artistGenre"
                        displayMode="fullButtons"
                        showShuffle={true}
                        data={{ id: id, artists: items }}
                        tabulator={tabulator}
                    />

                    <MassRater bind:tabulator type="artist" />
                </div>

                <Tabulator
                    bind:tabulator
                    data={items}
                    columns={artistsPreset}
                    options={{
                        persistenceID: "artists",
                    }}
                ></Tabulator>
            </div>
        {/if}

        {#if type === "album"}
            <div class="lister-tabulator">
                <div class="lister-tabulator__actions">
                    <Actions
                        type="albumGenre"
                        displayMode="fullButtons"
                        showShuffle={true}
                        data={{ id: id, albums: items }}
                        tabulator={tabulator}
                    />

                    <MassRater bind:tabulator type="album" />
                </div>

                <Tabulator
                    bind:tabulator
                    data={items}
                    columns={albumsPreset}
                    options={{
                        persistenceID: "albums",
                    }}
                ></Tabulator>
            </div>
        {/if}

        {#if type === "song"}
            <div class="lister-tabulator">
                <div class="lister-tabulator__actions">
                    <Actions
                        type="songGenre"
                        displayMode="fullButtons"
                        showShuffle={true}
                        data={{ id: id, songs: items }}
                        tabulator={tabulator}
                    />

                    <MassRater bind:tabulator type="song" />
                </div>

                <Tabulator
                    bind:tabulator
                    data={items}
                    columns={songsPreset}
                    options={{
                        persistenceID: "songs",
                    }}
                ></Tabulator>
            </div>
        {/if}
    {/if}
{/if}
