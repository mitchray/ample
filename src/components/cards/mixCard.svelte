<script>
    import { run } from 'svelte/legacy';

    import { _ } from "svelte-i18n";
    import { User } from "~/stores/state.js";
    import Actions from "~/components/action/actions.svelte";
    import { sampleSize } from "lodash-es";
    import Art from "~/components/art.svelte";
    import ArtistList from "~/components/artist/artistList.svelte";
    import { createQuery } from "@tanstack/svelte-query";
    import { getSimilarArtistsWithGenreFallback } from "~/logic/artist.js";

    /** @type {{data?: any, type?: any}} */
    let { data = null, type = undefined } = $props();

    let playlist = $state();

    run(() => {
        playlist = data;
    });

    let query = $derived(createQuery({
        queryKey: ["playlistMix", playlist?.id],
        staleTime: 60 * 1000 * 30, // 30 minutes
        queryFn: async () => {
            let result = await getSimilarArtistsWithGenreFallback(playlist.id);

            return sampleSize(result, 3);
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let artists = $derived($query.data || {});
</script>

<div class="mix-card card">
    {#if playlist}
        <div class="image-container">
            <a
                href="#/mix/{playlist.playlistType}/{playlist.id}"
                title={playlist.name}
            >
                <div class="image-text truncate">{playlist.name}</div>
                <Art size="large" data={playlist} type="mix" radius="8px" />
            </a>
        </div>

        <div class="details">
            <div class="similar">
                {#if $query.isLoading}
                    <p>{$_("text.loading")}</p>
                    <br />
                {:else if $query.isError}
                    <p>Error: {$query.error.message}</p>
                {:else if $query.isSuccess}
                    {#if artists.length > 0}
                        <ArtistList
                            data={Object.create({ artists: artists })}
                            truncate={false}
                        />
                    {:else}
                        {$_("text.playlistJust", {
                            values: { name: playlist.name },
                        })}
                    {/if}
                {/if}
            </div>

            <div class="actions">
                <Actions
                    type="artistMix"
                    displayMode="miniButtons"
                    item={playlist}
                />
            </div>
        </div>
    {:else}
        <div
            style="display: flex; flex-direction: column; gap: var(--spacing-lg);"
        >
            <sl-skeleton
                style="--border-radius: 5px; aspect-ratio: 1/1; width: 100%;"
            ></sl-skeleton>

            <sl-skeleton style="width: 80%;"></sl-skeleton>
            <sl-skeleton style="width: 50%;"></sl-skeleton>
        </div>
    {/if}
</div>

<style>
    /* Playlist grids should have this on the containing element */
    :global(.mix-grid) {
        column-gap: var(--spacing-lg);
        row-gap: var(--spacing-xl);
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }

    :global(.mix-scroll) .mix-card {
        width: 220px;
    }

    .mix-card {
        height: 100%; /* equal height with siblings */
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
    }

    .image-container {
        position: relative;
        z-index: 1;
        justify-content: center;
        display: flex;
        overflow: hidden;
        aspect-ratio: 1 / 1;
        background-color: var(--color-background);
    }

    .image-container :global(img) {
        color: transparent;
        height: 100%;
        object-fit: cover;
        width: 100%;
    }

    .image-container :global(a) {
        display: flex; /* white space removal */
    }

    .image-text {
        z-index: 100;
        position: absolute;
        inset-block-end: 0;
        inset-inline-start: 0;
        inset-inline-end: 0;
        padding: var(--spacing-md);
        font-size: 18px;
        font-weight: 700;
        line-height: 1.2;
        backdrop-filter: blur(4px);
        color: var(--color-on-tertiary-container);
    }

    .image-text::before {
        content: "";
        pointer-events: none;
        width: 100%;
        position: absolute;
        inset-inline-start: 0;
        inset-inline-end: 0;
        inset-block-end: 0;
        z-index: -1;
        height: 40px;
    }

    :global(.sl-theme-dark) .image-text::before {
        opacity: 0.5;
        background-color: var(--color-background);
    }

    :global(.sl-theme-light) .image-text::before {
        opacity: 0.7;
        background-color: var(--color-tertiary-container);
    }

    .details {
        padding-block-start: var(--spacing-md);
        padding-inline-end: var(--spacing-md);
    }

    .similar {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        margin-block-end: var(--spacing-md);
    }

    .actions {
        display: flex;
    }
</style>
