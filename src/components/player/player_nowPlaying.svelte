<script>
    import { CurrentMedia } from "~/stores/state";
    import Art from "~/components/art.svelte";
    import ArtistList from "~/components/artist/artistList.svelte";

    let parentInfo = $derived.by(() => {
        let info = {};

        if ($CurrentMedia) {
            if ($CurrentMedia.object_type === "song") {
                info.name =
                    ($CurrentMedia.year ? `${$CurrentMedia.year} - ` : null) +
                    $CurrentMedia.album?.name;
                info.url = `#/album/${$CurrentMedia.album?.id}`;
            }

            if ($CurrentMedia.object_type === "podcast_episode") {
                info.name = $CurrentMedia.podcast?.name;
                info.url = `#/podcast/${$CurrentMedia.podcast?.id}`;
            }

            if ($CurrentMedia.object_type === "live_stream") {
                info.name = $CurrentMedia.name;
                info.url = `#/radio-station/${$CurrentMedia.id}`;
            }
        } else {
            info = {};
        }

        return info;
    });
</script>

<div class="container">
    {#if $CurrentMedia}
        {#key $CurrentMedia}
            <div class="art">
                <sl-tooltip content={parentInfo?.name}>
                    <a href={parentInfo?.url}>
                        <Art
                            data={$CurrentMedia}
                            type={$CurrentMedia.object_type}
                            size="small"
                        />
                    </a>
                </sl-tooltip>
            </div>

            <div class="text">
                <div class="title truncate" title={$CurrentMedia.name}>
                    {#if $CurrentMedia.object_type === "live_stream"}
                        <a href="#/radio-station/{$CurrentMedia.id}">
                            {$CurrentMedia.name}
                        </a>
                    {:else if $CurrentMedia.object_type === "podcast_episode"}
                        <a href="#/podcast-episode/{$CurrentMedia.id}">
                            {$CurrentMedia.name}
                        </a>
                    {:else}
                        <a href="#/song/{$CurrentMedia.id}">
                            {$CurrentMedia.name}
                        </a>
                    {/if}
                </div>

                {#if $CurrentMedia.object_type === "live_stream"}
                    <div class="truncate secondary-info">
                        {$CurrentMedia.site_url}
                    </div>
                {/if}

                {#if $CurrentMedia.object_type === "podcast_episode"}
                    <div class="truncate secondary-info">
                        <a href="#/podcast/{$CurrentMedia.podcast?.id}">
                            {$CurrentMedia.podcast?.name}
                        </a>
                    </div>
                {/if}

                {#if $CurrentMedia.artists?.length > 0}
                    <div class="truncate secondary-info">
                        <ArtistList data={$CurrentMedia} />
                    </div>
                {/if}
            </div>
        {/key}
    {:else}
        <sl-skeleton
            style="--border-radius: 2px; aspect-ratio: 1/1; width: 50px; flex-shrink: 0;"
        ></sl-skeleton>

        <div
            style="display: flex; flex-direction:column; gap: var(--spacing-md); width: 100%;"
        >
            <sl-skeleton style="width: 80%;"></sl-skeleton>
            <sl-skeleton style="width: 40%;"></sl-skeleton>
        </div>
    {/if}
</div>

<style>
    .container {
        display: flex;
        gap: var(--spacing-md);
        align-items: center;
        height: 100%;
    }

    .art {
        border-radius: 3px;
        width: 50px;
        flex-shrink: 0;
        overflow: hidden;
    }

    /* live stream icon */
    .art :global(.c-art .live-stream-icon) {
        font-size: 36px;
    }

    .text {
        overflow: hidden;
    }
</style>
