<script>
    import { createQuery } from "@tanstack/svelte-query";
    import { API, PageTitle, User } from "~/stores/state.js";
    import { _ } from "svelte-i18n";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import { errorHandler } from "~/logic/helper.js";
    import { podcastsPreset } from "~/components/lister/columns.js";

    $: query = createQuery({
        queryKey: ["podcasts"],
        queryFn: async () => {
            let result = await $API.podcasts();

            if (result.error) {
                errorHandler("getting podcasts", result.error);
                return [];
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: podcasts = $query.data || {};

    let title = $_("text.podcasts");
    $PageTitle = title;

    let tabulator = null;
</script>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

{#if $query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if $query.isError}
    <p>Error: {$query.error.message}</p>
{:else if $query.isSuccess}
    {#if podcasts.length < 1}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        <div class="lister-tabulator">
            <div class="lister-tabulator__actions">
                <MassRater bind:tabulator type="podcast" />
            </div>

            <Tabulator
                bind:tabulator
                data={podcasts}
                columns={podcastsPreset}
                options={{ persistenceID: "podcasts" }}
            ></Tabulator>
        </div>
    {/if}
{/if}
