<script>
    import Lister from "~/components/lister/lister.svelte";
    import { topAlbums } from "~/logic/album.js";
    import { _ } from "svelte-i18n";
    import { albumsPreset } from "~/components/lister/columns.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";

    $: query = createQuery({
        queryKey: ["topAlbums"],
        queryFn: async () => {
            let result = await topAlbums({ limit: 5000 });

            if (result.error) {
                console.error(
                    "Ample error getting top rated albums:",
                    result.error,
                );
                return [];
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: albums = $query.data || {};
</script>

{#if $query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if $query.isError}
    <p>Error: {$query.error.message}</p>
{:else if $query.isSuccess}
    {#if albums.length === 0}
        <p>{$_("text.noItemsFound")}</p>
    {:else}
        <Lister
            id="Albums"
            data={albums}
            columns={albumsPreset}
            type="album"
            virtualList={true}
            actionData={{
                type: "albums",
                displayMode: "fullButtons",
                showShuffle: albums.length > 1,
                data: Object.create({ albums: albums }),
            }}
        />
    {/if}
{/if}
