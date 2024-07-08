<script>
    import { smartlistsPreset } from "~/components/lister/columns.js";
    import { API, User } from "~/stores/state.js";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import { createQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import { _ } from "svelte-i18n";

    let tabulator = null;

    $: query = createQuery({
        queryKey: ["smartlists"],
        queryFn: async () => {
            let result = await $API.smartlists();

            if (result.error) {
                errorHandler("getting smartlists", result.error);
                return [];
            }

            tabulator?.setData(result);

            return result;
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: smartlists = $query.data || [];
</script>

{#if $query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if $query.isError}
    <p>Error: {$query.error.message}</p>
{:else if $query.isSuccess}
    {#if smartlists.length === 0}
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
