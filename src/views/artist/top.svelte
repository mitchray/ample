<script>
    import { _ } from "svelte-i18n";
    import { API, User } from "~/stores/state";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import { index, songsPreset } from "~/components/lister/columns.js";

    import { createQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";

    export let artistID;

    $: query = createQuery({
        queryKey: ["topArtistSongs", artistID],
        queryFn: async () => {
            let result = await $API.artistSongs({
                filter: artistID,
                top50: 1,
                limit: 20,
            });

            if (result.error) {
                errorHandler("getting top songs for artist", result.error);
                return [];
            }

            for (let i = 0; i < result.length; i++) {
                result[i].order = i + 1;
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    });

    let tabulator = null;

    // alias of returned data
    $: songs = $query.data || {};
</script>

{#if $query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if $query.isError}
    <p>Error: {$query.error.message}</p>
{:else if $query.isSuccess}
    {#if songs.length === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        <div class="lister-tabulator">
            <div class="lister-tabulator__actions">
                <Actions
                    type="songs"
                    displayMode="fullButtons"
                    showShuffle={songs.length > 1}
                    data={Object.create({ songs: songs })}
                />

                <MassRater bind:tabulator />
            </div>

            <Tabulator
                bind:tabulator
                data={songs}
                columns={[index, ...songsPreset]}
                options={{ persistenceID: "songsArtistTop" }}
            ></Tabulator>
        </div>
    {/if}
{/if}
