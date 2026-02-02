<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { API, PageTitle, User } from "~/stores/state";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { createQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import { genresPreset } from "~/components/lister/columns.js";

    let tabulator = $state(null);

    let title = $_("text.genres");
    $PageTitle = title;

    const query = createQuery(() => ({
        queryKey: ["genres"],
        queryFn: async () => {
            let result = await $API.genres({ sort: "name,ASC" });

            if (result.error) {
                errorHandler("getting genres", result.error);
                return [];
            }

            tabulator?.setData(result.genre);

            return result;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let genres = $derived(query.data?.genre || {});
</script>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

{#if query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if query.isError}
    <p>Error: {query.error.message}</p>
{:else if query.isSuccess}
    {#if query.data?.total_count === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        <div class="lister-tabulator">
            <Tabulator
                bind:tabulator
                data={genres}
                columns={genresPreset}
                type="genres"
                options={{ layout: "fitDataFill", persistenceID: "genres" }}
            ></Tabulator>
        </div>
    {/if}
{/if}
