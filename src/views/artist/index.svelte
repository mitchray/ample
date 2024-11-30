<script>
    import { _ } from "svelte-i18n";
    import { push, replace } from "svelte-spa-router";
    import { createQuery } from "@tanstack/svelte-query";
    import { fade } from "svelte/transition";
    import { API, PageTitle, User } from "~/stores/state.js";
    import { formatTotalTime } from "~/logic/formatters.js";
    import Rating from "~/components/rating/rating.svelte";
    import ThirdPartyServices from "~/components/thirdPartyServices.svelte";
    import Actions from "~/components/action/actions.svelte";
    import Genres from "~/components/genre/genres.svelte";
    import Art from "~/components/art.svelte";
    import Releases from "~/views/artist/releases.svelte";
    import All from "~/views/artist/all.svelte";
    import Top from "~/views/artist/top.svelte";
    import Similar from "~/views/artist/similar.svelte";
    import Musicbrainz from "~/views/artist/musicbrainz.svelte";
    import { addAlert } from "~/logic/alert.js";
    import { errorHandler } from "~/logic/helper.js";
    import Visibility from "~/components/visibility.svelte";

    let { params = {} } = $props();

    let query = $derived(
        createQuery({
            queryKey: ["artist", params.id],
            queryFn: async () => {
                let result = await $API.artist({ filter: params.id });

                if (result.error) {
                    addAlert({
                        title: $_("text.IDChanged"),
                        style: "info",
                    });
                    await push(`/artists/`);

                    errorHandler("getting artist", result.error);
                    return [];
                }

                return result;
            },
            enabled: $User.isLoggedIn,
        }),
    );

    // alias of returned data
    let artist = $derived($query.data || {});

    $effect(() => {
        $PageTitle = artist?.name || $_("text.artist");
    });

    // default to releases tab
    $effect(() => {
        if (!params.section) replace(`#/artist/${params.id}/releases`);
    });

    const tabs = [
        { id: "releases", label: $_("text.releases"), prefix: "album" },
        { id: "top", label: $_("text.popularSongs") },
        { id: "all", label: $_("text.allSongs") },
        { id: "similar", label: $_("text.similarArtists") },
        { id: "musicbrainz", label: $_("text.musicbrainzCompare") },
    ];

    function changeTab(e) {
        replace(`#/artist/${params.id}/${e.detail.name}`);
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
            <div class="header" in:fade>
                <h1 class="title">{artist.name}</h1>
                <div class="profile">
                    <div class="art-container">
                        <Art
                            size="large"
                            data={artist}
                            type="artist"
                            radius="6px"
                        />
                    </div>

                    <div class="below-image">
                        <div class="rating">
                            <Rating type="artist" data={artist} />
                        </div>

                        <div class="third-party-links">
                            <ThirdPartyServices data={artist} type="artist" />
                        </div>
                    </div>
                </div>

                <div class="details">
                    <div class="meta-container">
                        {#if artist.albumcount > 0}
                            <div class="meta-entry">
                                <span class="meta-field">
                                    {$_("text.releasesPlural", {
                                        values: {
                                            count: parseInt(artist.albumcount),
                                        },
                                    })}
                                </span>
                                <span class="meta-value">
                                    {artist.albumcount}
                                </span>
                            </div>
                        {/if}

                        {#if artist.appearanceCount > 0}
                            <div class="meta-entry">
                                <span class="meta-field">
                                    {$_("text.appearancesPlural", {
                                        values: {
                                            count: parseInt(
                                                artist.appearanceCount,
                                            ),
                                        },
                                    })}
                                </span>
                                <span class="meta-value">
                                    {artist.appearanceCount}
                                </span>
                            </div>
                        {/if}

                        <div class="meta-entry">
                            <span class="meta-field">
                                {$_("text.songsPlural", {
                                    values: {
                                        count: parseInt(artist.songcount),
                                    },
                                })}
                            </span>
                            <span class="meta-value">
                                {artist.songcount}
                            </span>
                        </div>

                        {#if artist.time > 0}
                            <div class="meta-entry">
                                <span class="meta-field">
                                    {$_("text.total")}
                                </span>
                                <span class="meta-value">
                                    {formatTotalTime(artist.time)}
                                </span>
                            </div>
                        {/if}

                        {#if artist.yearformed}
                            <div class="meta-entry">
                                <span class="meta-field">
                                    {$_("text.yearFormed")}
                                </span>
                                <span class="meta-value">
                                    <a
                                        href="#/album/year/{artist.yearformed}"
                                        title={artist.yearformed}
                                    >
                                        {artist.yearformed}
                                    </a>
                                </span>
                            </div>
                        {/if}

                        {#if artist.placeformed}
                            <div class="meta-entry">
                                <span class="meta-field">
                                    {$_("text.placeFormed")}
                                </span>
                                <span class="meta-value">
                                    {artist.placeformed}
                                </span>
                            </div>
                        {/if}
                    </div>

                    <Genres genres={artist.genre} />

                    <div class="actions">
                        <Actions
                            type="artist"
                            displayMode="fullButtons"
                            showShuffle={artist.songcount > 1}
                            item={artist}
                        />
                    </div>
                </div>

                {#if artist.summary?.replace(/\s/g, "").length > 0}
                    <div class="summary">
                        <p>{artist.summary}</p>
                    </div>
                {/if}
            </div>

            <div class="tabs">
                <sl-tab-group onsl-tab-show={changeTab}>
                    {#each tabs as tab}
                        <sl-tab
                            slot="nav"
                            panel={tab.id}
                            active={tab.id === params.section}
                        >
                            {tab.label}
                        </sl-tab>
                    {/each}

                    <sl-tab-panel name="releases">
                        <Visibility>
                            <Releases artistID={params.id} />
                        </Visibility>
                    </sl-tab-panel>

                    <sl-tab-panel name="top">
                        <Visibility>
                            <Top artistID={params.id} />
                        </Visibility>
                    </sl-tab-panel>

                    <sl-tab-panel name="all">
                        <Visibility>
                            <All artistID={params.id} />
                        </Visibility>
                    </sl-tab-panel>

                    <sl-tab-panel name="similar">
                        <Visibility>
                            <Similar artistID={params.id} />
                        </Visibility>
                    </sl-tab-panel>

                    <sl-tab-panel name="musicbrainz">
                        <Visibility>
                            <Musicbrainz {artist} />
                        </Visibility>
                    </sl-tab-panel>
                </sl-tab-group>
            </div>
        {/key}
    {/if}
{/if}

<style>
    .tabs {
        max-width: 100%;
        overflow: hidden;
        position: relative; /* needed to ensure third party links show on top */
        z-index: -1; /* needed to ensure third party links show on top */
    }

    .tabs sl-tab-panel::part(base) {
        min-height: calc(
            100vh - 180px
        ); /* reduce position shift between tabs */
    }

    .header {
        position: relative;
        display: grid;
        grid-template-areas:
            "title"
            "profile"
            "details"
            "summary";
        grid-template-rows: auto auto auto auto;
        gap: var(--spacing-xl);
        margin-block-end: var(--spacing-lg);
        overflow: initial; /* let the art glow through */
    }

    .art-container {
        aspect-ratio: 1 / 1;
        overflow: hidden;
        font-size: 0;
        position: relative;
    }

    :global(.sl-theme-dark) .art-container {
        filter: url(#blur-and-scale);
    }

    .profile {
        grid-area: profile;
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

    .title {
        grid-area: title;
        --roboto-opsz: 50;
        line-height: 1;
        justify-self: center;
        font-weight: 300;
        margin-block-end: 0;
    }

    .details {
        grid-area: details;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl);
    }

    .actions {
        display: flex;
        flex-direction: column-reverse;
        gap: var(--spacing-lg);
    }

    .summary {
        grid-area: summary;
        line-height: 1.5;
    }

    .summary :global(p:first-of-type) {
        margin-block-start: 0;
    }

    @container (min-width: 530px) {
        .header {
            grid-template-areas:
                "profile title"
                "profile details"
                "summary summary";
            grid-template-rows: auto 1fr auto;
            grid-template-columns: min-content auto;
            column-gap: var(--spacing-xl);
        }

        .title {
            justify-self: unset;
        }
    }

    @container (min-width: 800px) {
        .profile {
            width: 250px;
        }

        .title {
            font-size: 50px;
            font-weight: 200;
        }
    }

    @container (min-width: 1100px) {
        .header {
            grid-template-areas:
                "profile title   title   title"
                "profile details summary SPACER"
                "profile details summary SPACER";
            grid-template-rows: min-content auto 1fr;
            grid-template-columns: min-content auto auto 1fr;
            column-gap: var(--spacing-xxl);
        }

        .summary {
            max-width: 80ch;
        }
    }
</style>
