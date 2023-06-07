<script>
    import { _ } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { API } from "../../stores/api";
    import { ShowExpandedAlbums, GroupAlbumsByReleaseType } from "../../stores/status";

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
    {#if $GroupAlbumsByReleaseType && groupedAlbums}
        {#each [...groupedAlbums] as [key, value], i}
            {#if value.length > 0}
                <section in:fade={{ duration: i === 0 ? undefined : 0 }}>
                    {#if key !== "ungrouped"}
                        <div class="release-type release-type-label" title="{$_('text.releaseType')}: {key}">{key}</div>
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
    {:else if sortedAlbums}
        <section>
            <div class="items">
                {#if $ShowExpandedAlbums}
                    {#each sortedAlbums as album}
                        <AlbumCardExpanded data="{album}"/>
                    {/each}
                {:else}
                    <ul class="cardlist-grid album-grid">
                        {#each sortedAlbums as album}
                            <li>
                                <AlbumCard data="{album}"/>
                            </li>
                        {/each}
                    </ul>
                {/if}
            </div>
        </section>
    {:else}
        <p>{$_('text.noItemsFound')}</p>
    {/if}
{/if}

<style>
    .release-type {
        margin-bottom: var(--spacing-md);
        font-size: unset;
        padding: 0.4em 0.5em;
    }

    section:not(:first-of-type) {
        margin-top: var(--spacing-xxxl);
    }

    .album-grid {
        margin-top: 0;
    }
</style>