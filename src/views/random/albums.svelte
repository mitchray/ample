<script>
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import { randomAlbums } from "~/logic/album.js";
    import { _ } from "svelte-i18n";
    import { createQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import { albumsPreset } from "~/components/lister/columns.js";

    let tabulator = null;

    $: query = createQuery({
        queryKey: ["randomAlbums"],
        queryFn: async () => {
            let result = await randomAlbums({ limit: 50 });

            if (result.error) {
                errorHandler("getting random albums", result.error);
                return [];
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: albums = $query.data || {};
</script>

{#if $query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if $query.isError}
    <p>Error: {$query.error.message}</p>
{:else if $query.isSuccess}
    {#if albums.length === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        <div class="lister-tabulator">
            <div class="lister-tabulator__actions">
                <Actions
                    type="songs"
                    displayMode="fullButtons"
                    showShuffle={albums.length > 1}
                    data={Object.create({ albums: albums })}
                />

                <MassRater bind:tabulator />
            </div>

            <Tabulator
                bind:tabulator
                data={albums}
                columns={albumsPreset}
                options={{ persistenceID: "albums" }}
            ></Tabulator>
        </div>
    {/if}
{/if}
