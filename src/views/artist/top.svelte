<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { API, User } from "~/stores/state";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import { index, songsPreset } from "~/components/lister/columns.js";

    import { createQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";

    let { artistID } = $props();

    const query = createQuery(() => ({
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

            for (let i = 0; i < result.song.length; i++) {
                result.song[i].order = i + 1;
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    }));

    let tabulator = $state(null);

    // alias of returned data
    let songs = $derived(query.data?.song || {});
</script>

{#if query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if query.isError}
    <p>Error: {query.error.message}</p>
{:else if query.isSuccess}
    {#if songs.length === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        <div class="lister-tabulator">
            <div class="lister-tabulator__actions">
                <Actions
                    type="songs"
                    displayMode="fullButtons"
                    showShuffle={songs.length > 1}
                    data={{ getSongs: () => tabulator.getData("active") }}
                />

                <MassRater bind:tabulator type="artist" />
            </div>

            <Tabulator
                bind:tabulator
                data={songs}
                columns={[index, ...songsPreset]}
                type="songs"
                options={{ persistenceID: "songsArtistTop" }}
            ></Tabulator>
        </div>
    {/if}
{/if}
