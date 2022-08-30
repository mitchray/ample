<script>
    import { favoriteArtists } from "../logic/artist";
    import { favoriteAlbums } from "../logic/album";
    import { favoriteSongs } from "../logic/song";

    import Tabs from "../components/tabs.svelte";
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

<h1 class="page-title">Favorites</h1>

<Tabs bind:activeTabValue={currentTab} bind:items={tabItems}>
    {#each tabItems as tab}
        {#if tab.loaded === true}
            {#if tab.value === 'artists'}
                <div class="artists" style="display: {currentTab === 'artists' ? 'block' : 'none'}">
                    {#await favoriteArtists({limit: 100})}
                        Loading favorite artists
                    {:then artists}
                        {#if artists.length > 0}
                            <Lister2
                                data={artists}
                                type="artist"
                                actionData={{
                                    type: "artists",
                                    mode: "fullButtons",
                                    data: Object.create({artists: artists})
                                }}
                            />
                        {:else}
                            <p>No artists found</p>
                        {/if}
                    {:catch error}
                        <p>An error occurred.</p>
                    {/await}
                </div>
            {/if}

            {#if tab.value === 'albums'}
                <div class="albums" style="display: {currentTab === 'albums' ? 'block' : 'none'}">
                    {#await favoriteAlbums({limit: 100})}
                        Loading favorite albums
                    {:then albums}
                        {#if albums.length > 0}
                            <Lister2
                                data={albums}
                                type="album"
                                actionData={{
                                    type: "albums",
                                    mode: "fullButtons",
                                    data: Object.create({albums: albums})
                                }}
                            />
                        {:else}
                            <p>No albums found</p>
                        {/if}
                    {:catch error}
                        <p>An error occurred.</p>
                    {/await}
                </div>
            {/if}

            {#if tab.value === 'songs'}
                <div class="songs" style="display: {currentTab === 'songs' ? 'block' : 'none'}">
                    {#await favoriteSongs({limit: 100})}
                        Loading favorite songs
                    {:then songs}
                        {#if songs.length > 0}
                            <Lister2
                                data={songs}
                                type="song"
                                actionData={{
                                    type: "",
                                    mode: "fullButtons",
                                    data: Object.create({songs: songs})
                                }}
                            />
                        {:else}
                            <p>No songs found</p>
                        {/if}
                    {:catch error}
                        <p>An error occurred.</p>
                    {/await}
                </div>
            {/if}
        {/if}
    {/each}
</Tabs>