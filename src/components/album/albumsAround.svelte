<script>
    import { _ } from 'svelte-i18n';
    import { onMount } from "svelte";
    import { fade } from 'svelte/transition';
    import { API } from "../../stores/api";
    import { groupAlbumsByReleaseType } from "../../logic/album";
    import AlbumCardMini from '../album/albumCardMini.svelte';

    export let album;

    let albums = Promise.resolve([]);
    let containerBind;

    onMount(() => {
        albums = $API.artistAlbums({ filter: album.artist.id })
            .then(async (results) => {
                let final = {};

                // filter out albums that aren't explicity by artist
                results = results.filter(a => a.artist.id === album.artist.id);

                // filter out the album being compared
                results = results.filter(a => a.id !== album.id);

                final.same = results.filter(a => a.year === album.year);
                final.same = await groupAlbumsByReleaseType(final.same, album.artist.id);

                final.previous = results.filter(a => a.year < album.year);
                let closestPrevious = final.previous[final.previous.length - 1];
                final.previous = final.previous.filter(a => a.year === closestPrevious.year);
                final.previous = await groupAlbumsByReleaseType(final.previous, album.artist.id);

                final.next = results.filter(a => a.year > album.year);
                let closestNext = final.next[0];
                final.next = final.next.filter(a => a.year === closestNext.year);
                final.next = await groupAlbumsByReleaseType(final.next, album.artist.id);

                return final;
            });
    });
</script>

{#await albums}

{:then albums}
    <div class="container"
         bind:this={containerBind}
         class:not-empty={containerBind?.firstElementChild}
         in:fade
    >
        {#if [...albums.previous.values()].find(arr => arr.length > 0)}
            <div class="previous">
                <h3>{$_('text.previous')}</h3>

                <div class="list">
                    {#each [...albums.previous] as [key, value], i}
                        {#each value as album}
                            <AlbumCardMini album={album} />
                        {/each}
                    {/each}
                </div>
            </div>
        {/if}

        {#if [...albums.same.values()].find(arr => arr.length > 0)}
            <div class="same">
                <h3>{$_('text.sameYear')}</h3>

                <div class="list">
                    {#each [...albums.same] as [key, value], i}
                        {#each value as album}
                            <AlbumCardMini album={album} />
                        {/each}
                    {/each}
                </div>
            </div>
        {/if}

        {#if [...albums.next.values()].find(arr => arr.length > 0)}
            <div class="next">
                <h3>{$_('text.next')}</h3>

                <div class="list">
                    {#each [...albums.next] as [key, value], i}
                        {#each value as album}
                            <AlbumCardMini album={album} />
                        {/each}
                    {/each}
                </div>
            </div>
        {/if}
    </div>
{/await}

<style>
    .list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
    }

    .container {
        display: flex;
        flex-direction: column;
        container-type: inline-size;
        gap: var(--spacing-xxl);
    }

    .container.not-empty {
        margin-block-start: var(--spacing-xxl);
    }

    @container (min-width: 800px) {
        .container {
            display: grid;
            grid-template-areas: "previous same next";
            grid-template-columns: 1fr 1fr 1fr;
        }
    }

    .previous {
        grid-area: previous;
    }

    .same {
        grid-area: same;
    }

    .next {
        grid-area: next;
    }
</style>