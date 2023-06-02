<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { API } from "../../stores/api";
    import { serverURL } from "../../stores/server";
    import { cleanArtURL, shuffleArray } from "../../logic/helper";

    export let playlist = null;
    export let songs = [];
    export let fallback;

    let chosenSongs = [];
    let thumbLevel = 1;
    let cssClass = "";

    onMount(async () => {
        let initialSongs = [];
        let keepSongs = [];

        if (songs.length > 0) {
            initialSongs = shuffleArray(songs.slice());
            initialSongs = initialSongs.slice(0, 30);
        }

        if (playlist && playlist.id) {
            initialSongs = await $API.playlistSongs({ filter: playlist.id, limit: 30 });
        }

        keepSongs = keepUnique(initialSongs);

        switch (true) {
            case keepSongs.length > 3:
                keepSongs = keepSongs.slice(0, 4);
                thumbLevel = 4;
                cssClass = "four";
                break;
            default:
                keepSongs = keepSongs.slice(0, 1);
                thumbLevel = 22;
                cssClass = "one";
                break;
        }

        chosenSongs = keepSongs;
    });

    function keepUnique(arr) {
        let flag = {};
        let unique = [];
        arr.forEach((item) => {
            if (!flag[item.album.name]) {
                flag[item.album.name] = true;
                unique.push(item);
            }
        });

        return unique;
    }
</script>

<div class="container-wrapper">
    <div class="container {cssClass}">
        {#if chosenSongs.length > 0}
            {#each chosenSongs as song}
                <img src="{cleanArtURL(song.art)}&thumb={thumbLevel}"
                    alt=""
                    loading="lazy"
                    in:fade
                    width="384"
                    height="384"
                    on:error={e => { e.onerror=null; e.target.src=$serverURL + '/image.php?object_id=0&object_type=artist&thumb=22' }}
                />
            {/each}
        {:else}
            <img class="art"
                 src="{fallback}&thumb=32"
                 alt=""
                 width="384"
                 height="384"
                 on:error={e => { e.onerror=null; e.target.src=$serverURL + '/image.php?object_id=0&object_type=artist&thumb=32' }}
            />
        {/if}
    </div>
</div>

<style>
    .container-wrapper {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;
        border-radius: 5px;
    }

    .container {
        display: grid;
        gap: 0;
        grid-template-columns: repeat(2, 1fr);
        width: 100%;
        z-index: 10;
        aspect-ratio: 1/1;
        position: relative;
    }

    img {
        object-fit: cover;
    }

    .one img {
        grid-column: span 2;
    }

    .four img {
        grid-column: span 1;
    }

    .art {
        aspect-ratio: 1 / 1;
    }
</style>