<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { API } from "../../stores/api";
    import { ShowExpandedAlbums } from "../../stores/status";

    import { sortAlbumsByDate, groupAlbumsByReleaseType } from "../../logic/album";

    import AlbumCard from '../../components/album/albumCard.svelte';
    import AlbumCardExpanded from '../../components/album/albumCardExpanded.svelte';

    export let artistID;
    let albums;
    let sortedAlbums;
    let groupedAlbums;
    let loading = true;

    onMount(async () => {
        albums = await $API.artistAlbums({ filter: artistID });
        sortedAlbums = await sortAlbumsByDate(albums);
        groupedAlbums = await groupAlbumsByReleaseType(sortedAlbums, artistID);
        loading = false;
    });
</script>

{#if loading}
    <p>Loading releases</p>
{:else}
    {#if groupedAlbums}
        {#each [...groupedAlbums] as [key, value], i}
            {#if value.length > 0}
                <section in:fade={{ duration: i === 0 ? undefined : 0 }}>
                    {#if key !== "ungrouped"}
                        <div class="release-type release-type-label" title="Release type: {key}">{key}</div>
                    {/if}
                    <div class="items">
                        {#if $ShowExpandedAlbums}
                            {#each value as album}
                                <AlbumCardExpanded data="{album}"/>
                            {/each}
                        {:else}
                            <ul class="cardlist-grid album-grid">
                                {#each value as album}
                                    <li>
                                        <AlbumCard data="{album}"/>
                                    </li>
                                {/each}
                            </ul>
                        {/if}
                    </div>
                </section>
            {/if}
        {/each}
    {:else}
        <p>Unable to find any albums</p>
    {/if}
{/if}

<style>
    .release-type {
        margin-bottom: var(--spacing-md);
        font-size: unset;
        padding: 0.4em 0.5em;
    }

    .items {
        margin-bottom: var(--spacing-xxxl);
    }

    .album-grid {
        margin-top: 0;
    }
</style>