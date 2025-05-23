<script>
    import { _ } from "svelte-i18n";
    import { randomArtists } from "~/logic/artist";
    import { errorHandler } from "~/logic/helper.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import { artistsPreset } from "~/components/lister/columns.js";
    import Actions from "~/components/action/actions.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";

    let tabulator = $state(null);

    let query = $derived(
        createQuery({
            queryKey: ["randomArtists"],
            queryFn: async () => {
                let result = await randomArtists({ limit: 50 });

                if (result.error) {
                    errorHandler("getting random artists", result.error);
                    return [];
                }

                tabulator?.setData(result.artist);

                return result;
            },
            enabled: $User.isLoggedIn,
        }),
    );

    // alias of returned data
    let artists = $derived($query.data?.artist || {});
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
                <Actions
                    type="artists"
                    displayMode="fullButtons"
                    showShuffle={true}
                    data={{ artists: artists }}
                />

                <MassRater bind:tabulator type="artist" />
            </div>

            <Tabulator
                bind:tabulator
                data={artists}
                columns={artistsPreset}
                options={{
                    persistenceID: "artists",
                }}
            ></Tabulator>
        </div>
    {/if}
{/if}
