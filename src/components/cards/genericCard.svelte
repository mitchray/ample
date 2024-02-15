<script>
    import { onMount } from "svelte";
    import { formatReleaseType } from "~/logic/formatters.js";
    import Art from "~/components/art.svelte";
    import { CurrentMedia } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import Actions from "~/components/action/actions.svelte";

    /** The complete object being displayed */
    export let data = {};

    /** @type {'album' | 'artist' | 'song' | 'playlist' | 'smartlist' | 'podcast' | 'podcast_episode' | 'live_stream'} */
    export let type;

    export let showActions = true;

    let urlPrefix = "";

    onMount(() => {
        switch (type) {
            case "album":
                urlPrefix = "album";
                break;
            case "artist":
                urlPrefix = "artist";
                break;
            case "song":
                urlPrefix = "song";
                break;
            case "playlist":
                urlPrefix = "playlist";
                break;
            case "smartlist":
                urlPrefix = "smartlist";
                break;
            case "podcast":
                urlPrefix = "podcast";
                break;
            case "podcast_episode":
                urlPrefix = "podcast-episode";
                break;
            case "live_stream":
                urlPrefix = "radio-station";
                break;
            default:
                break;
        }
    });
</script>

{#key data?.id || 0}
    <div class="generic-card">
        {#if data}
            <a href="#/{urlPrefix}/{data.id}" title={data.name}>
                <Art {data} {type} size="thumbnail" />
            </a>

            <div class="details">
                {#if type === "album"}
                    <div class="secondary truncate secondary-info">
                        {#if data.year}<span class="year">
                                {data.year}
                            </span>{/if}
                        {#if data.type}<span
                                title={formatReleaseType(data.type)}
                            >
                                {formatReleaseType(data.type)}
                            </span>{/if}
                    </div>
                {/if}

                <a
                    class="title truncate"
                    href="#/{urlPrefix}/{data.id}"
                    title={data.name}
                >
                    {#if $CurrentMedia?.id === data.id}
                        <span class="current-icon">
                            <MaterialSymbol name="play_circle" />
                        </span>
                    {/if}
                    {data.name}
                </a>

                {#if type === "album"}
                    <div class="secondary truncate secondary-info">
                        {#if data.albumartist}
                            <a
                                href="#/artist/{data.albumartist.id}"
                                title={data.albumartist.name}
                            >
                                {data.albumartist.name}
                            </a>
                        {:else if data.artist}
                            <a
                                href="#/artist/{data.artist.id}"
                                title={data.artist.name}
                            >
                                {data.artist.name}
                            </a>
                        {/if}
                    </div>
                {/if}

                {#if type === "song"}
                    <div class="secondary truncate secondary-info">
                        {#if data.artist}
                            <a
                                href="#/artist/{data.artist.id}"
                                title={data.artist.name}
                            >
                                {data.artist.name}
                            </a>
                        {:else if data.albumartist}
                            <a
                                href="#/artist/{data.albumartist.id}"
                                title={data.albumartist.name}
                            >
                                {data.albumartist.name}
                            </a>
                        {/if}
                    </div>
                {/if}

                {#if type === "song"}
                    {#if data.album?.id}
                        <div class="secondary truncate secondary-info">
                            <a
                                href="#/album/{data.album.id}"
                                title={data.album.name}
                            >
                                {data.album.name}
                            </a>
                        </div>
                    {/if}
                {/if}

                {#if showActions}
                    <div class="actions">
                        <Actions
                            {type}
                            item={data}
                            showLinks={true}
                            displayMode="miniButtons"
                            showShuffle={data.songcount > 1}
                        />
                    </div>
                {/if}
            </div>
        {:else}
            <div style="display: flex; gap: var(--spacing-md); width: 100%;">
                <sl-skeleton
                    style="--border-radius: 5px; aspect-ratio: 1/1; height: 80px;"
                ></sl-skeleton>

                <div
                    style="display: flex; flex-direction: column; gap: var(--spacing-md); width: 100%; justify-content: center"
                >
                    <sl-skeleton style="width: 80%;"></sl-skeleton>
                    <sl-skeleton style="width: 40%;"></sl-skeleton>
                    <sl-skeleton style="width: 70%;"></sl-skeleton>
                </div>
            </div>
        {/if}
    </div>
{/key}

<style>
    /* Generic grids should have this on the containing element */
    :global(.generic-grid) {
        row-gap: var(--spacing-xl);
        column-gap: var(--spacing-md);
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }

    .generic-card {
        display: flex;
        flex-direction: row;
        overflow: hidden;
        gap: var(--spacing-md);
    }

    .generic-card :global(.c-art) {
        height: 80px;
        border-radius: 5px;
    }

    .generic-card :global(.c-art .live-stream-icon) {
        font-size: 36px;
    }

    .details {
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
    }

    .year + :global(*:before) {
        content: "\2022"; /* bullet */
        margin-inline-end: var(--spacing-sm);
    }
</style>
