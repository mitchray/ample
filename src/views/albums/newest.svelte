<script>
    import { newestAlbums } from "~/logic/album.js";
    import { _ } from "svelte-i18n";
    import { albumsPreset } from "~/components/lister/columns.js";
    import Lister from "~/components/lister/lister.svelte";
    import { createQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";

    $: query = createQuery({
        queryKey: ["newestAlbums"],
        queryFn: async () => {
            let result = await newestAlbums({ limit: 50 });

            if (result.error) {
                errorHandler("getting newest albums", result.error);
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
