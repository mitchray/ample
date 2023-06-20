<script>
    import { _ } from 'svelte-i18n';
    import Lister from '../components/lister/lister.svelte';

    export let loadedTime;
    export let loading;
    export let results = [];
    export let type;
    export let showCheckboxes = false;

    $: {
        // reset results if type changes
        if (type) {
            results = [];
        }
    }
</script>

{#if loading}
    <p>{$_('text.searching')}</p>
{:else}
    {#if results.length > 0}
        <div class="total">{$_('text.total')}: {results.length}</div>
        {#key loadedTime}
            {#if type === "song"}
                <Lister
                    bind:data={results}
                    type="{type}"
                    showCheckboxes={showCheckboxes}
                    virtualList={true}
                    actionData={{
                        type: "",
                        mode: "fullButtons",
                        data: Object.create({songs: results})
                    }}
                />
            {/if}

            {#if type === "album"}
                <Lister
                    bind:data={results}
                    type="{type}"
                    showCheckboxes={showCheckboxes}
                    actionData={{
                        type: "albums",
                        mode: "fullButtons",
                        data: Object.create({albums: results})
                    }}
                />
            {/if}

            {#if type === "artist"}
                <Lister
                    bind:data={results}
                    type="{type}"
                    showCheckboxes={showCheckboxes}
                    actionData={{
                        type: "artists",
                        mode: "fullButtons",
                        data: Object.create({artists: results})
                    }}
                />
            {/if}

            {#if type === "playlist"}
                <Lister
                    bind:data={results}
                    type="{type}"
                    showCheckboxes={showCheckboxes}
                    actionData={{
                        type: "playlists",
                        mode: "fullButtons",
                        data: Object.create({playlists: results})
                    }}
                />
            {/if}
        {/key}
    {:else}
        <p>{$_('text.noItemsFound')}</p>
    {/if}
{/if}

<style>
    .total {
        margin-block-end: var(--spacing-lg);
    }
</style>