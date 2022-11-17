<script>
    import CardList from '../components/cardList.svelte';
    import Tabs from "../components/tabs.svelte";
    
    import SVGArtist from "/src/images/artist.svg";
    import SVGAlbum from "/src/images/album.svg";
    import SVGSong from "/src/images/music_note.svg";

    // List of tab items with labels and values.
    let tabItems = [
        { label: "Artists", value: "artists", icon: SVGArtist },
        { label: "Albums",  value: "albums",  icon: SVGAlbum },
        { label: "Songs",   value: "songs",   icon: SVGSong },
    ];

    let currentTab;
</script>

<h1 class="page-title">Random</h1>

<Tabs bind:activeTabValue={currentTab} bind:items={tabItems}>
    {#each tabItems as tab}
        {#if tab.loaded === true}
            {#if tab.value === 'artists'}
                <div class="artists" style="display: {currentTab === 'artists' ? 'block' : 'none'}">
                    <CardList type="artist" dataProvider={"randomArtists"} limit=18 refresh={true} />
                </div>
            {/if}

            {#if tab.value === 'albums'}
                <div class="albums" style="display: {currentTab === 'albums' ? 'block' : 'none'}">
                    <CardList type="album" dataProvider={"randomAlbums"} limit=18 refresh={true} />
                </div>
            {/if}

            {#if tab.value === 'songs'}
                <div class="songs" style="display: {currentTab === 'songs' ? 'block' : 'none'}">
                    <CardList type="song" dataProvider={"randomSongs"} limit=18 refresh={true} />
                </div>
            {/if}
        {/if}
    {/each}
</Tabs>