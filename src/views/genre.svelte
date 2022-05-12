<script>
    import { onMount } from 'svelte';
    import { Link } from 'svelte-routing';

    import { getGenre } from '../logic/genre';
    import { getGenreSongs } from "../logic/song";
    import { getArtistsByGenre } from "../logic/artist";
    import { getAlbumsByGenre } from "../logic/album";

    import Actions from '../components/actions.svelte';
    import LinkCard from '../components/linkCard.svelte';
    import Lister2 from '../components/lister/lister.svelte';

    import SVGGenre from "../../public/images/label.svg";

    export let id;
    export let type;

    let genre;
    let data = [];
    let loading = true;

    onMount(async () => {
        genre = await getGenre(id);

        if (id && genre.id) {
            switch (type) {
                case "artists":
                    data = await getArtistsByGenre({query: id, limit: 0});
                    break;
                case "albums":
                    data = await getAlbumsByGenre({query: id, limit: 0});
                    break;
                case "songs":
                    data = await getGenreSongs({query: id, limit: 0});
                    break;
                default:
                    break;
            }
        }

        loading = false;
    })
</script>

{#if !loading}
    {#if genre}
        <h1 class="page-title">
            {#if type}
                {type} with: <Link to="genres/{id}"><SVGGenre class="inline" /> {genre.name}</Link>
            {:else }
                <SVGGenre class="inline" /> {genre.name}
            {/if}
        </h1>

        {#if !type}
            <section class="link-grid">
                <LinkCard url="genres/{genre.id}/artists">Artists</LinkCard>
                <LinkCard url="genres/{genre.id}/albums">Albums</LinkCard>
                <LinkCard url="genres/{genre.id}/songs">Songs</LinkCard>
            </section>
        {/if}

        {#if data.length > 0}
            {#if type === 'artists'}
                <Actions type="artistGenre" mode="fullButtons" data="{genre.name}" />
                <Lister2 data={data} type="artist" activeSort="title"/>
            {/if}

            {#if type === 'albums'}
                <Actions type="albumGenre" mode="fullButtons" data="{genre.name}" />
                <Lister2 data={data} type="album" activeSort="title"/>
            {/if}

            {#if type === 'songs'}
                <Actions type="songGenre" mode="fullButtons" data="{genre.name}" />
                <Lister2 data={data} type="song" activeSort="title"/>
            {/if}
        {/if}
    {:else}
        <p>No results</p>
    {/if}
{:else}
    <p>Loading</p>
{/if}