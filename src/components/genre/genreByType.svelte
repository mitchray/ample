<script>
    import { getGenre } from '../../logic/genre';
    import { getGenreSongs } from "../../logic/song";
    import { getArtistsByGenre } from "../../logic/artist";
    import { getAlbumsByGenre } from "../../logic/album";

    import Lister2 from '../../components/lister/lister.svelte';
    import Pagination2 from '../../components/pagination2.svelte';

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
        genre = await getGenre(id);

        if (id && genre.id) {
            switch (type) {
                case "artist":
                    data = await getArtistsByGenre({query: id, limit: limit, page: page});
                    break;
                case "album":
                    data = await getAlbumsByGenre({query: id, limit: limit, page: page});
                    break;
                case "song":
                    data = await getGenreSongs({query: id, limit: limit, page: page});
                    break;
                default:
                    break;
            }
        }

        loadedTime = new Date();
    }
</script>

<Pagination2 bind:limit bind:page bind:count type={type} defaultLimit={defaultLimit} />

{#await getGenre(id)}
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

<Pagination2 bind:limit bind:page bind:count type={type} defaultLimit={defaultLimit} />