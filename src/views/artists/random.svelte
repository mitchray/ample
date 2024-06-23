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

    let tabulator = null;

    $: query = createQuery({
        queryKey: ["randomArtists"],
        queryFn: async () => {
            let result = await randomArtists({ limit: 50 });

            if (result.error) {
                errorHandler("getting random artists", result.error);
                return [];
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: artists = $query.data || {};
</script>

{#if $query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if $query.isError}
    <p>Error: {$query.error.message}</p>
{:else if $query.isSuccess}
    {#if artists.length === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        <div class="lister-tabulator">
            <div class="lister-tabulator__actions">
                <Actions
                    type="artists"
                    displayMode="fullButtons"
                    showShuffle={artists.length > 1}
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
