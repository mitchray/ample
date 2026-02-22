<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { createQuery, createInfiniteQuery } from "@tanstack/svelte-query";
    import { API, PageTitle, User } from "~/stores/state.js";
    import Rating from "~/components/rating/rating.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import Art from "~/components/art.svelte";
    import { errorHandler } from "~/logic/helper.js";
    import QueryError from "~/components/QueryError.svelte";
    import { podcastEpisodesPreset } from "~/components/lister/columns.js";
    import { createOffsetInfiniteQueryOptions } from "~/logic/batching.js";

    let { params = {} } = $props();

    let tabulator = $state(null);

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

    const episodesQuery = createInfiniteQuery(() =>
        createOffsetInfiniteQueryOptions({
            queryKey: ["podcastEpisodes", params.id],
            fetchPage: async (offset, limit) => {
                const result = await $API.podcastEpisodes({
                    filter: params.id,
                    limit,
                    offset,
                });
                if (result?.error) {
                    errorHandler("getting podcast episodes", result.error);
                    return { items: [], total_count: 0 };
                }
                const list = result?.podcast_episode ?? result ?? [];
                const arr = Array.isArray(list) ? list : [];
                tabulator?.addData(arr);
                return {
                    items: arr,
                    total_count: result?.total_count ?? 0,
                };
            },
            enabled: $User.isLoggedIn && !!params.id && tabulator != null,
        }),
    );

    let podcast = $derived(query.data || {});
    let episodes = $derived(
        episodesQuery.data?.pages.flatMap((p) => p.items) ?? [],
    );

    $effect(() => {
        $PageTitle = podcast?.name || $_("text.podcast");
    });

    $effect(() => {
        if (episodesQuery.data && episodesQuery.hasNextPage && !episodesQuery.isFetchingNextPage) {
            episodesQuery.fetchNextPage();
        }
    });
</script>

<QueryError {query} />

{#if query.isSuccess && query.data.id}
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
    {/key}
{/if}

<Tabulator
    bind:tabulator
    data={episodes}
    columns={podcastEpisodesPreset}
    type="podcast_episodes"
    options={{ persistenceID: "podcast" }}
></Tabulator>
