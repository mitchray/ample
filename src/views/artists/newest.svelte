<script>
    import { _ } from "svelte-i18n";
    import { newestArtists } from "~/logic/artist";
    import Lister from "~/components/lister/lister.svelte";
    import { artistsPreset } from "~/components/lister/columns.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";

    $: query = createQuery({
        queryKey: ["newestArtists"],
        queryFn: async () => {
            let result = await newestArtists({ limit: 50 });

            if (result.error) {
                console.error(
                    "Ample error getting newest artists:",
                    result.error,
                );
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
        <Lister
            id="Artists"
            data={artists}
            columns={artistsPreset}
            type="artist"
            actionData={{
                type: "artists",
                displayMode: "fullButtons",
                showShuffle: artists.length > 1,
                data: Object.create({
                    artists: artists,
                }),
            }}
        />
    {/if}
{/if}
