<script>
    import { _ } from "svelte-i18n";
    import { API, User } from "~/stores/state";
    import Lister from "~/components/lister/lister.svelte";
    import {
        checkbox,
        index,
        songsPreset,
    } from "~/components/lister/columns.js";
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

            return result;
        },
        enabled: $User.isLoggedIn,
    });

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
        <Lister
            id="SongsArtistTop"
            data={songs}
            columns={[checkbox, index, ...songsPreset]}
            type="song"
            options={{ canSort: true }}
            actionData={{
                type: "songs",
                displayMode: "fullButtons",
                showShuffle: songs.length > 1,
                data: Object.create({
                    songs: songs,
                }),
            }}
        />
    {/if}
{/if}
