<script>
    import { smartlistsPreset } from "~/components/lister/columns.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { API, User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { createOffsetInfiniteQueryOptions } from "~/logic/batching.js";

    let tabulator = $state(null);

    const query = createInfiniteQuery(() =>
        createOffsetInfiniteQueryOptions({
            queryKey: ["smartlists"],
            fetchPage: async (offset, limit) => {
                const result = await $API.smartlists({ limit, offset });
                if (result.error) {
                    errorHandler("getting smartlists", result.error);
                    return { items: [], total_count: 0 };
                }
                tabulator?.addData(result.playlist);
                return {
                    items: result.playlist,
                    total_count: result.total_count,
                };
            },
            enabled: $User.isLoggedIn,
        }),
    );

    let smartlists = $derived(query.data?.pages.flatMap((p) => p.items) ?? []);

    $effect(() => {
        if (smartlists && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    });
</script>

<Tabulator
    bind:tabulator
    data={[]}
    columns={smartlistsPreset}
    type="smartlists"
    options={{ id: "all-smartlists", persistenceID: "all-smartlists" }}
></Tabulator>
