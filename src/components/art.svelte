<script>
    import { onMount } from "svelte";
    import { API, Server } from "~/stores/state.js";
    import { shuffle, uniqBy } from "lodash-es";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { errorHandler } from "~/logic/helper.js";

    /** Data of the item */
    export let data;

    /** Type of object */
    /** @type {"song" | "album" | "artist" | "playlist" | "podcast_episode" | "live_stream" | "mix"} */
    export let type;

    /** @type {"thumbnail" | "small" | "medium" | "large"} */
    export let size = "medium";

    /** @type string */
    export let radius = "0px";

    let dimension = 128;
    let thumb = 2;
    let images = [];

    let playlistSongs = [];

    onMount(async () => {
        let result = [];

        if (type === "playlist" || type === "smartlist") {
            result = await $API.playlistSongs({
                filter: data.id,
                limit: 30,
            });

            if (result.error) {
                errorHandler("getting art", result.error);
                return [];
            }

            result = uniqBy(result, "album.id");

            if (type === "smartlist") {
                result = shuffle(result);
            }

            playlistSongs = result.slice(0, 4);
        }
    });

    // process the art once we finish fetching
    $: playlistSongs, processData();

    async function processData() {
        // if ($query.data?.length < 1) return;

        images = [];

        if (playlistSongs.length === 4) {
            playlistSongs.forEach((song) => images.push(song.art));
        } else if (playlistSongs.length > 0) {
            images.push(playlistSongs[0].art);
        } else {
            images.push(data.art);
        }

        images = images;

        switch (size) {
            case "thumbnail":
                thumb = 64; // 64 x 64 (128 x 128 true size)
                dimension = 64;
                break;
            case "small":
                thumb = 2; // 128 x 128 (256 x 256 true size)
                dimension = 128;
                break;
            case "large":
                thumb = 32; // 384 x 384 (768 x 768 true size)
                dimension = 384;
                break;
            case "medium":
            default:
                thumb = "default"; // non-existent, will fall through to Ampache default value; 200 x 200 (400 x 400 true size)
                dimension = 200;
                break;
        }
    }
</script>

<div
    class="c-art container"
    class:grid={images.length === 4}
    class:mix-effect={type === "mix"}
    style:border-radius={radius}
>
    {#if type === "live_stream"}
        <div class="live-stream-icon">
            <MaterialSymbol name="radio" />
        </div>
    {:else if images.length > 0}
        {#if type === "mix"}
            <MaterialSymbol
                name="play_arrow"
                fill={false}
                classes="mix-icon"
                weight="100"
                size="300px"
            />
        {/if}

        {#each images as image}
            <img
                src="{image}{thumb !== null ? `&thumb=${thumb}` : ''}"
                alt={data.name}
                height={dimension}
                width={dimension}
                data-id="art-{type}-{data.id}"
                on:error={(e) => {
                    e.onerror = null;
                    e.target.src =
                        $Server.ampacheURL +
                        "/image.php?object_id=0&object_type=album&thumb=32";
                }}
            />
        {/each}
    {:else}
        <img
            width={dimension}
            height={dimension}
            src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
            alt=""
        />
    {/if}
</div>

<style>
    .container {
        display: grid;
        gap: 0;
        grid-template-columns: repeat(2, 1fr);
        width: 100%;
        aspect-ratio: 1/1;
        overflow: hidden;
        align-self: start; /* don't stretch by default in flex parents */
        flex-shrink: 0;
        font-size: 0; /* hide the alt text */
        position: relative;
    }

    /* :after reserved for the inset border/shadow to stand out against background */
    .container:after {
        content: "";
        position: absolute;
        top: 0px;
        left: 0px;
        right: 0px;
        bottom: 0px;
        z-index: 1;
        /*pointer-events: none;*/
        /*background-color: lime;*/
        /*padding: 0;*/
        /*display: block;*/
        border: 1px solid transparent;
        border-radius: inherit;
    }

    :global(.sl-theme-dark) .container:after {
        border-color: hsla(0, 0%, 15%, 1);
        mix-blend-mode: lighten;
    }

    :global(.sl-theme-light) .container:after {
        border-color: hsla(0, 0%, 90%, 1);
        mix-blend-mode: darken;
    }

    img {
        object-fit: cover;
        grid-column: span 2;
        width: 100%;
    }

    .grid img {
        grid-column: span 1;
    }

    .live-stream-icon {
        height: 100%;
        aspect-ratio: 1/1;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 100%;
        background-color: var(--color-secondary-container);
        color: var(--color-on-secondary-container);
        font-size: 1.5rem;
    }

    .mix-effect {
        position: relative;
    }

    .c-art :global(.mix-icon) {
        position: absolute;
        top: 50%;
        left: 50%;
        z-index: 99;
        color: var(--color-tertiary-container);
        opacity: 0.8;
        transform: translate(-50%, -50%);
        filter: drop-shadow(0px 0px 15px black);
        pointer-events: none;
    }

    :global(.sl-theme-dark) .c-art :global(.mix-icon) {
        mix-blend-mode: plus-lighter;
    }

    :global(.sl-theme-light) .c-art :global(.mix-icon) {
        /*mix-blend-mode: screen;*/
    }

    .mix-effect:before {
        background-color: var(--color-secondary-container);
        content: "";
        height: 100%;
        left: 0;
        mix-blend-mode: plus-lighter;
        position: absolute;
        top: 0;
        width: 100%;
        z-index: 1;
    }

    :global(.sl-theme-dark) .mix-effect {
        background-color: var(--color-primary-container);
    }

    :global(.sl-theme-dark) .mix-effect:before {
        background-color: var(--color-secondary-container);
        mix-blend-mode: plus-lighter;
    }

    :global(.sl-theme-dark) .mix-effect img {
        filter: grayscale(100%) contrast(110%);
        mix-blend-mode: multiply;
    }

    :global(.sl-theme-light) .mix-effect {
        background-color: var(--color-primary-container);
    }

    :global(.sl-theme-light) .mix-effect:before {
        background-color: var(--color-on-secondary-container);
        mix-blend-mode: screen;
    }

    :global(.sl-theme-light) .mix-effect img {
        filter: grayscale(100%) contrast(70%);
        mix-blend-mode: multiply;
    }
</style>
