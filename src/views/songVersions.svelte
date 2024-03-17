<script>
    import { _ } from "svelte-i18n";
    import Lister from "~/components/lister/lister.svelte";
    import { getSongVersions } from "~/logic/song";
    import { songsPreset } from "~/components/lister/columns.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { PageTitle, User } from "~/stores/state.js";

    export let params = {};

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
                console.error(
                    "Ample error getting song versions",
                    result.error,
                );
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
        <Lister
            id="Songs"
            data={songs}
            columns={songsPreset}
            type="song"
            options={{ canSort: true }}
            actionData={{
                type: "songs",
                displayMode: "fullButtons",
                showShuffle: songs.length > 1,
                data: Object.create({ songs: songs }),
            }}
        />
    {/if}
{/if}
