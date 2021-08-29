<script>
    import { favoriteArtists } from "../logic/artist";
    import { favoriteAlbums } from "../logic/album";
    import { favoriteSongs } from "../logic/song";

    import Tabs from "../components/tabs.svelte";
    import Lister from '../components/lister.svelte';

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

<h1>Favorites</h1>

<Tabs bind:activeTabValue={currentTab} items={tabItems}>
    <div class="artists" style="display: {currentTab === 'artists' ? 'block' : 'none'}">
        {#await favoriteArtists({limit: 2000})}
            Loading favorite artists
        {:then artists}
            {#if artists.length > 0}
                <Lister data={artists} type="artist" />
            {:else}
                <p>No artists found</p>
            {/if}
        {:catch error}
            <p>An error occurred.</p>
        {/await}
    </div>

    <div class="albums" style="display: {currentTab === 'albums' ? 'block' : 'none'}">
        {#await favoriteAlbums({limit: 2000})}
            Loading favorite albums
        {:then albums}
            {#if albums.length > 0}
                <Lister data={albums} type="album" />
            {:else}
                <p>No albums found</p>
            {/if}
        {:catch error}
            <p>An error occurred.</p>
        {/await}
    </div>

    <div class="songs" style="display: {currentTab === 'songs' ? 'block' : 'none'}">
        {#await favoriteSongs({limit: 2000})}
            Loading favorite songs
        {:then songs}
            {#if songs.length > 0}
                <Lister data={songs} type="song" />
            {:else}
                <p>No songs found</p>
            {/if}
        {:catch error}
            <p>An error occurred.</p>
        {/await}
    </div>
</Tabs>