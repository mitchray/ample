<script>
    import { run } from "svelte/legacy";

    import { _ } from "svelte-i18n";
    import { smartlistsPreset } from "~/components/lister/columns.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { API, User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import MassRater from "~/components/lister/massRater.svelte";

    let tabulator = $state(null);

    let query = $derived(
        createQuery({
            queryKey: ["mySmartlists"],
            queryFn: async () => {
                let result = await $API.userSmartlists();

                if (result.error) {
                    errorHandler("getting my smartlists", result.error);
                    return [];
                }

                tabulator?.setData(result.playlist);

                return result;
            },
            enabled: $User.isLoggedIn,
        }),
    );

    // alias of returned data
    let smartlists;
    run(() => {
        smartlists = $query.data?.playlist || {};
    });
</script>

{#if $query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if $query.isError}
    <p>Error: {$query.error.message}</p>
{:else if $query.isSuccess}
    {#if $query.data?.total_count === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        <div class="lister-tabulator">
            <div class="lister-tabulator__actions">
                <MassRater bind:tabulator type="playlist" />
            </div>

            <Tabulator
                bind:tabulator
                bind:data={smartlists}
                columns={smartlistsPreset}
                options={{ id: "smartlists", persistenceID: "smartlists" }}
            ></Tabulator>
        </div>
    {/if}
{/if}
