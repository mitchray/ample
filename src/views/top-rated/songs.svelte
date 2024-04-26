<script>
    import Lister from "~/components/lister/lister.svelte";
    import { topSongs } from "~/logic/song.js";
    import { errorHandler } from "~/logic/helper.js";
    import { _ } from "svelte-i18n";
    import { songsPreset } from "~/components/lister/columns.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";

    $: query = createQuery({
        queryKey: ["topSongs"],
        queryFn: async () => {
            let result = await topSongs({ limit: 5000 });

            if (result.error) {
                errorHandler("getting top rated songs", result.error);
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
            id="Songs"
            data={songs}
            columns={songsPreset}
            type="song"
            virtualList={true}
            actionData={{
                type: "songs",
                displayMode: "fullButtons",
                showShuffle: songs.length > 1,
                data: Object.create({ songs: songs }),
            }}
        />
    {/if}
{/if}
