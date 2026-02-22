<script>
    import { _ } from "@rgglez/svelte-i18n";
    import Actions from "~/components/action/actions.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { songsPreset } from "~/components/lister/columns.js";
    import { getSongVersions } from "~/logic/song";
    import { createQuery } from "@tanstack/svelte-query";
    import { PageTitle, User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import QueryError from "~/components/QueryError.svelte";

    let { params = {} } = $props();

    let tabulator = $state(null);

    $effect(() => {
        $PageTitle =
            $_("text.versionsOf", {
                values: {
                    songTitle: params.songTitle,
                    artistName: params.artistName,
                },
            }) || $_("text.songVersions");
    });

    const query = createQuery(() => ({
        queryKey: ["songVersions", params.songTitle + params.artistName],
        queryFn: async () => {
            let result = await getSongVersions(
                params.songTitle,
                params.artistName,
            );

            if (result.error) {
                errorHandler("getting song versions", result.error);
                return [];
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data – ensure array for Tabulator
    let songs = $derived(Array.isArray(query.data) ? query.data : []);
</script>

<div class="page-header">
    <h1 class="page-title">
        {$PageTitle}
    </h1>
</div>

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
    columns={songsPreset}
    type="songs"
    options={{
        persistenceID: "songs",
    }}
></Tabulator>
