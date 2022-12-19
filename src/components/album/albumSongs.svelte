<script>
    import { fade } from 'svelte/transition';
    import { getSongsFromAlbum } from '../../logic/song';
    import Lister2 from '../../components/lister/lister.svelte';

    export let id;
</script>

{#await getSongsFromAlbum({id: id, groupByDisc: true})}
    <p class="temp">Loading songs</p>
{:then discs}
    {#if discs.size > 0}
        {#each [...discs] as [key, value], i}
            <section in:fade>
                <Lister2
                    data={value}
                    type="song"
                    tableOnly={true}
                    zone="album-contents"
                    actionData={{
                        type: "album",
                        id: key,
                        mode: "miniButtons",
                        showShuffle: value.length > 1,
                        data: Object.create({songs: value})
                    }}
                />
            </section>
        {/each}
    {:else}
        <p>Unable to find songs</p>
    {/if}
{:catch error}
    <p>Something went wrong: {error.message}</p>
{/await}

<style>
    .temp {
        height: 500px;
    }

    section {
        margin-top: var(--spacing-lg);
    }
</style>