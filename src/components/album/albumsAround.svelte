<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { fade } from "svelte/transition";
    import { API, User } from "~/stores/state.js";
    import { groupAlbumsByReleaseType } from "~/logic/album.js";
    import AlbumCardMini from "~/components/cards/albumCardMini.svelte";
    import { createQuery } from "@tanstack/svelte-query";
    import { errorHandler } from "~/logic/helper.js";

    let { album } = $props();

    let containerBind = $state();

    const query = createQuery(() => ({
        queryKey: ["albumsAround", album.id],
        queryFn: async () => {
            let final = {};

            // 'Various' has no id so abort
            if (parseInt(album.artist.id) === 0) return [];

            let result = await $API.artistAlbums({
                filter: album.artist.id,
                sort: "year",
            });

            if (result.error) {
                errorHandler("getting albums around", result.error);
                return [];
            }

            let albums = result.album || [];

            // filter out albums that aren't explicitly by artist
            albums = albums.filter((a) => a.artist.id === album.artist.id);

            // filter out the album being compared
            albums = albums.filter((a) => a.id !== album.id);

            final.same = albums.filter((a) => a.year === album.year);
            final.same = await groupAlbumsByReleaseType(final.same);

            final.previous = albums.filter((a) => a.year < album.year);
            final.previous.sort((a, b) => b.year - a.year);
            final.previous = await groupAlbumsByReleaseType(final.previous);

            final.next = albums.filter((a) => a.year > album.year);
            final.next.sort((a, b) => a.year - b.year);
            final.next = await groupAlbumsByReleaseType(final.next);

            return final;
        },
        enabled: $User.isLoggedIn,
    }));

    // alias of returned data
    let albums = $derived(query.data || {});
</script>

{#if query.isLoading}
    <p>{$_("text.loading")}</p>
{:else if query.isError}
    <p>Error: {query.error.message}</p>
{:else if query.isSuccess}
    <div
        class="container"
        bind:this={containerBind}
        class:not-empty={containerBind?.firstElementChild}
        in:fade
    >
        {#if albums.previous && [...albums.previous.values()].find((arr) => arr.length > 0)}
            <div class="previous">
                <h3>{$_("text.earlier")}</h3>

                <div class="list">
                    {#each [...albums.previous] as [key, value], i}
                        {#each value as album}
                            <AlbumCardMini data={album} />
                        {/each}
                    {/each}
                </div>
            </div>
        {/if}

        {#if albums.same && [...albums.same.values()].find((arr) => arr.length > 0)}
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

        {#if albums.next && [...albums.next.values()].find((arr) => arr.length > 0)}
            <div class="next">
                <h3>{$_("text.later")}</h3>

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
        margin-block: var(--spacing-xxl);
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
