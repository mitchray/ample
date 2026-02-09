<script>
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { API, User } from "~/stores/state.js";
    import { songsPreset } from "~/components/lister/columns.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import Actions from "~/components/action/actions.svelte";

    let tabulator = $state(null);

    const query = createQuery(() => ({
        queryKey: ["randomSongs", Date.now()],
        queryFn: async () => {
            let response = await $API.stats({
                type: "song",
                filter: "random",
                limit: 100,
            });

            if (response.error) {
                errorHandler("getting random songs", response.error);
                return [];
            }

            // refresh data on subsequent loads
            tabulator?.replaceData(response.song);

            return response.song;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let songs = $derived(query.data || []);
</script>

<Actions
    type="songs"
    displayMode="fullButtons"
    showShuffle={true}
    data={{ getSongs: () => tabulator.getData("active") }}
/>

<Tabulator
    bind:tabulator
    data={songs}
    columns={songsPreset}
    type="songs"
    options={{ persistenceID: "songs" }}
></Tabulator>
