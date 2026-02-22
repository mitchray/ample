<script>
    import { createQuery } from "@tanstack/svelte-query";
    import { API, PageTitle, User } from "~/stores/state.js";
    import { _ } from "@rgglez/svelte-i18n";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { errorHandler } from "~/logic/helper.js";
    import QueryError from "~/components/QueryError.svelte";
    import { liveStreamsPreset } from "~/components/lister/columns.js";

    const query = createQuery(() => ({
        queryKey: ["liveStreams"],
        queryFn: async () => {
            let result = await $API.liveStreams();

            if (result.error) {
                errorHandler("getting artist", result.error);
                return [];
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data – ensure array for Tabulator
    let liveStreams = $derived(Array.isArray(query.data) ? query.data : []);

    let title = $_("text.radio");
    $PageTitle = title;

    let tabulator = $state(null);
</script>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

<QueryError {query} />

<Tabulator
    bind:tabulator
    data={liveStreams}
    columns={liveStreamsPreset}
    type="live_streams"
    options={{ persistenceID: "livestreams" }}
></Tabulator>
