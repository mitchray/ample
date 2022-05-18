<script>
    import { getGenre } from '../logic/genre';

    import Tabs from "../components/tabs.svelte";
    import GenreByType from '../components/genre/genre_type.svelte';

    import SVGGenre from "../../public/images/label.svg";
    import SVGArtist from "../../public/images/artist.svg";
    import SVGAlbum from "../../public/images/album.svg";
    import SVGSong from "../../public/images/music_note.svg";

    export let id;
    let currentTab;

    let tabItems = [
        { label: "Artists", value: "artists", icon: SVGArtist },
        { label: "Albums",  value: "albums",  icon: SVGAlbum },
        { label: "Songs",   value: "songs",   icon: SVGSong },
    ];
</script>

{#await getGenre(id)}
    Loading genre
{:then genre}
    {#if genre.id}
        <h1 class="page-title">
            <SVGGenre class="inline" /> {genre.name}
        </h1>

        <Tabs bind:activeTabValue={currentTab} bind:items={tabItems}>
            {#each tabItems as tab}
                {#if tab.loaded === true}
                    {#if tab.value === 'artists'}
                        <div class="artists" style="display: {currentTab === 'artists' ? 'block' : 'none'}">
                            <GenreByType id={genre.id} type={tab.value} />
                        </div>
                    {/if}

                    {#if tab.value === 'albums'}
                        <div class="albums" style="display: {currentTab === 'albums' ? 'block' : 'none'}">
                            <GenreByType id={genre.id} type={tab.value} />
                        </div>
                    {/if}

                    {#if tab.value === 'songs'}
                        <div class="songs" style="display: {currentTab === 'songs' ? 'block' : 'none'}">
                            <GenreByType id={genre.id} type={tab.value} />
                        </div>
                    {/if}
                {/if}
            {/each}
        </Tabs>
    {:else}
        <p>No genre found with that ID</p>
    {/if}
{:catch error}
    <p>An error occurred.</p>
{/await}