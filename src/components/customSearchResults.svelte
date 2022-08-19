<script>
    import Lister2 from '../components/lister/lister.svelte';

    export let loadedTime;
    export let loading;
    export let results = [];
    export let type;

    $: {
        // reset results if type changes
        if (type) {
            results = [];
        }
    }
</script>

{#if loading}
    <p>Searching for items</p>
{:else}
    {#if results.length > 0}
        <p>Total: {results.length}</p>
        {#key loadedTime}
            {#if type === "song"}
                <Lister2
                    bind:data={results}
                    type="{type}"
                    actionData={{
                        direct: results
                    }}
                />
            {/if}

            {#if type === "album"}
                <Lister2
                    bind:data={results}
                    type="{type}"
                    actionData={{
                        type: "albums",
                        data: results
                    }}
                />
            {/if}

            {#if type === "artist"}
                <Lister2
                    bind:data={results}
                    type="{type}"
                    actionData={{
                        type: "artists",
                        data: results
                    }}
                />
            {/if}

            {#if type === "playlist"}
                <Lister2
                    bind:data={results}
                    type="{type}"
                    actionData={{
                        type: "playlists",
                        data: results
                    }}
                />
            {/if}
        {/key}
    {:else}
        <p>No items found</p>
    {/if}
{/if}