<script>
    import { getContext } from "svelte";
    import { ShowSongsByOtherArtists } from "~/stores/settings.js";
    import { CurrentMedia, User } from "~/stores/state.js";
    import { formatTotalTime } from "~/logic/formatters.js";
    import { albumPreset, checkbox } from "~/components/lister/columns.js";
    import Actions from "~/components/action/actions.svelte";
    import Rating from "~/components/rating/rating.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import ArtistList from "~/components/artist/artistList.svelte";
    import Lister from "~/components/lister/lister.svelte";
    import { createQuery } from "@tanstack/svelte-query";
    import { getAlbumDisks } from "~/logic/album.js";

    export let contextKey;

    const { getAlbum, getType, getFilterToArtist } = getContext(contextKey);

    let album = getAlbum();
    let type = getType();
    let filterToArtist = getFilterToArtist();

    $: query = createQuery({
        queryKey: ["albumSongs", album.id],
        queryFn: async () => {
            let albumDisks = await getAlbumDisks(album.id);

            if (filterToArtist) {
                albumDisks.forEach((diskArray) => {
                    const songsArray = diskArray[1];

                    songsArray.forEach((song) => {
                        song.notByArtist = !song.artists.find(
                            (artist) => artist.id === filterToArtist,
                        );
                    });
                });
            }

            return albumDisks;
        },
        enabled: $User.isLoggedIn,
    });
</script>

{#if $query.isLoading}
    <sl-spinner style="font-size: 2rem;"></sl-spinner>
{:else if $query.isSuccess}
    {#each $query.data as [disk, songs]}
        {#if $ShowSongsByOtherArtists === "hide" && songs.every((song) => song.notByArtist)}
            <!-- Hide this disk-->
        {:else}
            <div class="disk">
                {#if $query.data.length > 1}
                    <h4 class="disk-title">Disc {disk}</h4>
                {/if}

                {#if type === "slim"}
                    <ul class="expanded-columns">
                        {#each songs as song}
                            <li
                                class:not-by-artist={song.notByArtist}
                                class:hide={$ShowSongsByOtherArtists === "hide"}
                                class:highlight={$ShowSongsByOtherArtists ===
                                    "highlight"}
                            >
                                <div class="top">
                                    <span class="secondary-info">
                                        {song.track}.&nbsp;
                                    </span>
                                    <span class="name title truncate">
                                        {#if $CurrentMedia?.id === song.id}
                                            <span class="current-icon">
                                                <MaterialSymbol
                                                    name="play_circle"
                                                />
                                            </span>
                                        {/if}

                                        <a href="#/song/{song.id}">
                                            {song.title}
                                        </a>
                                    </span>
                                    <span class="secondary-info">
                                        {formatTotalTime(song.time)}
                                    </span>
                                </div>

                                <div class="middle">
                                    <div
                                        class="artists truncate secondary-info"
                                    >
                                        <ArtistList
                                            data={song}
                                            featuredOnly={true}
                                        />
                                    </div>
                                </div>

                                <div class="bottom">
                                    <Actions
                                        type="song"
                                        item={song}
                                        showLinks={true}
                                        displayMode="miniButtons"
                                    />
                                    <Rating data={song} type="song" />
                                </div>
                            </li>
                        {/each}
                    </ul>
                {:else}
                    <Lister
                        id="Album"
                        type="song"
                        data={songs}
                        columns={[checkbox, ...albumPreset]}
                        actionData={{
                            disable: [...$query.data].length < 2,
                            type: "album",
                            id: album.id,
                            displayMode: "fullButtons",
                            showShuffle: songs.length > 1,
                            data: Object.create({
                                songs: songs,
                            }),
                        }}
                        options={{
                            showArt: false,
                        }}
                    />
                {/if}
            </div>
        {/if}
    {/each}
{/if}

<style>
    .disk {
        width: 100%;
    }

    .disk + .disk {
        margin-block-start: var(--spacing-xl);
    }

    .artists {
        width: 100%;
    }

    .disk-title {
        margin-block-end: var(--spacing-sm);
    }

    .expanded-columns {
        columns: 30ch;
        column-rule: 1px solid var(--color-outline-variant);
        column-gap: var(--spacing-xxxl);
        row-gap: var(--spacing-md);
        width: 100%;
    }

    .expanded-columns li {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        padding-block: var(--spacing-md);
        gap: 2px;
    }

    .expanded-columns .top,
    .expanded-columns .bottom {
        display: flex;
    }

    .expanded-columns .bottom {
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .expanded-columns .name {
        margin-inline-end: auto;
        padding-inline-end: var(--spacing-md);
    }
</style>
