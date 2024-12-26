<script>
    import { API, Server } from "~/stores/state.js";
    import { shuffle, uniqBy } from "lodash-es";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { errorHandler } from "~/logic/helper.js";
    import { untrack } from "svelte";

    /** @type {{data: any, type: "song" | "album" | "artist" | "playlist" | "podcast_episode" | "live_stream" | "mix", size?: "thumbnail" | "small" | "medium" | "large", radius?: string}} */
    let { data, type, size = "medium", radius = "0px" } = $props();

    let dimension = $derived.by(() => {
        switch (size) {
            case "thumbnail":
                return 64; // 64 x 64 (128 x 128 true size)
            case "small":
                return 128; // 128 x 128 (256 x 256 true size)
            case "large":
                return 384; // 384 x 384 (768 x 768 true size)
            case "medium":
            default:
                return "200"; // Ampache default value; 200 x 200 (400 x 400 true size)
        }
    });

    let thumb = $derived.by(() => {
        switch (size) {
            case "thumbnail":
                return 64; // 64 x 64 (128 x 128 true size)
            case "small":
                return 2; // 128 x 128 (256 x 256 true size)
            case "large":
                return 32; // 384 x 384 (768 x 768 true size)
            case "medium":
            default:
                return "default"; // non-existent, will fall through to Ampache default value; 200 x 200 (400 x 400 true size)
        }
    });

    let images = $state([]);

    $effect(() => {
        untrack(async () => {
            let query = [];

            if (type === "playlist" || type === "smartlist") {
                query = await $API.playlistSongs({
                    filter: data.id,
                    limit: 30,
                });

                if (query.error) {
                    errorHandler("getting art", query.error);
                    return [];
                }

                query = uniqBy(query.song, "album.id");

                if (type === "smartlist") {
                    query = shuffle(query);
                }

                query = query.slice(0, 4);
            }

            if (query.length === 4) {
                query.forEach((song) => images.push(song.art));
            } else if (query.length > 0) {
                images.push(query[0].art);
            } else {
                images.push(data.art);
            }
        });
    });
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
                onerror={(e) => {
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
        background-color: oklch(50% 0 0 / 20%);
    }

    /* :after reserved for the inset border/shadow to stand out against background */
    .container:after {
        content: "";
        position: absolute;
        inset: 0;
        z-index: 1;
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
