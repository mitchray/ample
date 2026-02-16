<script>
    import { createQuery, useQueryClient } from "@tanstack/svelte-query";
    import { API, PageTitle, User } from "~/stores/state.js";
    import { _ } from "@rgglez/svelte-i18n";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { errorHandler } from "~/logic/helper.js";
    import { sharesPreset } from "~/components/lister/columns.js";
    import { addAlert } from "~/logic/alert.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

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
        const list = query.data?.share || [];
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

    const query = createQuery(() => ({
        queryKey: ["shares"],
        queryFn: async () => {
            let result = await $API.shares();

            if (result.error) {
                errorHandler("getting shares", result.error);
                return {};
            }

            tabulator?.replaceData(result.share);

            return result;
        },
        enabled: $User.isLoggedIn,
    }));
    // alias of returned data
    let shares = $derived(query.data?.share || []);
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
    {#if query.data?.total_count === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        <Tabulator
            bind:tabulator
            data={shares}
            columns={sharesPreset}
            type="shares"
            options={{ id: "shares", persistenceID: "shares" }}
        ></Tabulator>
    {/if}
{/if}
