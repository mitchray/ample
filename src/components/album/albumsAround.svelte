<script>
    import { _ } from "svelte-i18n";
    import { fade } from "svelte/transition";
    import { API, User } from "~/stores/state.js";
    import { groupAlbumsByReleaseType } from "~/logic/album.js";
    import AlbumCardMini from "~/components/cards/albumCardMini.svelte";
    import { createQuery } from "@tanstack/svelte-query";

    export let album;

    let containerBind;

    $: query = createQuery({
        queryKey: ["albumsAround", album.id],
        queryFn: async () => {
            let result = await $API.artistAlbums({ filter: album.artist.id });

            if (result.error) {
                console.error(
                    "Ample error getting albums around",
                    result.error,
                );
                return [];
            }

            let final = {};

            // filter out albums that aren't explicitly by artist
            result = result.filter((a) => a.artist.id === album.artist.id);

            // filter out the album being compared
            result = result.filter((a) => a.id !== album.id);

            final.same = result.filter((a) => a.year === album.year);
            final.same = await groupAlbumsByReleaseType(
                final.same,
                album.artist.id,
            );

            final.previous = result.filter((a) => a.year < album.year);
            let closestPrevious = final.previous[final.previous.length - 1];
            final.previous = final.previous.filter(
                (a) => a.year === closestPrevious.year,
            );
            final.previous = await groupAlbumsByReleaseType(
                final.previous,
                album.artist.id,
            );

            final.next = result.filter((a) => a.year > album.year);
            let closestNext = final.next[0];
            final.next = final.next.filter((a) => a.year === closestNext.year);
            final.next = await groupAlbumsByReleaseType(
                final.next,
                album.artist.id,
            );

            return final;
        },
        enabled: $User.isLoggedIn,
    });

    // alias of returned data
    $: albums = $query.data || {};
</script>

{#if $query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if $query.isError}
    <p>Error: {$query.error.message}</p>
{:else if $query.isSuccess}
    <div
        class="container"
        bind:this={containerBind}
        class:not-empty={containerBind?.firstElementChild}
        in:fade
    >
        {#if [...albums.previous.values()].find((arr) => arr.length > 0)}
            <div class="previous">
                <h3>{$_("text.previous")}</h3>

                <div class="list">
                    {#each [...albums.previous] as [key, value], i}
                        {#each value as album}
                            <AlbumCardMini data={album} />
                        {/each}
                    {/each}
                </div>
            </div>
        {/if}

        {#if [...albums.same.values()].find((arr) => arr.length > 0)}
            <div class="same">
                <h3>{$_("text.sameYear")}</h3>

                <div class="list">
                    {#each [...albums.same] as [key, value], i}
                        {#each value as album}
                            <AlbumCardMini data={album} />
                        {/each}
                    {/each}
                </div>
            </div>
        {/if}

        {#if [...albums.next.values()].find((arr) => arr.length > 0)}
            <div class="next">
                <h3>{$_("text.next")}</h3>

                <div class="list">
                    {#each [...albums.next] as [key, value], i}
                        {#each value as album}
                            <AlbumCardMini data={album} />
                        {/each}
                    {/each}
                </div>
            </div>
        {/if}
    </div>
{/if}

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
