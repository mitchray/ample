<script>
    import { User } from "~/stores/state";
    import { Saved } from "~/stores/settings.js";
    import Lister from "~/components/lister/lister.svelte";
    import { artistsPreset } from "~/components/lister/columns.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { _ } from "svelte-i18n";

    /** @type {'artist'|'album_artist'} */
    export let type;

    $: query = createQuery({
        queryKey: ["allArtists"],
        queryFn: async () => {
            return type === "album_artist"
                ? await $Saved.getItem("allAlbumArtists")
                : await $Saved.getItem("allArtists");
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: artists = $query.data || [];
</script>

{#if $query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if $query.isError}
    <p>Error: {$query.error.message}</p>
{:else if $query.isSuccess}
    <Lister
        id="Artists"
        data={artists}
        columns={artistsPreset}
        type="artist"
        virtualList={true}
        actionData={{
            type: "artists",
            displayMode: "fullButtons",
            data: Object.create({ artists: artists }),
        }}
    />
{/if}
