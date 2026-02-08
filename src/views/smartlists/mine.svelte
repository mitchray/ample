<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { smartlistsPreset } from "~/components/lister/columns.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { API, User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import Tabulator from "~/components/lister/Tabulator.svelte";

    let tabulator = $state(null);

    const query = createQuery(() => ({
        queryKey: ["mySmartlists"],
        queryFn: async () => {
            let result = await $API.userSmartlists();

            if (result.error) {
                errorHandler("getting my smartlists", result.error);
                return [];
            }

            // refresh data on subsequent loads
            tabulator?.replaceData(result.playlist);

            return result;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let smartlists = $derived(query.data?.playlist || {});
</script>

{#if query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if query.isError}
    <p>Error: {query.error.message}</p>
{:else if query.isSuccess}
    {#if query.data?.total_count === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        <div class="lister-tabulator">
            <div class="lister-tabulator__actions"></div>

            <Tabulator
                bind:tabulator
                data={smartlists}
                columns={smartlistsPreset}
                type="smartlists"
                options={{ id: "smartlists", persistenceID: "smartlists" }}
            ></Tabulator>
        </div>
    {/if}
{/if}
