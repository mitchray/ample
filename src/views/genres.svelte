<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { API, PageTitle, User } from "~/stores/state";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import { genresPreset } from "~/components/lister/columns.js";
    import {
        INITIAL_PAGE_SIZE,
        BACKGROUND_PAGE_SIZE,
    } from "~/logic/batching.js";

    let tabulator = $state(null);
    let total = $state(0);

    let title = $_("text.genres");
    $PageTitle = title;

    const query = createInfiniteQuery(() => ({
        queryKey: ["genres"],
        initialPageParam: 0,
        getNextPageParam(lastPage, allPages, lastPageParam, allPageParams) {
            const limitUsed =
                lastPageParam === 0 ? INITIAL_PAGE_SIZE : BACKGROUND_PAGE_SIZE;
            const nextOffset = lastPageParam + limitUsed;
            if (total > 0) {
                return nextOffset <= total ? nextOffset : undefined;
            }
            // When total_count is missing, try next page if we got a full page; also try once after first page in case API returned fewer than limit (e.g. server default)
            if (lastPage.length >= limitUsed) return nextOffset;
            if (lastPageParam === 0) return nextOffset;
            return undefined;
        },
        queryFn: async ({ pageParam }) => {
            const limit =
                pageParam === 0 ? INITIAL_PAGE_SIZE : BACKGROUND_PAGE_SIZE;

            let result = await $API.genres({
                sort: "name,ASC",
                limit,
                offset: pageParam,
            });

            if (result.error) {
                errorHandler("getting genres", result.error);
                return [];
            }

            // Ampache API returns total_count at top level; client may expose it as result.total_count or result.data.total_count
            const totalFromResponse = result.total_count ?? result.data?.total_count;
            if (totalFromResponse != null) {
                total = totalFromResponse;
            }

            const list = result.genre ?? result.data?.genre ?? [];
            const arr = Array.isArray(list) ? list : [];
            tabulator?.addData(arr);

            return arr;
        },
        enabled: $User.isLoggedIn,
    }));

    let genres = $derived(query.data?.pages.flat() || []);

    $effect(() => {
        if (genres && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    });
</script>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

{#if query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if query.isError}
    <p>Error: {query.error.message}</p>
{:else if query.isSuccess}
    {#if genres.length === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        <Tabulator
            bind:tabulator
            data={[]}
            columns={genresPreset}
            type="genres"
            options={{ layout: "fitDataFill", persistenceID: "genres" }}
        ></Tabulator>
    {/if}
{/if}
