<script>
    import { onMount, onDestroy } from "svelte";
    import { flip } from 'svelte/animate';
    import { recentSongs } from "../../logic/song";
    import SongCard from "../song/songCard.svelte";
    import SVGAdd from "/src/images/add.svg";
    import { v4 as uuidv4 } from "uuid";

    let songs = [];
    let limit = 10;
    let fetching = false;

    $: songs = songs;

    async function getMore() {
        let newBatch = await recentSongs({limit: limit, offset: songs.length});

        for (let i = 0; i < newBatch.length; i++) {
            newBatch[i]._id = uuidv4();
        }

        songs = [...songs, ...newBatch];
    }

    async function getOne() {
        if (fetching) {
            return;
        }

        fetching = true;

        let newestSong = await recentSongs({limit: 1, offset: 0});

        if (newestSong[0].id !== songs[0].id) {
            newestSong[0]._id = uuidv4();
            songs = [newestSong[0], ...songs];
        }

        fetching = false;
    }

    // poll every 5 seconds for a song that differs from previously most recent
    let loop = window.setInterval(function () {
        getOne();
    }, 1000*5);

    onMount(async () => {
        // kick off initial fetch
        await getMore();
    });

    onDestroy(() => {
        // destroy timer
        clearInterval(loop);
    });
</script>

<section>
    {#if songs.length > 0}
        <ul class="song-scroll">
            {#each songs as song (song._id)}
                <li animate:flip="{{duration: 500}}">
                    <SongCard data={song} />
                </li>
            {/each}
            <li>
                <button on:click={getMore} class="load-more-button icon-button button--regular"><SVGAdd /></button>
            </li>
        </ul>
    {:else}
        <p>No recently played songs</p>
    {/if}
</section>

<style>
    .load-more-button {
        height: 100%;
    }
</style>