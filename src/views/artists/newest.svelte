<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { newestArtists } from "~/logic/artist";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import { createQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import { artistsPreset } from "~/components/lister/columns.js";

    let tabulator = $state(null);

    const query = createQuery(() => ({
        queryKey: ["newestArtists"],
        queryFn: async () => {
            let result = await newestArtists({ limit: 50 });

            if (result.error) {
                errorHandler("getting newest artists", result.error);
                return [];
            }

            tabulator?.replaceData(result.artist);

            return result;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let artists = $derived(query.data?.artist || {});
</script>

{#if query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if query.isError}
    <p>Error: {query.error.message}</p>
{:else if query.isSuccess}
    {#if query.data?.total_count === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        <Actions
            type="artists"
            displayMode="fullButtons"
            showShuffle={true}
            data={{
                getArtists: () => tabulator.getData("active"),
            }}
        />

        <Tabulator
            bind:tabulator
            data={artists}
            columns={artistsPreset}
            type="artists"
            options={{ persistenceID: "artists" }}
        ></Tabulator>
    {/if}
{/if}
