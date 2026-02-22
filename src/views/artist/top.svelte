<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { API, User } from "~/stores/state";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import Actions from "~/components/action/actions.svelte";
    import { index, songsPreset } from "~/components/lister/columns.js";
    import QueryError from "~/components/QueryError.svelte";
    import { createQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";

    let { artistID } = $props();

    const query = createQuery(() => ({
        queryKey: ["topArtistSongs", artistID],
        queryFn: async () => {
            let result = await $API.artistSongs({
                filter: artistID,
                top50: 1,
                limit: 20,
            });

            if (result.error) {
                errorHandler("getting top songs for artist", result.error);
                return [];
            }

            for (let i = 0; i < result.song.length; i++) {
                result.song[i].order = i + 1;
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    }));

    let tabulator = $state(null);

    // alias of returned data – ensure array for Tabulator
    let songs = $derived(Array.isArray(query.data?.song) ? query.data.song : []);
</script>

<QueryError {query} />

<Actions
    type="songs"
    displayMode="fullButtons"
    showShuffle={songs.length > 1}
    data={{ getSongs: () => tabulator?.getData("active") }}
/>

<Tabulator
    bind:tabulator
    data={songs}
    columns={[index, ...songsPreset]}
    type="songs"
    options={{ persistenceID: "songsArtistTop" }}
></Tabulator>
