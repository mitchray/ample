<script>
    import { smartlistsPreset } from "~/components/lister/columns.js";
    import { createInfiniteQuery } from "@tanstack/svelte-query";
    import { API, User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import {
        INITIAL_PAGE_SIZE,
        BACKGROUND_PAGE_SIZE,
    } from "~/logic/batching.js";

    let tabulator = $state(null);
    let total = $state(0);

    const query = createInfiniteQuery(() => ({
        queryKey: ["mySmartlists"],
        initialPageParam: 0,
        getNextPageParam(lastPage, allPages, lastPageParam, allPageParams) {
            const limitUsed =
                lastPageParam === 0 ? INITIAL_PAGE_SIZE : BACKGROUND_PAGE_SIZE;
            let offsetTotal = lastPageParam + limitUsed;
            return offsetTotal <= total ? offsetTotal : undefined;
        },
        queryFn: async ({ pageParam }) => {
            const limit =
                pageParam === 0 ? INITIAL_PAGE_SIZE : BACKGROUND_PAGE_SIZE;

            let result = await $API.userSmartlists({
                limit: limit,
                offset: pageParam,
            });

            if (result.error) {
                errorHandler("getting my smartlists", result.error);
                return [];
            }

            total = result.total_count;

            // refresh data on subsequent loads
            tabulator?.addData(result.playlist);

            return result.playlist;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let smartlists = $derived(query.data?.pages.flat() || []);

    $effect(() => {
        if (smartlists && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    });
</script>

<div class="lister-tabulator">
    <Tabulator
        bind:tabulator
        data={[]}
        columns={smartlistsPreset}
        type="smartlists"
        options={{ id: "my-smartlists", persistenceID: "my-smartlists" }}
    ></Tabulator>
</div>
