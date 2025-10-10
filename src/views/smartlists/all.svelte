<script>
    import { smartlistsPreset } from "~/components/lister/columns.js";
    import { API, User } from "~/stores/state.js";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import { createQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import { _ } from "@rgglez/svelte-i18n";

    let tabulator = $state(null);

    const query = createQuery(() => ({
        queryKey: ["smartlists"],
        queryFn: async () => {
            let result = await $API.smartlists();

            if (result.error) {
                errorHandler("getting smartlists", result.error);
                return [];
            }

            tabulator?.setData(result.playlist);

            return result;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let smartlists = $derived(query.data?.playlist || []);
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
            <div class="lister-tabulator__actions">
                <MassRater bind:tabulator type="playlist" />
            </div>

            <Tabulator
                bind:tabulator
                data={smartlists}
                columns={smartlistsPreset}
                options={{ persistenceID: "smartlists" }}
            ></Tabulator>
        </div>
    {/if}
{/if}
