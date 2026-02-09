<script>
    import { getContext } from "svelte";
    import { Settings } from "~/stores/settings.js";
    import { CurrentMedia, User } from "~/stores/state.js";
    import { formatTotalTime } from "~/logic/formatters.js";
    import Rating from "~/components/rating/rating.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import ArtistList from "~/components/artist/artistList.svelte";
    import Actions from "~/components/action/actions.svelte";
    import Tabulator from "~/components/lister/Tabulator.svelte";
    import { albumPreset } from "~/components/lister/columns.js";
    import { createQuery } from "@tanstack/svelte-query";
    import { getAlbumDisks } from "~/logic/album.js";

    let { contextKey } = $props();

    const { getAlbum, getType } = getContext(contextKey);

    let album = getAlbum();
    let type = getType();
    let tabulator = $state();
    let filterToArtistID = getContext("filterToArtistID");

    let disks = $derived.by(() => {
        let arr = [];

        query.data?.forEach(([disk, songs]) => {
            songs.forEach((song) => {
                song.doesNotContainArtist = !song.artists.find(
                    (a) => a.id === filterToArtistID,
                );
            });

            arr.push({
                index: disk,
                songs: songs,
                songsByArtist: songs.filter((song) =>
                    song.artists?.some((a) => a.id === filterToArtistID),
                ),
                doesNotContainArtist: songs.every(
                    (song) =>
                        !song.artists.some((a) => a.id === filterToArtistID),
                ),
            });
        });

        return arr;
    });

    const query = createQuery(() => ({
        queryKey: ["albumDisks", album.id],
        queryFn: async () => {
            // let test = await getAlbumDisks(album.id);
            // console.debug(test, "TEST");
            return await getAlbumDisks(album.id);
        },
        enabled: $User.isLoggedIn,
    }));
</script>

{#if query.isLoading}
    <sl-spinner style="font-size: 2rem;"></sl-spinner>
{:else if query.isError}
    <p>Error: {query.error.message}</p>
{:else if query.isSuccess}
    {#each disks as disk}
        {#if $Settings.ShowSongsByOtherArtists === "hide" && filterToArtistID && disk.doesNotContainArtist}
            <!-- Hide this disk-->
        {:else}
            <div class="disk">
                {#if disks.length > 1}
                    <h4 class="disk-title">Disc {disk.index}</h4>
                {/if}

                {#if type === "slim"}
                    <ul class="expanded-columns">
                        {#each disk.songs as song}
                            <li
                                class:not-by-artist={song.doesNotContainArtist}
                                class:hide={filterToArtistID &&
                                    $Settings.ShowSongsByOtherArtists ===
                                        "hide"}
                                class:highlight={filterToArtistID &&
                                    $Settings.ShowSongsByOtherArtists ===
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
                                        items={[song]}
                                        showLinks={true}
                                        displayMode="miniButtons"
                                    />
                                    <Rating data={song} type="song" />
                                </div>
                            </li>
                        {/each}
                    </ul>
                {:else}
                    {#key $Settings.ShowSongsByOtherArtists || 0}
                        {#if disks.length > 1}
                            <Actions
                                type="songs"
                                items={disk.songs}
                                displayMode="fullButtons"
                                showShuffle={disk.songs.length > 1}
                                data={{ getSongs: () => disk.songs }}
                            />
                        {/if}

                        <Tabulator
                            bind:tabulator
                            data={$Settings.ShowSongsByOtherArtists ===
                                "hide" && filterToArtistID
                                ? disk.songsByArtist
                                : disk.songs}
                            columns={albumPreset}
                            type="songs"
                            options={{
                                rowFormatter: function (row) {
                                    if (
                                        $Settings.ShowSongsByOtherArtists ===
                                            "highlight" &&
                                        filterToArtistID &&
                                        row.getData().doesNotContainArtist
                                    ) {
                                        row.getElement().classList.add(
                                            "not-by-artist",
                                            "highlight",
                                        );
                                    }
                                },
                                persistenceID: "album",
                            }}
                        ></Tabulator>
                    {/key}
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
        columns: 31ch;
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
