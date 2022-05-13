<script>
    import CardList from '../components/cardList.svelte';
    import Tabs from "../components/tabs.svelte";

    import SVGArtist from "../../public/images/artist.svg";
    import SVGAlbum from "../../public/images/album.svg";
    import SVGSong from "../../public/images/music_note.svg";

    // List of tab items with labels and values.
    let tabItems = [
        { label: "Artists", value: "artists", icon: SVGArtist },
        { label: "Albums",  value: "albums",  icon: SVGAlbum },
        { label: "Songs",   value: "songs",   icon: SVGSong },
    ];

    let currentTab;
</script>

<h1 class="page-title">Unrated</h1>

<Tabs bind:activeTabValue={currentTab} bind:items={tabItems}>
    {#each tabItems as tab}
        {#if tab.loaded === true}
            {#if tab.value === 'artists'}
                <div class="artists" style="display: {currentTab === 'artists' ? 'block' : 'none'}">
                    <CardList type="artist" dataProvider={"unratedArtists"} limit=6 refresh={true} />
                </div>
            {/if}

            {#if tab.value === 'albums'}
                <div class="albums" style="display: {currentTab === 'albums' ? 'block' : 'none'}">
                    <CardList type="album" dataProvider={"unratedAlbums"} limit=6 refresh={true} />
                </div>
            {/if}

            {#if tab.value === 'songs'}
                <div class="songs" style="display: {currentTab === 'songs' ? 'block' : 'none'}">
                    <CardList type="song" dataProvider={"unratedSongs"} limit=9 refresh={true} />
                </div>
            {/if}
        {/if}
    {/each}
</Tabs>
