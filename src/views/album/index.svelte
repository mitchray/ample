<script>
    import { run } from "svelte/legacy";

    import { _ } from "svelte-i18n";
    import { formatReleaseType, formatTotalTime } from "~/logic/formatters.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { API, PageTitle, User } from "~/stores/state.js";
    import Disks from "~/views/album/_disks.svelte";
    import Rating from "~/components/rating/rating.svelte";
    import ThirdPartyServices from "~/components/thirdPartyServices.svelte";
    import Actions from "~/components/action/actions.svelte";
    import Genres from "~/components/genre/genres.svelte";
    import AlbumsAround from "~/components/album/albumsAround.svelte";
    import Art from "~/components/art.svelte";
    import Badge from "~/components/badge.svelte";
    import { errorHandler } from "~/logic/helper.js";

    let { params = {} } = $props();

    let query = $derived(
        createQuery({
            queryKey: ["album", params.id],
            queryFn: async () => {
                let result = await $API.album({ filter: params.id });

                if (result.error) {
                    errorHandler("getting album", result.error);
                    return [];
                }

                return result;
            },
            enabled: $User.isLoggedIn,
        }),
    );

    // alias of returned data
    let album = $derived($query.data || {});

    run(() => {
        $PageTitle = album?.name || $_("text.album");
    });
</script>

{#if $query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if $query.isError}
    <p>Error: {$query.error.message}</p>
{:else if $query.isSuccess}
    {#if !$query.data.id}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        {#key $query.data.id}
            <div class="details">
                <div class="cover-rating">
                    <div class="art-container">
                        <Art
                            size="large"
                            data={album}
                            type="album"
                            radius="6px"
                        />
                    </div>

                    <div class="below-image">
                        <div class="rating">
                            <Rating type="album" data={album} />
                        </div>

                        <div class="third-party-links">
                            <ThirdPartyServices data={album} type="album" />
                        </div>
                    </div>
                </div>

                <div class="info">
                    <div class="name">
                        {#if album.type}
                            <Badge text={formatReleaseType(album.type)} />
                        {/if}
                        <h1 class="title">{album.name}</h1>
                        <div class="artist">
                            <a href="#/artist/{album.artist.id}">
                                {album.artist.name}
                            </a>
                        </div>
                    </div>

                    <div class="meta-container">
                        <div class="meta-entry">
                            <span class="meta-field">{$_("text.year")}</span>
                            <span class="meta-value">
                                <a
                                    href="#/albums/year/{album.year}"
                                    title={album.year}
                                >
                                    {album.year}
                                </a>
                            </span>
                        </div>

                        {#if album.diskcount > 1}
                            <div class="meta-entry">
                                <span class="meta-field">
                                    {$_("text.disks", {
                                        values: { count: album.diskcount },
                                    })}
                                </span>
                                <span class="meta-value">
                                    {album.diskcount}
                                </span>
                            </div>
                        {/if}

                        <div class="meta-entry">
                            <span class="meta-field">
                                {$_("text.songs")}
                            </span>
                            <span class="meta-value">
                                {album.songcount}
                            </span>
                        </div>

                        <div class="meta-entry">
                            <span class="meta-field">
                                {$_("text.length")}
                            </span>
                            <span class="meta-value">
                                {formatTotalTime(album.time)}
                            </span>
                        </div>
                    </div>

                    <Genres genres={album.genre} />

                    <div class="actions">
                        <Actions
                            type="album"
                            displayMode="fullButtons"
                            item={album}
                            showShuffle={album.songcount > 1}
                            data={Object.create({
                                artist: album.artist,
                            })}
                        />
                    </div>
                </div>
            </div>
            <div class="songs">
                <Disks albumID={album.id} />
            </div>

            <div class="albums-around-time">
                <AlbumsAround {album} />
            </div>
        {/key}
    {/if}
{/if}

<style>
    .details {
        display: grid;
        gap: var(--spacing-xl);
        grid-template-areas:
            "image"
            "info";
        margin-block-end: var(--spacing-xxl);
        overflow: initial; /* let the art glow through */
    }

    .info {
        grid-area: info;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl);
    }

    .cover-rating {
        grid-area: image;
        display: flex;
        flex-direction: column;
        align-items: center;
        min-width: 200px;
        max-width: 250px;
        justify-self: center;
    }

    .below-image {
        display: flex;
        justify-content: space-between;
        align-items: start;
        width: 100%;
        flex-wrap: wrap;
        padding-block-start: var(--spacing-md);
    }

    .art-container {
        aspect-ratio: 1 / 1;
        overflow: hidden;
        font-size: 0;
    }

    :global(.sl-theme-dark) .art-container {
        filter: url(#blur-and-scale);
    }

    .actions {
        display: flex;
        flex-direction: column-reverse;
        gap: var(--spacing-lg);
    }

    .name {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
        align-items: start;
    }

    .title {
        --roboto-opsz: 50;
        line-height: 1.1;
        margin-block-end: 0;
        font-weight: 300;
        text-wrap: balance;
    }

    section:not(:first-of-type) {
        margin-block-start: var(--spacing-xxxl);
    }

    @container (min-width: 530px) {
        .details {
            grid-template-areas: "image info";
            grid-template-columns: min-content 1fr;
        }
    }

    @container (min-width: 800px) {
        .title {
            font-size: 40px;
            font-weight: 200;
        }

        .cover-rating {
            width: 250px;
        }
    }
</style>
