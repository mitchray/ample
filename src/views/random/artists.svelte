<script>
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { API, User } from "~/stores/state.js";
    import { artistsPreset } from "~/components/lister/columns.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import Actions from "~/components/action/actions.svelte";

    let tabulator = $state(null);

    const query = createQuery(() => ({
        queryKey: ["randomArtists", Date.now()],
        queryFn: async () => {
            let response = await $API.stats({
                type: "artist",
                filter: "random",
                limit: 100,
            });

            if (response.error) {
                errorHandler("getting random artists", response.error);
                return [];
            }

            // refresh data on subsequent loads
            tabulator?.replaceData(response.artist);

            return response.artist;
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
        getArtists: () => tabulator.getData("active"),
    }}
/>

<Tabulator
    bind:tabulator
    data={artists}
    columns={artistsPreset}
    type="artists"
    options={{ persistenceID: "artists" }}
></Tabulator>
