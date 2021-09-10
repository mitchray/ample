<script>
    import { topArtists } from "../logic/artist";
    import { topAlbums } from "../logic/album";
    import { topSongs } from "../logic/song";

    import Tabs from "../components/tabs.svelte";
    import Lister from '../components/lister.svelte';
    import Lister2 from '../components/lister/lister.svelte';

    import SVGArtist from "../../public/images/artist.svg";
    import SVGAlbum from "../../public/images/album.svg";
    import SVGSong from "../../public/images/music_note.svg";

    // Current active tab
    let currentTab;

    let tabItems = [
        { label: "Artists", value: "artists", icon: SVGArtist },
        { label: "Albums",  value: "albums",  icon: SVGAlbum },
        { label: "Songs",   value: "songs",   icon: SVGSong },
    ];
</script>

<h1>Top Rated</h1>

<Tabs bind:activeTabValue={currentTab} items={tabItems}>
    <div class="artists" style="display: {currentTab === 'artists' ? 'block' : 'none'}">
        {#await topArtists({limit: 2000})}
            Loading top artists
        {:then artists}
            {#if artists.length > 0}
                <Lister2 data={artists} type="artist" activeSort="rating" sortReverse="true" />
            {:else}
                <p>No artists found</p>
            {/if}
        {:catch error}
            <p>An error occurred.</p>
        {/await}
    </div>

    <div class="albums" style="display: {currentTab === 'albums' ? 'block' : 'none'}">
        {#await topAlbums({limit: 2000})}
            Loading top albums
        {:then albums}
            {#if albums.length > 0}
                <Lister2 data={albums} type="album" activeSort="rating" sortReverse="true" />
            {:else}
                <p>No albums found</p>
            {/if}
        {:catch error}
            <p>An error occurred.</p>
        {/await}
    </div>

    <div class="songs" style="display: {currentTab === 'songs' ? 'block' : 'none'}">
        {#await topSongs({limit: 2000})}
            Loading top songs
        {:then songs}
            {#if songs.length > 0}
                <Lister2 data={songs} type="song" activeSort="rating" sortReverse="true" />
            {:else}
                <p>No songs found</p>
            {/if}
        {:catch error}
            <p>An error occurred.</p>
        {/await}
    </div>
</Tabs>