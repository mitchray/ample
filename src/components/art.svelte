<script>
    import { API, Server, User } from "~/stores/state.js";
    import { uniqBy, shuffle } from "lodash-es";
    import { createQuery } from "@tanstack/svelte-query";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    /** Data of the item */
    export let data;

    /** Type of object */
    /** @type {"song" | "album" | "artist" | "playlist" | "podcast_episode" | "live_stream"} */
    export let type;

    /** @type {"thumbnail" | "small" | "medium" | "large"} */
    export let size = "medium";

    let dimension = 128;
    let thumb = 2;
    let images = [];

    $: query = createQuery({
        queryKey: ["art", data.id + type],
        staleTime: 60 * 30000, // 30 minutes
        queryFn: async () => {
            let result = [];

            if (type === "playlist" || type === "smartlist") {
                result = await $API.playlistSongs({
                    filter: data.id,
                    limit: 30,
                });

                if (result.error) {
                    console.error("Ample error getting art", result.error);
                    return [];
                }

                result = uniqBy(result, "album.id");

                if (type === "smartlist") {
                    result = shuffle(result);
                }

                result = result.slice(0, 4);
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: playlistSongs = $query.data || [];

    // process the art once we finish fetching
    $: $query.data, processData();

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

<div class="c-art container" class:grid={images.length === 4}>
    {#if type === "live_stream"}
        <div class="live-stream-icon">
            <MaterialSymbol name="radio" />
        </div>
    {:else if images.length > 0}
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
                        $Server.url +
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
</style>
