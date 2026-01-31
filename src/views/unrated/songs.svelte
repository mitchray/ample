<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { songsPreset } from "~/components/lister/columns.js";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import { unratedSongs } from "~/logic/song.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";

    let tabulator = $state(null);

    const query = createQuery(() => ({
        queryKey: ["unratedSongs", Date.now()],
        queryFn: async () => {
            let result = await unratedSongs({ limit: 100 });

            if (result.error) {
                errorHandler("getting unrated songs", result.error);
                return [];
            }

            // refresh data on subsequent loads
            tabulator?.replaceData(result.song);

            return result.song;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let songs = $derived(query.data || []);
</script>

<div class="lister-tabulator">
    <div class="lister-tabulator__actions">
        <Actions
            type="songs"
            displayMode="fullButtons"
            showShuffle={true}
            data={{ songs: () => tabulator.getData("active") }}
        />

        <MassRater bind:tabulator type="song" />
    </div>

    <Tabulator
        bind:tabulator
        data={songs}
        columns={songsPreset}
        options={{ persistenceID: "songs" }}
    ></Tabulator>
</div>
