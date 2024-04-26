<script>
    import { unratedArtists } from "~/logic/artist.js";
    import { errorHandler } from "~/logic/helper.js";
    import { _ } from "svelte-i18n";
    import {
        artistsPreset,
        forcedCheckbox,
    } from "~/components/lister/columns.js";
    import Lister from "~/components/lister/lister.svelte";
    import { createQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";

    $: query = createQuery({
        queryKey: ["unratedArtists"],
        queryFn: async () => {
            let result = await unratedArtists({ limit: 100 });

            if (result.error) {
                errorHandler("getting unrated artists", result.error);
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
            columns={[forcedCheckbox, ...artistsPreset]}
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
