<script>
    import { createQuery } from "@tanstack/svelte-query";
    import { API, PageTitle, User } from "~/stores/state.js";
    import { _ } from "@rgglez/svelte-i18n";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { errorHandler } from "~/logic/helper.js";
    import { sharesPreset } from "~/components/lister/columns.js";

    let title = $_("text.shares");
    $PageTitle = title;

    let tabulator = $state(null);

    let query = $derived(
        createQuery({
            queryKey: ["shares"],
            queryFn: async () => {
                let result = await $API.shares();

                if (result.error) {
                    errorHandler("getting shares", result.error);
                    return {};
                }

                tabulator?.setData(result.share);

                return result;
            },
            enabled: $User.isLoggedIn,
        }),
    );
    // alias of returned data
    let shares = $derived($query.data?.share || []);
</script>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

{#if $query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if $query.isError}
    <p>Error: {$query.error.message}</p>
{:else if $query.isSuccess}
    {#if $query.data?.total_count === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        <div class="lister-tabulator">
            <Tabulator
                bind:tabulator
                data={shares}
                columns={sharesPreset}
                options={{ id: "shares", persistenceID: "shares" }}
            ></Tabulator>
        </div>
    {/if}
{/if}
