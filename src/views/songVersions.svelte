<script>
    import { _ } from "svelte-i18n";
    import Actions from "~/components/action/actions.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import { songsPreset } from "~/components/lister/columns.js";
    import { getSongVersions } from "~/logic/song";
    import { createQuery } from "@tanstack/svelte-query";
    import { PageTitle, User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";

    export let params = {};

    let tabulator = null;

    $: $PageTitle =
        $_("text.versionsOf", {
            values: {
                songTitle: params.songTitle,
                artistName: params.artistName,
            },
        }) || $_("text.songVersions");

    $: query = createQuery({
        queryKey: ["songVersions", params.songTitle + params.artistName],
        queryFn: async () => {
            let result = await getSongVersions(
                params.songTitle,
                params.artistName,
            );

            if (result.error) {
                errorHandler("getting song versions", result.error);
                return [];
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: songs = $query.data || {};
</script>

<div class="page-header">
    <h1 class="page-title">
        {@html $PageTitle}
    </h1>
</div>

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
                    type="songGenre"
                    displayMode="fullButtons"
                    showShuffle={true}
                    data={{ songs: songs }}
                />

                <MassRater bind:tabulator type="song" />
            </div>

            <Tabulator
                bind:tabulator
                data={songs}
                columns={songsPreset}
                options={{
                    persistenceID: "songs",
                }}
            ></Tabulator>
        </div>
    {/if}
{/if}
