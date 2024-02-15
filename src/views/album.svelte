<script>
    import { _ } from "svelte-i18n";
    import { getAlbumDisks } from "~/logic/album";
    import { formatTotalTime } from "~/logic/formatters.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { API, User } from "~/stores/state.js";
    import { checkbox, albumPreset } from "~/components/lister/columns.js";
    import Rating from "~/components/rating.svelte";
    import ThirdPartyServices from "~/components/thirdPartyServices.svelte";
    import Actions from "~/components/action/actions.svelte";
    import Genres from "~/components/genre/genres.svelte";
    import Lister from "~/components/lister/lister.svelte";
    import AlbumsAround from "~/components/album/albumsAround.svelte";
    import Art from "~/components/art.svelte";
    import ReleaseType from "~/components/releaseType.svelte";

    export let params = {};

    let disks = [];

    $: query = createQuery({
        queryKey: ["album", params.id],
        queryFn: async () => {
            let result = await $API.album({ filter: params.id });

            if (result.error) {
                console.error("Ample error getting album:", result.error);
                return [];
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: album = $query.data || {};

    // grab discs once we load the album
    $: $query.data, processData();

    async function processData() {
        if (!$query.data?.id) return;

        disks = [];
        disks = await getAlbumDisks(params.id);
    }
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
                        <Art size="large" data={album} type="album" />
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
                            <ReleaseType type={album.type} />
                        {/if}
                        <h1 class="title">{album.name}</h1>
                        <div class="artist">
                            <a href="#/artist/{album.artist.id}">
                                {album.artist.name}
                            </a>
                        </div>
                    </div>

                    <div class="meta">
                        <div class="entry">
                            <span class="field">{$_("text.year")}</span>
                            <span class="value">
                                <a
                                    href="#/album/year/{album.year}"
                                    title={album.year}
                                >
                                    {album.year}
                                </a>
                            </span>
                        </div>

                        {#if album.diskcount > 1}
                            <div class="entry">
                                <span class="field">
                                    {$_("text.disks", {
                                        values: { count: album.diskcount },
                                    })}
                                </span>
                                <span class="value">
                                    {album.diskcount}
                                </span>
                            </div>
                        {/if}

                        <div class="entry">
                            <span class="field">
                                {$_("text.songs")}
                            </span>
                            <span class="value">
                                {album.songcount}
                            </span>
                        </div>

                        <div class="entry">
                            <span class="field">
                                {$_("text.length")}
                            </span>
                            <span class="value">
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
                {#if disks.length > 0}
                    {#each disks as [disk, tracks]}
                        <section>
                            {#if disks.length > 1}
                                <h3 class="disk-title">Disc {disk}</h3>
                            {/if}

                            <Lister
                                id="Album"
                                data={tracks}
                                columns={[checkbox, ...albumPreset]}
                                type="song"
                                actionData={{
                                    disable: disks.length < 2,
                                    type: "album",
                                    id: album.id,
                                    displayMode: "fullButtons",
                                    showShuffle: tracks.length > 1,
                                    data: Object.create({
                                        songs: tracks,
                                    }),
                                }}
                                options={{
                                    showArt: false,
                                }}
                            />
                        </section>
                    {/each}
                {/if}
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
        border-radius: 6px;
        overflow: hidden;
        font-size: 0;
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

    .meta {
        display: flex;
        flex-direction: row;
        column-gap: var(--spacing-xl);
        row-gap: var(--spacing-lg);
        flex-wrap: wrap;
    }

    .meta .entry {
        display: flex;
        flex-direction: column;
    }

    .meta .field {
        color: var(--color-on-surface-variant);
        flex-shrink: 0;
    }

    .meta .value {
        font-size: 1.2em;
        font-weight: 500;
    }

    section:not(:first-of-type) {
        margin-block-start: var(--spacing-xxxl);
    }

    .disk-title {
        margin-block-end: var(--spacing-md);
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
