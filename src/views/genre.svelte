<script>
    import { _ } from 'svelte-i18n';
    import { onMount } from "svelte";
    import { API } from "../stores/api";

    import Tabs from "../components/tabs/tabs.svelte";
    import Tab from "../components/tabs/tab.svelte";
    import GenreByType from '../components/genre/genreByType.svelte';

    import SVGGenre from "/src/images/label.svg";
    import SVGArtist from "/src/images/artist.svg";
    import SVGAlbum from "/src/images/album.svg";
    import SVGSong from "/src/images/music_note.svg";
    import { PageTitle } from "../stores/status";

    export let params = {}
    let genre;
    let currentTab;

    let tabItems = [
        { label: "Artists", value: "artists", icon: SVGArtist },
        { label: "Albums",  value: "albums",  icon: SVGAlbum },
        { label: "Songs",   value: "songs",   icon: SVGSong },
    ];

    onMount(async () => {
        genre = await $API.genre({ filter: params.id });
    });

    let title = $_('text.genre');
    $PageTitle = title;
</script>

<svelte:head>
    <title>{`${genre?.name}` || $_('text.loading')} (genre)</title>
</svelte:head>

{#if genre?.id}
    <h1 class="page-title">
        <SVGGenre class="inline" /> {genre.name}
    </h1>

    <Tabs bind:activeTabValue={currentTab} bind:items={tabItems} id="genre">
        {#each tabItems as tab}
            {#if tab.loaded === true}
                {#if tab.value === 'artists'}
                    <Tab id="artists" class="artists" bind:activeTabValue={currentTab}>
                        <GenreByType id={genre.id} type="artist" />
                    </Tab>
                {/if}

                {#if tab.value === 'albums'}
                    <Tab id="albums" class="albums" bind:activeTabValue={currentTab}>
                        <GenreByType id={genre.id} type="album" />
                    </Tab>
                {/if}

                {#if tab.value === 'songs'}
                    <Tab id="songs" class="songs" bind:activeTabValue={currentTab}>
                        <GenreByType id={genre.id} type="song" />
                    </Tab>
                {/if}
            {/if}
        {/each}
    </Tabs>
{:else}
    <p>{$_('text.loading')}</p>
{/if}