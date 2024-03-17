<script>
    import { _ } from "svelte-i18n";
    import { newestAlbums } from "~/logic/album";
    import Lister from "~/components/lister/lister.svelte";
    import { albumsPreset } from "~/components/lister/columns.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { PageTitle, User } from "~/stores/state.js";

    let title = $_("text.newest");
    $PageTitle = title;

    $: query = createQuery({
        queryKey: ["newestAlbums"],
        queryFn: async () => {
            let result = await newestAlbums({ limit: 100 });

            if (result.error) {
                console.error(
                    "Ample error getting newest albums:",
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

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

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
