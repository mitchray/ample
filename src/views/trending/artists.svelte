<script>
    import { frequentArtists } from "~/logic/artist.js";
    import { _ } from "svelte-i18n";
    import { artistsPreset } from "~/components/lister/columns.js";
    import Lister from "~/components/lister/lister.svelte";
    import { createQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";

    $: query = createQuery({
        queryKey: ["trendingArtists"],
        queryFn: async () => {
            let result = await frequentArtists({ limit: 50 });

            if (result.error) {
                errorHandler("getting frequent artists", result.error);
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
            virtualList={true}
            actionData={{
                type: "artists",
                displayMode: "fullButtons",
                showShuffle: artists.length > 1,
                data: Object.create({ artists: artists }),
            }}
        />
    {/if}
{/if}
