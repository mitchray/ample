<script>
    import { _ } from "svelte-i18n";
    import { songsPreset } from "~/components/lister/columns.js";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import { unratedSongs } from "~/logic/song.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";

    let tabulator = null;

    $: query = createQuery({
        queryKey: ["unratedSongs"],
        queryFn: async () => {
            let result = await unratedSongs({ limit: 100 });

            if (result.error) {
                errorHandler("getting unrated songs", result.error);
                return [];
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: songs = $query.data?.song || {};
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

                <MassRater bind:tabulator type="song" />
            </div>

            <Tabulator
                bind:tabulator
                data={songs}
                columns={songsPreset}
                options={{ persistenceID: "songs" }}
            ></Tabulator>
        </div>
    {/if}
{/if}
