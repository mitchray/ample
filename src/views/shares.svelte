<script>
    import { createInfiniteQuery, useQueryClient } from "@tanstack/svelte-query";
    import { API, PageTitle, User } from "~/stores/state.js";
    import { _ } from "@rgglez/svelte-i18n";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { errorHandler } from "~/logic/helper.js";
    import { sharesPreset } from "~/components/lister/columns.js";
    import { addAlert } from "~/logic/alert.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { createOffsetInfiniteQueryOptions } from "~/logic/batching.js";

    let title = $_("text.shares");
    $PageTitle = title;

    let tabulator = $state(null);
    let cleaning = $state(false);

    function isExpired(share) {
        const expireDays = share.expire_days;
        if (expireDays == null || expireDays <= 0) return false;
        const now = Date.now() / 1000;
        const expiryTs = share.creation_date + expireDays * 86400;
        return expiryTs <= now;
    }

    function getExpiredShares(shareList) {
        return (shareList || []).filter(isExpired);
    }

    async function cleanExpired() {
        const list = shares;
        const expired = getExpiredShares(list);
        cleaning = true;
        for (const share of expired) {
            const result = await $API.shareDelete({ filter: share.id });
            if (result?.success) {
                tabulator?.deleteRow(share.id);
            } else {
                errorHandler("deleting expired share", result?.error);
            }
        }
        try {
            const queryClient = useQueryClient();
            await queryClient.invalidateQueries({ queryKey: ["shares"] });
        } catch (e) {}
        addAlert({
            title: $_("text.sharesCleaningComplete"),
            style: "success",
        });
        cleaning = false;
    }

    const query = createInfiniteQuery(() =>
        createOffsetInfiniteQueryOptions({
            queryKey: ["shares"],
            fetchPage: async (offset, limit) => {
                const result = await $API.shares({ limit, offset });
                if (result?.error) {
                    errorHandler("getting shares", result.error);
                    return { items: [], total_count: 0 };
                }
                const list = result?.share ?? [];
                const arr = Array.isArray(list) ? list : [];
                tabulator?.addData(arr);
                return {
                    items: arr,
                    total_count: result?.total_count ?? 0,
                };
            },
            enabled: $User.isLoggedIn,
        }),
    );

    let shares = $derived(query.data?.pages.flatMap((p) => p.items) ?? []);

    $effect(() => {
        if (shares && query.hasNextPage && !query.isFetchingNextPage) {
            query.fetchNextPage();
        }
    });
</script>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
    {#if query.isSuccess}
        <sl-button
            class="clean-expired-shares-button"
            role="button"
            tabindex={0}
            onclick={cleanExpired}
            onkeydown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    cleanExpired();
                }
            }}
            variant="default"
            size="small"
            disabled={cleaning}
        >
            <MaterialSymbol name="delete_sweep" slot="prefix" />
            {$_("text.cleanExpiredShares")}
        </sl-button>
    {/if}
</div>

{#if query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if query.isError}
    <p>Error: {query.error.message}</p>
{:else if query.isSuccess}
    {#if shares.length === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        <Tabulator
            bind:tabulator
            data={[]}
            columns={sharesPreset}
            type="shares"
            options={{ id: "shares", persistenceID: "shares" }}
        ></Tabulator>
    {/if}
{/if}
