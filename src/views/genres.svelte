<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { API, PageTitle, User } from "~/stores/state";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import QueryError from "~/components/QueryError.svelte";
    import { genresPreset } from "~/components/lister/columns.js";
    import { createOffsetInfiniteQueryOptions } from "~/logic/batching.js";

    let tabulator = $state(null);

    let title = $_("text.genres");
    $PageTitle = title;

    const query = createInfiniteQuery(() =>
        createOffsetInfiniteQueryOptions({
            queryKey: ["genres"],
            fetchPage: async (offset, limit) => {
                const result = await $API.genres({
                    sort: "name,ASC",
                    limit,
                    offset,
                });
                if (result.error) {
                    errorHandler("getting genres", result.error);
                    return { items: [], total_count: 0 };
                }
                const totalFromResponse =
                    result.total_count ?? result.data?.total_count ?? 0;
                const list = result.genre ?? result.data?.genre ?? [];
                const arr = Array.isArray(list) ? list : [];
                tabulator?.addData(arr);
                return {
                    items: arr,
                    total_count: totalFromResponse,
                };
            },
            enabled: $User.isLoggedIn && tabulator != null,
        }),
    );

    let genres = $derived(query.data?.pages.flatMap((p) => p.items) ?? []);

    $effect(() => {
        if (genres && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    });
</script>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

<QueryError {query} />

<Tabulator
    bind:tabulator
    data={[]}
    columns={genresPreset}
    type="genres"
    options={{ layout: "fitDataFill", persistenceID: "genres" }}
></Tabulator>
