<script>
    import { unratedArtists } from "~/logic/artist.js";
    import { errorHandler } from "~/logic/helper.js";
    import { artistsPreset } from "~/components/lister/columns.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import Actions from "~/components/action/actions.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";

    let tabulator = $state(null);

    const query = createQuery(() => ({
        queryKey: ["unratedArtists", Date.now()],
        queryFn: async () => {
            let result = await unratedArtists({ limit: 100 });

            if (result.error) {
                errorHandler("getting unrated artists", result.error);
                return [];
            }

            // refresh data on subsequent loads
            tabulator?.replaceData(result.artist);

            return result.artist;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let artists = $derived(query.data || []);
</script>

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
    options={{ persistenceID: "artists" }}
></Tabulator>
