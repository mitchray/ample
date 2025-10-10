<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { location } from "svelte-spa-router";
    import { API, PageTitle, User } from "~/stores/state";
    import Rating from "~/components/rating/rating.svelte";
    import Privacy from "~/components/privacy.svelte";
    import Art from "~/components/art.svelte";
    import DrawerEdit from "~/components/action/drawers/drawerPlaylistEdit.svelte";
    import DrawerDelete from "~/components/action/drawers/drawerPlaylistDelete.svelte";
    import Portal from "~/components/portal.svelte";
    import Badge from "~/components/badge.svelte";
    import { errorHandler } from "~/logic/helper.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { createQuery } from "@tanstack/svelte-query";
    import Items from "~/views/playlist/_items.svelte";

    let { params = {} } = $props();

    let drawerEdit = $state(),
        drawerDelete = $state();

    let type = $derived.by(() => {
        let result = "playlist";

        if ($location.startsWith("/mix")) {
            result = "mix";
        } else if ($location.startsWith("/smartlist")) {
            result = "smartlist";
        }

        return result;
    });

    const query = createQuery(() => ({
        queryKey: ["playlist", params.id],
        queryFn: async () => {
            let response;

            if (type === "mix") {
                response = await $API.artist({ filter: params.id });
            } else {
                response = await $API.playlist({ filter: params.id });
            }

            if (response.error) {
                errorHandler("getting playlist core", response.error);
                return [];
            }

            return response;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let playlist = $derived(query.data || {});

    $effect(() => {
        $PageTitle = playlist?.name || $_("text.playlist");
    });
</script>

{#if query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if query.isError}
    <p>Error: {query.error.message}</p>
{:else if query.isSuccess}
    {#if !query.data.id}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        {#key query.data.id}
            <div class="page-wrapper">
                <div class="details-container">
                    <div class="details">
                        <div class="cover-rating">
                            <div class="art-container">
                                <Art
                                    size="large"
                                    data={playlist}
                                    {type}
                                    radius="6px"
                                />
                            </div>

                            {#if type !== "mix"}
                                <div class="rating">
                                    <Rating type="playlist" data={playlist} />
                                </div>
                            {/if}
                        </div>

                        <div class="info">
                            <div class="name">
                                <div class="type">
                                    {#if type === "smartlist"}
                                        <Badge text={$_("text.smartlist")} />
                                    {:else if type === "mix"}
                                        <Badge text={$_("text.mix")} />
                                    {:else}
                                        <Badge text={$_("text.playlist")} />
                                    {/if}
                                </div>

                                <h1 class="title">
                                    {playlist.name}
                                </h1>
                            </div>

                            {#if type !== "mix"}
                                <div class="meta-container">
                                    <div class="meta-entry">
                                        <span class="meta-field">
                                            {$_("text.items")}
                                        </span>
                                        <span class="meta-value">
                                            {playlist.items}
                                        </span>
                                    </div>

                                    <div class="meta-entry">
                                        <span class="meta-field">
                                            {$_("text.owner")}
                                        </span>
                                        <span class="meta-value">
                                            {playlist.owner}
                                        </span>
                                    </div>

                                    <div class="meta-entry">
                                        <span class="meta-field">
                                            {$_("text.type")}
                                        </span>
                                        <span class="meta-value">
                                            <Privacy type={playlist.type} />
                                        </span>
                                    </div>
                                </div>
                            {/if}

                            {#if type === "playlist" && playlist.has_access}
                                <div class="playlist-actions">
                                    <sl-button
                                        variant="primary"
                                        onclick={() => drawerEdit.show()}
                                        title={$_("text.edit")}
                                    >
                                        <MaterialSymbol
                                            name="edit"
                                            slot="prefix"
                                        />
                                        {$_("text.edit")}
                                    </sl-button>

                                    <sl-button
                                        variant="neutral"
                                        onclick={() => drawerDelete.show()}
                                        title={$_("text.delete")}
                                    >
                                        <MaterialSymbol
                                            name="delete"
                                            slot="prefix"
                                        />
                                        {$_("text.delete")}
                                    </sl-button>
                                </div>
                            {/if}
                        </div>
                    </div>
                </div>

                <div class="songs-container">
                    <div class="songs">
                        <Items {type} {playlist} />
                    </div>
                </div>
            </div>

            <Portal>
                <DrawerEdit bind:this={drawerEdit} {playlist} />
            </Portal>

            <Portal>
                <DrawerDelete bind:this={drawerDelete} {playlist} />
            </Portal>
        {/key}
    {/if}
{/if}

<style>
    .page-wrapper {
        display: grid;
        gap: var(--spacing-xxl);
        overflow: initial; /* let the art glow through */
    }

    .details-container {
        container-name: playlist-details-wrapper;
        container-type: inline-size;
    }

    .cover-rating {
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
    }

    .art-container {
        max-width: 240px;
        aspect-ratio: 1 / 1;
        overflow: hidden;
        font-size: 0;
        margin-block-end: var(--spacing-lg);
    }

    :global(.sl-theme-dark) .art-container {
        filter: url(#blur-and-scale);
    }

    .info {
        display: flex;
        gap: var(--spacing-xl);
        flex-direction: column;
    }

    .title {
        --roboto-opsz: 50;
        line-height: 1.1;
        font-weight: 300;
        display: flex;
    }

    .playlist-actions {
        display: flex;
        flex-direction: row;
        gap: var(--spacing-sm);
    }

    .type {
        --roboto-opsz: 32;
        display: flex;
        font-size: 14px;
        font-weight: 300;
        text-transform: uppercase;
        align-items: center;
    }

    .songs-container {
        overflow-y: hidden; /* prevent Tabulator from growing horizontally */
    }

    @container playlist-details-wrapper (min-width: 500px) {
        .details {
            display: flex;
            gap: var(--spacing-xl);
            margin-block-end: 0;
            padding: unset;
        }

        .details {
            background-color: unset;
            box-shadow: unset;
        }

        .title {
            justify-content: left;
        }

        .art-container {
            max-width: 180px;
        }

        .type {
            justify-content: start;
        }
    }

    @container playlist-details-wrapper (min-width: 800px) {
        .title {
            font-size: 40px;
            font-weight: 200;
        }

        .art-container {
            max-width: 240px;
        }
    }
</style>
