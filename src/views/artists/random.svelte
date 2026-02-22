<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { randomArtists } from "~/logic/artist";
    import { errorHandler } from "~/logic/helper.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import { artistsPreset } from "~/components/lister/columns.js";
    import QueryError from "~/components/QueryError.svelte";
    import Actions from "~/components/action/actions.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";

    let tabulator = $state(null);

    const query = createQuery(() => ({
        queryKey: ["randomArtists"],
        queryFn: async () => {
            let result = await randomArtists({ limit: 50 });

            if (result.error) {
                errorHandler("getting random artists", result.error);
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
    showShuffle={true}
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
