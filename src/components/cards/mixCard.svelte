<script>
    import { _ } from "svelte-i18n";
    import { API, User } from "~/stores/state.js";
    import Actions from "~/components/action/actions.svelte";
    import { sampleSize } from "lodash-es";
    import Art from "~/components/art.svelte";
    import ArtistList from "~/components/artist/artistList.svelte";
    import { createQuery } from "@tanstack/svelte-query";
    import { getSimilarArtistsWithGenreFallback } from "~/logic/artist.js";

    export let data = null; // needed for cardList dynamic components
    export let type = undefined; // ignored; workaround for card list component when type is 'generic'

    let playlist;

    $: playlist = data;

    $: query = createQuery({
        queryKey: ["playlistMix", playlist?.id],
        staleTime: 60 * 1000 * 30, // 30 minutes
        queryFn: async () => {
            let result = await getSimilarArtistsWithGenreFallback(playlist.id);

            return sampleSize(result, 3);
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: artists = $query.data || {};
</script>

<div class="mix-card card">
    {#if playlist}
        <div class="image-container">
            <a
                href="#/mix/{playlist.playlistType}/{playlist.id}"
                title={playlist.name}
            >
                <div class="image-text">{playlist.name}</div>
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
        color: var(--color-on-background);
    }

    .image-text::before {
        content: "";
        pointer-events: none;
        width: 100%;
        position: absolute;
        inset-inline-start: 0;
        inset-inline-end: 0;
        inset-block-end: 0;
        background-color: var(--color-background);
        z-index: -1;
    }

    /* on dark mode, fade it out */
    :global(.sl-theme-dark) .image-text::before {
        height: 100px;
        mask-image: linear-gradient(
            to top,
            hsl(0, 0%, 0%) 0%,
            hsla(0, 0%, 0%, 0.738) 19%,
            hsla(0, 0%, 0%, 0.541) 34%,
            hsla(0, 0%, 0%, 0.382) 47%,
            hsla(0, 0%, 0%, 0.278) 56.5%,
            hsla(0, 0%, 0%, 0.194) 65%,
            hsla(0, 0%, 0%, 0.126) 73%,
            hsla(0, 0%, 0%, 0.075) 80.2%,
            hsla(0, 0%, 0%, 0.042) 86.1%,
            hsla(0, 0%, 0%, 0.021) 91%,
            hsla(0, 0%, 0%, 0.008) 95.2%,
            hsla(0, 0%, 0%, 0.002) 98.2%,
            hsla(0, 0%, 0%, 0) 100%
        );
    }

    :global(.sl-theme-light) .image-text {
        backdrop-filter: blur(4px);
        color: var(--color-on-tertiary-container);
    }

    /* on light mode, use a solid bar */
    :global(.sl-theme-light) .image-text::before {
        height: 40px;
        opacity: 0.8;
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
