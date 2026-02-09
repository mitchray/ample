<script>
    import { _ } from "@rgglez/svelte-i18n";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import { unratedAlbums } from "~/logic/album.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import { albumsPreset } from "~/components/lister/columns.js";

    let tabulator = $state(null);

    const query = createQuery(() => ({
        queryKey: ["unratedAlbums", Date.now()],
        queryFn: async () => {
            let result = await unratedAlbums({ limit: 100 });

            if (result.error) {
                errorHandler("getting unrated albums", result.error);
                return [];
            }

            // refresh data on subsequent loads
            tabulator?.replaceData(result.album);

            return result.album;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let albums = $derived(query.data || []);
</script>

<div class="lister-tabulator">
    <Actions
        type="albums"
        displayMode="fullButtons"
        showShuffle={true}
        data={{ getAlbums: () => tabulator.getData("active") }}
    />

    <Tabulator
        bind:tabulator
        data={albums}
        columns={albumsPreset}
        type="albums"
        options={{ persistenceID: "albums" }}
    ></Tabulator>
</div>
