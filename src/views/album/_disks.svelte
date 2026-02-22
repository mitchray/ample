<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { getAlbumDisks } from "~/logic/album.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { User } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";
    import QueryError from "~/components/QueryError.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { albumPreset } from "~/components/lister/columns.js";

    let { albumID, tabulatorRef = $bindable(null) } = $props();

    const query = createQuery(() => ({
        queryKey: ["albumDisks", albumID],
        queryFn: async () => {
            let result = await getAlbumDisks(albumID);

            if (result.error) {
                errorHandler("getting album disks", result.error);
                return [];
            }

            return result;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data – ensure array for derived logic
    let disks = $derived(Array.isArray(query.data) ? query.data : []);

    // Single Tabulator: all tracks with _groupKey when multiple discs; no group when single disc
    let tabulator = $state(null);
    let allTracksWithGroup = $derived.by(() => {
        if (!disks.length) return [];
        if (disks.length === 1) return disks[0][1];
        return disks.flatMap(([diskTitle, tracks]) =>
            tracks.map((t) => ({ ...t, _groupKey: diskTitle })),
        );
    });
    let hasMultipleDisks = $derived(disks.length > 1);
    let tabulatorOptions = $derived.by(() => {
        const base = { persistenceID: "album" };
        if (hasMultipleDisks) {
            base.groupBy = "_groupKey";
            base.groupHeader = (value) => `Disc ${value}`;
        }
        return base;
    });

    $effect(() => {
        tabulatorRef = tabulator;
    });
</script>

<QueryError {query} />

{#if query.isSuccess && disks.length > 0}
    <section>
        <Tabulator
            bind:tabulator
            data={allTracksWithGroup}
            columns={albumPreset}
            type="songs"
            options={tabulatorOptions}
        />
    </section>
{/if}

<style>
    section:not(:first-of-type) {
        margin-block-start: var(--spacing-xxxl);
    }
</style>
