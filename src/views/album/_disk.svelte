<script>
    import { albumPreset } from "~/components/lister/columns.js";
    import Actions from "~/components/action/actions.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";

    let { albumID, disks, disk, tracks } = $props();

    let tabulator = $state(null);
</script>

{#if disks.length > 1}
    <h3 class="disk-title">Disc {disk}</h3>
{/if}

<div class="lister-tabulator">
    {#if disks.length > 1}
        <Actions
            type="songs"
            id={albumID}
            displayMode="miniButtons"
            showShuffle={tracks.length > 1}
            data={{ getSongs: () => tabulator.getData("active") }}
        />
    {/if}

    <Tabulator
        bind:tabulator
        data={tracks}
        columns={albumPreset}
        type="songs"
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
