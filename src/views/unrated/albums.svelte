<script>
    import { _ } from "svelte-i18n";
    import {
        albumsPreset,
        forcedCheckbox,
    } from "~/components/lister/columns.js";
    import Lister from "~/components/lister/lister.svelte";
    import { unratedAlbums } from "~/logic/album.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";

    $: query = createQuery({
        queryKey: ["unratedAlbums"],
        queryFn: async () => {
            let result = await unratedAlbums({ limit: 100 });

            if (result.error) {
                errorHandler("getting unrated albums", result.error);
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
            columns={[forcedCheckbox, ...albumsPreset]}
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
