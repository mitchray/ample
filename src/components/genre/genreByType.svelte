<script>
    import { onMount } from "svelte";
    import { API } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import Lister from "~/components/lister/lister.svelte";
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
            <Lister
                id="Artists"
                {data}
                columns={artistsPreset}
                type="artist"
                virtualList={true}
                actionData={{
                    type: "artistGenre",
                    displayMode: "fullButtons",
                    data: Object.create({ name: genre.name }),
                }}
            />
        {/if}

        {#if type === "album"}
            <Lister
                id="Albums"
                {data}
                columns={albumsPreset}
                type="album"
                virtualList={true}
                actionData={{
                    type: "albumGenre",
                    displayMode: "fullButtons",
                    data: Object.create({ name: genre.name }),
                }}
            />
        {/if}

        {#if type === "song"}
            <Lister
                id="Songs"
                {data}
                columns={songsPreset}
                type="song"
                virtualList={true}
                actionData={{
                    type: "songGenre",
                    displayMode: "fullButtons",
                    data: Object.create({ name: genre.name }),
                }}
            />
        {/if}
    {/if}
{/key}
