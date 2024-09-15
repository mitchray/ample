<script>
    import { albumPreset } from "~/components/lister/columns.js";
    import Actions from "~/components/action/actions.svelte";
    import MassRater from "~/components/lister/massRater.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";

    export let albumID;
    export let disks;
    export let disk;
    export let tracks;

    let tabulator = null;
</script>

{#if disks.length > 1}
    <h3 class="disk-title">Disc {disk}</h3>
{/if}

<div class="lister-tabulator">
    <div class="lister-tabulator__actions">
        {#if disks.length > 1}
            <Actions
                type="album"
                id={albumID}
                displayMode="fullButtons"
                showShuffle={tracks.length > 1}
                data={{ songs: tracks }}
            />
        {/if}
        <MassRater bind:tabulator type="song" />
    </div>

    <Tabulator
        bind:tabulator
        data={tracks}
        columns={albumPreset}
        options={{
            persistenceID: "album",
        }}
    ></Tabulator>
</div>

<style>
    .disk-title {
        margin-block-end: var(--spacing-md);
    }
</style>
