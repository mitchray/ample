<script>
    import { _ } from "@rgglez/svelte-i18n";
    import Actions from "~/components/action/actions.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { artistsPreset } from "~/components/lister/columns.js";
    import { randomAlbumArtists } from "~/logic/artist.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import QueryError from "~/components/QueryError.svelte";

    let tabulator = $state(null);

    const query = createQuery(() => ({
        queryKey: ["randomAlbumArtists"],
        queryFn: async () => {
            let result = await randomAlbumArtists({ limit: 50 });

            if (result.error) {
                errorHandler("getting random album artists:", result.error);
                return [];
            }

            tabulator?.replaceData(result.artist);

            return result;
        },
        enabled: $User.isLoggedIn && tabulator != null,
    }));

    // alias of returned data – ensure array for Tabulator
    let artists = $derived(Array.isArray(query.data?.artist) ? query.data.artist : []);
</script>

<QueryError {query} />

<Actions
    type="artists"
    displayMode="fullButtons"
    showShuffle={artists.length > 1}
    data={{
        getArtists: () => tabulator?.getData("active"),
    }}
/>

<Tabulator
    bind:tabulator
    data={artists}
    columns={artistsPreset}
    type="artists"
    options={{
        persistenceID: "artists",
    }}
></Tabulator>
