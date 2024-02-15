<script>
    import { User } from "~/stores/state";
    import { Saved } from "~/stores/settings.js";
    import Lister from "~/components/lister/lister.svelte";
    import { albumsPreset } from "~/components/lister/columns.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { _ } from "svelte-i18n";

    $: query = createQuery({
        queryKey: ["allAlbums"],
        queryFn: async () => {
            return $Saved.getItem("allAlbums");
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: albums = $query.data || [];
</script>

{#if $query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if $query.isError}
    <p>Error: {$query.error.message}</p>
{:else if $query.isSuccess}
    <Lister
        id="Artists"
        data={albums}
        columns={albumsPreset}
        type="album"
        virtualList={true}
        actionData={{
            type: "albums",
            displayMode: "fullButtons",
            data: Object.create({ albums: albums }),
        }}
    />
{/if}
