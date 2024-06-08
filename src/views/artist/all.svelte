<script>
    import { _ } from "svelte-i18n";
    import { createQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import { API, User } from "~/stores/state";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import { songsPreset, track } from "~/components/lister/columns.js";

    export let artistID;

    let songs = [];
    let loading = false;
    let tabulator = null;

    $: query = createQuery({
        queryKey: ["allArtistSongs", artistID],
        queryFn: async () => {
            let result = await $API.artistSongs({ filter: artistID });

            if (result.error) {
                errorHandler("getting all songs for artist", result.error);
                return [];
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: songs = $query.data || {};
</script>

{#if !loading && songs && songs.length > 0}
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
            columns={[track, ...songsPreset]}
            options={{ persistence: true, persistenceID: "SongsArtistAll" }}
        ></Tabulator>
    </div>
{:else}
    <p>{$_("text.loading")}</p>
{/if}

<style>
</style>
