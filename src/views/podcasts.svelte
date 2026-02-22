<script>
    import { createQuery } from "@tanstack/svelte-query";
    import { API, PageTitle, User } from "~/stores/state.js";
    import { _ } from "@rgglez/svelte-i18n";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { errorHandler } from "~/logic/helper.js";
    import { podcastsPreset } from "~/components/lister/columns.js";

    const query = createQuery(() => ({
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
    }));

    // alias of returned data – ensure array for Tabulator
    let podcasts = $derived(Array.isArray(query.data) ? query.data : []);

    let title = $_("text.podcasts");
    $PageTitle = title;

    let tabulator = $state(null);
</script>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

{#if query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if query.isError}
    <p>Error: {query.error.message}</p>
{:else if query.isSuccess && podcasts.length === 0}
    <p>{$_("text.noItemsFound")}</p>
{/if}

<Tabulator
    bind:tabulator
    data={podcasts}
    columns={podcastsPreset}
    type="podcasts"
    options={{ persistenceID: "podcasts" }}
></Tabulator>
