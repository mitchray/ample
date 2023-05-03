<script>
    import { PageTitle } from "../stores/status";
    import CardList from '../components/cardList.svelte';
    import Tabs from "../components/tabs/tabs.svelte";
    import Tab from "../components/tabs/tab.svelte";

    import SVGArtist from "/src/images/artist.svg";
    import SVGAlbum from "/src/images/album.svg";
    import SVGSong from "/src/images/music_note.svg";

    let currentTab;

    let tabItems = [
        { label: "Artists", value: "artists", icon: SVGArtist },
        { label: "Albums",  value: "albums",  icon: SVGAlbum },
        { label: "Songs",   value: "songs",   icon: SVGSong },
    ];

    let title = "Top Rated";
    $PageTitle = title;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<Tabs bind:activeTabValue={currentTab} bind:items={tabItems}>
    {#each tabItems as tab}
        {#if tab.loaded === true}
            {#if tab.value === 'artists'}
                <Tab id="artists" class="artists" bind:activeTabValue={currentTab}>
                    <CardList type="artist" dataProvider={"topArtists"} limit=18 />
                </Tab>
            {/if}

            {#if tab.value === 'albums'}
                <Tab id="albums" class="albums" bind:activeTabValue={currentTab}>
                    <CardList type="album" dataProvider={"topAlbums"} limit=18 />
                </Tab>
            {/if}

            {#if tab.value === 'songs'}
                <Tab id="songs" class="songs" bind:activeTabValue={currentTab}>
                    <CardList type="song" dataProvider={"topSongs"} limit=18 />
                </Tab>
            {/if}
        {/if}
    {/each}
</Tabs>