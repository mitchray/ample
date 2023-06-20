<script>
    import { onMount } from "svelte";
    import { API } from "../../stores/api";
    import Lister from '../../components/lister/lister.svelte';

    export let id;
    export let type;

    let genre;
    let data = [];
    let loadedTime = 0;

    $: data = data;

    async function getData() {
        genre = await $API.genre({ filter: id });

        if (id && genre.id) {
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
        {#if type === 'artist'}
            <Lister
                data={data}
                type="artist"
                initialSort="name"
                virtualList={true}
                actionData={{
                    type: "artistGenre",
                    mode: "fullButtons",
                    data: Object.create({name: genre.name})
                }}
            />
        {/if}

        {#if type === 'album'}
            <Lister
                data={data}
                type="album"
                initialSort="name"
                virtualList={true}
                actionData={{
                    type: "albumGenre",
                    mode: "fullButtons",
                    data: Object.create({name: genre.name})
                }}
            />
        {/if}

        {#if type === 'song'}
            <Lister
                data={data}
                type="song"
                initialSort="name"
                virtualList={true}
                actionData={{
                    type: "songGenre",
                    mode: "fullButtons",
                    data: Object.create({name: genre.name})
                }}
            />
        {/if}
    {/if}
{/key}