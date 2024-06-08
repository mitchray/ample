<script>
    import { onMount } from "svelte";
    import { API } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import Actions from "~/components/action/actions.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import {
        albumsPreset,
        artistsPreset,
        songsPreset,
    } from "~/components/lister/columns.js";

    export let id;
    export let type;

    let genre;
    let data = [];
    let loadedTime = 0;
    let tabulator = null;

    $: data = data;

    async function getData() {
        genre = await $API.genre({ filter: id });

        if (genre.error) {
            errorHandler("getting genre", genre.error);
            return;
        }

        if (genre.id) {
            switch (type) {
                case "artist":
                    data = await $API.genreArtists({ filter: id, limit: 100 });
                    break;
                case "album":
                    data = await $API.genreAlbums({ filter: id, limit: 100 });
                    break;
                case "song":
                    data = await $API.genreSongs({ filter: id, limit: 100 });
                    break;
                default:
                    break;
            }
        }

        loadedTime = new Date();
    }

    onMount(async () => {
        await getData();
    });
</script>

{#key loadedTime}
    {#if genre?.name && data}
        {#if type === "artist"}
            <div class="lister-tabulator">
                <div class="lister-tabulator__actions">
                    <Actions
                        type="artistGenre"
                        displayMode="fullButtons"
                        showShuffle={true}
                        data={{ name: genre.name }}
                    />

                    <MassRater bind:tabulator />
                </div>

                <Tabulator
                    bind:tabulator
                    {data}
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
                        data={{ name: genre.name }}
                    />

                    <MassRater bind:tabulator />
                </div>

                <Tabulator
                    bind:tabulator
                    {data}
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
                        data={{ name: genre.name }}
                    />

                    <MassRater bind:tabulator />
                </div>

                <Tabulator
                    bind:tabulator
                    {data}
                    columns={songsPreset}
                    options={{
                        persistenceID: "songs",
                    }}
                ></Tabulator>
            </div>
        {/if}
    {/if}
{/key}
