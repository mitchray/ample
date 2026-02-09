<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { newestAlbums } from "~/logic/album";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import { createQuery } from "@tanstack/svelte-query";
    import { PageTitle, User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import { albumsPreset } from "~/components/lister/columns.js";

    let title = $_("text.newest");
    $PageTitle = title;
    let tabulator = $state(null);

    const query = createQuery(() => ({
        queryKey: ["newestAlbums"],
        queryFn: async () => {
            let result = await newestAlbums({ limit: 100 });

            if (result.error) {
                errorHandler("getting newest albums", result.error);
                return [];
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let albums = $derived(query.data?.album || {});
</script>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

{#if query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if query.isError}
    <p>Error: {query.error.message}</p>
{:else if query.isSuccess}
    {#if albums.length === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        <Actions
            type="albums"
            displayMode="fullButtons"
            showShuffle={albums.length > 1}
            data={{ getAlbums: () => tabulator.getData("active") }}
        />

        <Tabulator
            bind:tabulator
            data={albums}
            columns={albumsPreset}
            type="albums"
            options={{ persistenceID: "albums" }}
        ></Tabulator>
    {/if}
{/if}
