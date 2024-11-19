<script>
    import { run } from "svelte/legacy";

    import { _ } from "svelte-i18n";
    import { createQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import { API, User } from "~/stores/state";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import { songsPreset, track } from "~/components/lister/columns.js";

    let { artistID } = $props();

    let songs = $state([]);
    let loading = false;
    let tabulator = $state(null);

    let query = $derived(
        createQuery({
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
        }),
    );

    // alias of returned data
    run(() => {
        songs = $query.data?.song || {};
    });
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

            <MassRater bind:tabulator type="artist" />
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
