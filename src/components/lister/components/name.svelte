<script>
    import { getContext } from "svelte";
    import { CurrentMedia } from "~/stores/state.js";
    import Art from "~/components/art.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    /** @type {Object} */
    export let data;

    /** @type {"album" | "song" | "podcast_episode" | "artist" | "playlist" | "smartlist" | "radio_station"} */
    export let type;
</script>

<!--    <Art {type} size="thumbnail" {data} radius="2px" />-->

<div class="container truncate">
    {#if data.id === $CurrentMedia?.id}
        <span class="current-icon">
            <MaterialSymbol name="play_circle" />
        </span>
    {/if}

    {#if type === "album"}
        <a href="#/album/{data.id}">{data.name}</a>
    {/if}

    {#if type === "song"}
        <a href="#/song/{data.id}">{data.name}</a>
    {/if}

    {#if type === "podcast"}
        <a href="#/podcast/{data.id}">{data.name}</a>
    {/if}

    {#if type === "podcast_episode"}
        <a href="#/podcast-episode/{data.id}">{data.name}</a>
    {/if}

    {#if type === "live_stream"}
        <a href="#/radio-station/{data.id}">{data.name}</a>
    {/if}

    {#if type === "artist"}
        <a href="#/artist/{data.id}">{data.name}</a>
    {/if}

    {#if type === "playlist"}
        <a href="#/playlist/{data.id}">{data.name}</a>
    {/if}

    {#if type === "smartlist"}
        <a href="#/smartlist/{data.id}">{data.name}</a>
    {/if}

    {#if type === "genre"}
        <a href="#/genre/{data.id}">{data.name}</a>
    {/if}
</div>
