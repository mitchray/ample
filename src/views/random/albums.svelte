<script>
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import { API, User } from "~/stores/state.js";
    import { albumsPreset } from "~/components/lister/columns.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";
    import Actions from "~/components/action/actions.svelte";

    let tabulator = $state(null);

    const query = createQuery(() => ({
        queryKey: ["randomAlbums", Date.now()],
        queryFn: async () => {
            let response = await $API.stats({
                type: "album",
                filter: "random",
                limit: 100,
            });

            if (response.error) {
                errorHandler("getting random albums", response.error);
                return [];
            }

            // refresh data on subsequent loads
            tabulator?.replaceData(response.album);

            return response.album;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let albums = $derived(query.data || []);
</script>

<div class="lister-tabulator">
    <div class="lister-tabulator__actions">
        <Actions
            type="albums"
            displayMode="fullButtons"
            showShuffle={true}
            data={{ getAlbums: () => tabulator.getData("active") }}
        />

        <MassRater bind:tabulator type="album" />
    </div>

    <Tabulator
        bind:tabulator
        data={albums}
        columns={albumsPreset}
        type="albums"
        options={{
            persistenceID: "albums",
        }}
    ></Tabulator>
</div>
