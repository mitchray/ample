<script>
    import { _ } from 'svelte-i18n';
    import { fade } from 'svelte/transition';
    import { getSongsFromAlbum } from '../../logic/song';
    import Lister from '../../components/lister/lister.svelte';

    export let id;
</script>

{#await getSongsFromAlbum({id: id, groupByDisc: true})}
    <p class="temp">{$_('text.loading')}</p>
{:then discs}
    {#if discs.size > 0}
        {#each [...discs] as [key, value], i}
            <section in:fade>
                <Lister
                    data={value}
                    type="song"
                    showArt={false}
                    tableOnly={true}
                    zone="album-contents"
                    actionData={{
                        disable: [...discs].length < 2,
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
        <p>{$_('text.noItemsFound')}</p>
    {/if}
{:catch error}
    <p>{$_('text.somethingWrong')}: {error.message}</p>
{/await}

<style>
    .temp {
        height: 500px;
    }

    section:not(:first-of-type) {
        margin-block-start: var(--spacing-xxxl);
    }
</style>