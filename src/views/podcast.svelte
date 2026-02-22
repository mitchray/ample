<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { createQuery, createInfiniteQuery } from "@tanstack/svelte-query";
    import { API, PageTitle, User } from "~/stores/state.js";
    import Rating from "~/components/rating/rating.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import Art from "~/components/art.svelte";
    import { errorHandler } from "~/logic/helper.js";
    import { podcastEpisodesPreset } from "~/components/lister/columns.js";
    import {
        INITIAL_PAGE_SIZE,
        BACKGROUND_PAGE_SIZE,
    } from "~/logic/batching.js";

    let { params = {} } = $props();

    let tabulator = $state(null);
    let total = $state(0);

    const query = createQuery(() => ({
        queryKey: ["podcast", params.id],
        queryFn: async () => {
            let result = await $API.podcast({
                filter: params.id,
                include: true,
            });

            if (result.error) {
                errorHandler("getting podcast", result.error);
                return [];
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    }));

    const episodesQuery = createInfiniteQuery(() => ({
        queryKey: ["podcastEpisodes", params.id],
        initialPageParam: 0,
        getNextPageParam(lastPage, allPages, lastPageParam, allPageParams) {
            const limitUsed =
                lastPageParam === 0 ? INITIAL_PAGE_SIZE : BACKGROUND_PAGE_SIZE;
            const nextOffset = lastPageParam + limitUsed;
            if (total > 0) {
                return nextOffset <= total ? nextOffset : undefined;
            }
            return lastPage.length >= limitUsed ? nextOffset : undefined;
        },
        queryFn: async ({ pageParam }) => {
            const limit =
                pageParam === 0 ? INITIAL_PAGE_SIZE : BACKGROUND_PAGE_SIZE;

            let result = await $API.podcastEpisodes({
                filter: params.id,
                limit,
                offset: pageParam,
            });

            if (result?.error) {
                errorHandler("getting podcast episodes", result.error);
                return [];
            }

            const list = result?.podcast_episode ?? result ?? [];
            const arr = Array.isArray(list) ? list : [];
            if (result?.total_count != null) {
                total = result.total_count;
            }

            tabulator?.addData(arr);

            return arr;
        },
        enabled: $User.isLoggedIn && !!params.id,
    }));

    let podcast = $derived(query.data || {});
    let episodes = $derived(episodesQuery.data?.pages.flat() || []);

    $effect(() => {
        $PageTitle = podcast?.name || $_("text.podcast");
    });

    $effect(() => {
        if (episodesQuery.data && episodesQuery.hasNextPage && !episodesQuery.isFetchingNextPage) {
            episodesQuery.fetchNextPage();
        }
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
            <h1>{podcast.name}</h1>
            <p>{@html podcast.description}</p>
            <Rating type="podcast" data={podcast} />
            <Art size="large" data={podcast} type="podcast" radius="8px" />
            <Actions
                type="podcast"
                displayMode="fullButtons"
                items={[podcast]}
                showShuffle={true}
            />

            <sl-button
                role="button"
                tabindex={0}
                onclick={() => {
                    $API.updatePodcast({ filter: podcast.id });
                }}
                onkeydown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        $API.updatePodcast({ filter: podcast.id });
                    }
                }}
            >
                Sync latest episodes
            </sl-button>

            <Tabulator
                bind:tabulator
                data={[]}
                columns={podcastEpisodesPreset}
                type="podcast_episodes"
                options={{ persistenceID: "podcast" }}
            ></Tabulator>
        {/key}
    {/if}
{/if}
