<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';

    import { ShowExpandedAlbums } from "../../stores/status";

    import { getAlbumsByArtist, sortAlbumsByDate, groupAlbumsByReleaseType } from "../../logic/album";

    import AlbumCard from '../../components/album/albumCard.svelte';
    import AlbumCardExpanded from '../../components/album/albumCardExpanded.svelte';

    export let artistID;
    let albums;
    let sortedAlbums;
    let groupedAlbums;
    let loading = true;

    onMount(async () => {
        albums = await getAlbumsByArtist(artistID);
        sortedAlbums = await sortAlbumsByDate(albums);
        groupedAlbums = await groupAlbumsByReleaseType(sortedAlbums);
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
                        <h3 class="release-type panel-title">{key}</h3>
                    {/if}
                    <div class="items">
                        {#if $ShowExpandedAlbums}
                            {#each value as album}
                                <AlbumCardExpanded data="{album}"/>
                            {/each}
                        {:else}
                            <ul class="album-grid">
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
        text-transform: uppercase;
        margin-bottom: var(--spacing-md);
    }

    .items {
        margin-bottom: var(--spacing-xxxl);
    }

    .album-grid {
        margin-top: 0;
    }
</style>