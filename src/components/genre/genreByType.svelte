<script>
    import { API } from "../../stores/api";
    import Lister2 from '../../components/lister/lister.svelte';
    import Pagination from '../../components/Pagination.svelte';

    export let id;
    export let type;

    let genre;
    let data = [];
    let defaultLimit = 50;
    let page = 0;
    let count = 0;
    let loadedTime = 0;
    let limit = 0;

    $: count = data.length || 0;
    $: data = data;

    $: {
        if (limit > 0 || page) {
            getData();
        }
    }

    async function getData() {
        genre = await $API.genre({ filter: id });

        if (id && genre.id) {
            switch (type) {
                case "artist":
                    data = await $API.genreArtists({ filter: id, limit: limit, offset: limit * page });
                    break;
                case "album":
                    data = await $API.genreAlbums({ filter: id, limit: limit, offset: limit * page });
                    break;
                case "song":
                    data = await $API.genreSongs({ filter: id, limit: limit, offset: limit * page });
                    break;
                default:
                    break;
            }
        }

        loadedTime = new Date();
    }
</script>

{#await $API.genre({ filter: id })}
    Loading
{:then genre}
    {#if genre.id}
        {#key loadedTime}
            {#if type === 'artist'}
                <Lister2
                    data={data}
                    type="artist"
                    activeSort="title"
                    actionData={{
                        type: "artistGenre",
                        mode: "fullButtons",
                        data: Object.create({name: genre.name})
                    }}
                />
            {/if}

            {#if type === 'album'}
                <Lister2
                    data={data}
                    type="album"
                    activeSort="title"
                    actionData={{
                        type: "albumGenre",
                        mode: "fullButtons",
                        data: Object.create({name: genre.name})
                    }}
                />
            {/if}

            {#if type === 'song'}
                <Lister2
                    data={data}
                    type="song"
                    activeSort="title"
                    actionData={{
                        type: "songGenre",
                        mode: "fullButtons",
                        data: Object.create({name: genre.name})
                    }}
                />
            {/if}
        {/key}
    {/if}
{:catch error}
    <p>An error occurred.</p>
{/await}