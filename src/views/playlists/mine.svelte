<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { playlistsPreset } from "~/components/lister/columns.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { API, User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import MassRater from "~/components/lister/massRater.svelte";

    let tabulator = $state();

    let query = $derived(
        createQuery({
            queryKey: ["myPlaylists"],
            queryFn: async () => {
                let result = await $API.userPlaylists();

                if (result.error) {
                    errorHandler("getting my playlists", result.error);
                    return [];
                }

                // refresh data on subsequent loads
                tabulator?.setData(result.playlist);

                return result;
            },
            enabled: $User.isLoggedIn,
        }),
    );

    // alias of returned data
    let playlists = $derived($query.data?.playlist || []);
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
                data={playlists}
                columns={playlistsPreset}
                options={{ id: "playlists", persistenceID: "playlists" }}
            ></Tabulator>
        </div>
    {/if}
{/if}
