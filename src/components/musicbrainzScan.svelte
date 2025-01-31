<script>
    import { _ } from "svelte-i18n";
    import { fade } from "svelte/transition";
    import { throttle } from "throttle-wait";
    import { formatTotalTime } from "~/logic/formatters.js";
    import { getSongsFromArtist } from "~/logic/song";
    import MusicBrainz from "~/logic/musicbrainz";
    import Art from "~/components/art.svelte";
    import Portal from "~/components/portal.svelte";
    import { Settings } from "~/stores/settings.js";
    import { untrack } from "svelte";

    let { data } = $props();

    let mb = new MusicBrainz();
    let hasMusicbrainz = mb.hasMBID(data);

    let combinedSources = $state([]);
    let songs = [];
    let allRecordings = [];
    let loadCount = $state(0);
    let limit = 100;
    let fetching = $state(false);
    let loaded = $state(false);
    let queryURL = $state();
    let additionalQueries = $state();
    let filteredRecordings = $state([]);
    let counts = $state({
        reported: 0,
        matches: 0,
        duplicates: 0,
        issues: 0,
        flagged: 0,
        missing: 0,
    });
    let dialog = $state();

    $effect(() => {
        queryURL = `https://musicbrainz.org/ws/2/recording/?artist=${
            data.mbid
        }&limit=${limit}&offset=${loadCount * limit}`;
    });

    $effect(() => {
        if (loaded && $Settings.MusicBrainzFilters) {
            let filters = [
                /* BY STATUS */
                {
                    flag: $Settings.MusicBrainzFilters.hideMatches,
                    condition: (item) => item.status !== "exact",
                },
                {
                    flag: $Settings.MusicBrainzFilters.hideDuplicates,
                    condition: (item) => item.status !== "duplicate",
                },
                {
                    flag: $Settings.MusicBrainzFilters.hideIssues,
                    condition: (item) => item.status !== "issue",
                },
                {
                    flag: $Settings.MusicBrainzFilters.hideInfos,
                    condition: (item) => item.status !== "info",
                },
                {
                    flag: $Settings.MusicBrainzFilters.hideMissing,
                    condition: (item) => item.status !== "missing",
                },
                /* VIDEOS */
                {
                    flag: $Settings.MusicBrainzFilters.hideVideos,
                    condition: (item) => item.video !== true,
                },
                {
                    flag: $Settings.MusicBrainzFilters.hideVideos,
                    condition: (item) => !item.disambiguation.match(/video/i),
                },
                {
                    flag: $Settings.MusicBrainzFilters.hideVideos,
                    condition: (item) => !item.title.match(/\(video(\)|\s)/i),
                },
                /* REMIXES */
                {
                    flag: $Settings.MusicBrainzFilters.hideRemixes,
                    condition: (item) => !item.disambiguation.match(/remix/i),
                },
                {
                    flag: $Settings.MusicBrainzFilters.hideRemixes,
                    condition: (item) =>
                        !item.title.match(/(re)?mix(,|\)|\]|\s)/i),
                },
                /* LIVE */
                {
                    flag: $Settings.MusicBrainzFilters.hideLive,
                    condition: (item) => !item.disambiguation.match(/live/i),
                },
                {
                    flag: $Settings.MusicBrainzFilters.hideLive,
                    condition: (item) =>
                        !item.title.match(/(\[|\()live(,|\]|\)|\s)/i),
                },
                /* INSTRUMENTALS */
                {
                    flag: $Settings.MusicBrainzFilters.hideInstrumentals,
                    condition: (item) =>
                        !item.disambiguation.match(
                            /(instrumentals?|a\s?capellas?)/i,
                        ),
                },
                {
                    flag: $Settings.MusicBrainzFilters.hideInstrumentals,
                    condition: (item) =>
                        !item.title.match(
                            /\((instrumentals?|acapellas?)(,|\)|\s)/i,
                        ),
                },
                /* DEMOS */
                {
                    flag: $Settings.MusicBrainzFilters.hideDemos,
                    condition: (item) => !item.disambiguation.match(/demo/i),
                },
                {
                    flag: $Settings.MusicBrainzFilters.hideDemos,
                    condition: (item) => !item.title.match(/\(demo(,|\)|\s)/i),
                },
                /* INTERVIEWS */
                {
                    flag: $Settings.MusicBrainzFilters.hideInterviews,
                    condition: (item) =>
                        !item.title.match(/(interview|commentary)/i),
                },
                {
                    flag: $Settings.MusicBrainzFilters.hideInterviews,
                    condition: (item) =>
                        !item.disambiguation.match(/(interview|commentary)/i),
                },
                /* ZERO TIMES */
                {
                    flag: $Settings.MusicBrainzFilters.hideZeroTimes,
                    condition: (item) => !item.time === false,
                },
                /* SHORT SONGS */
                {
                    flag: $Settings.MusicBrainzFilters.hideShortSongs,
                    condition: (item) => item.time > 60,
                },
                /* RADIO EDITS */
                {
                    flag: $Settings.MusicBrainzFilters.hideRadioEdits,
                    condition: (item) =>
                        !item.disambiguation.match(/\(radio edit\)/i),
                },
                {
                    flag: $Settings.MusicBrainzFilters.hideRadioEdits,
                    condition: (item) => !item.title.match(/\(radio edit\)/i),
                },
            ];

            filteredRecordings = combinedSources.filter((item) =>
                filters.every(
                    (filter) => !filter.flag || filter.condition(item),
                ),
            );

            untrack(() => {
                // sort alphabetically
                filteredRecordings = filteredRecordings.sort(
                    function (obj1, obj2) {
                        return obj1.title.localeCompare(obj2.title);
                    },
                );
            });
        }
    });

    $effect(() => {
        if (loaded) {
            // get counts
            counts.matches = combinedSources.reduce(function (n, single) {
                return n + (single.status === "exact");
            }, 0);

            counts.duplicates = combinedSources.reduce(function (n, single) {
                return n + (single.status === "duplicate");
            }, 0);

            counts.issues = combinedSources.reduce(function (n, single) {
                return n + (single.status === "issue");
            }, 0);

            counts.flagged = combinedSources.reduce(function (n, single) {
                return n + (single.status === "flag");
            }, 0);

            counts.missing = combinedSources.reduce(function (n, single) {
                return n + (single.status === "missing");
            }, 0);
        }
    });

    async function mbQuery() {
        return await fetch(queryURL, {
            method: "GET",
            headers: mb.headers,
        })
            .then((response) => response.json())
            .then((data) => {
                counts.reported = data["recording-count"];

                allRecordings = [...allRecordings, ...data["recordings"]];

                loadCount++;
            })
            .catch((err) => {
                console.error("Error reading MusicBrainz data " + err);
                return err;
            });
    }

    const throttledMbQuery = throttle(2.5 * 1000, mbQuery);

    function sanitiseText(text) {
        let similarChars = /(…|\.|,|'|’|"|!|\?)/gi;

        return text.toLowerCase().trim().replace(similarChars, "");
    }

    async function handleGo() {
        if (!hasMusicbrainz) {
            return false;
        }

        fetching = true;

        // perform first query
        await throttledMbQuery(queryURL);

        additionalQueries = Math.ceil((counts.reported - limit) / limit);

        // perform additional queries until done
        for (let i = 0; i < additionalQueries; i++) {
            await throttledMbQuery(queryURL);
        }

        // grab our artists songs from library
        songs = await getSongsFromArtist(data.id);

        // loop local songs
        for (let i = 0; i < songs.length; i++) {
            songs[i].message = "SHOULDN'T SEE THIS";

            // set .disambiguation as name and album title
            songs[i].disambiguation =
                songs[i].title + " " + songs[i].album.title;

            let perfectMatch = allRecordings.findIndex(function (item) {
                return item.id === songs[i].mbid;
            });

            let nameMatch = allRecordings.findIndex(function (item) {
                return (
                    sanitiseText(item.title) === sanitiseText(songs[i].title)
                );
            });

            // exact match found
            if (perfectMatch !== -1) {
                songs[i].message = $_("text.mbPerfectMatch");
                songs[i].status = "exact";
            } else {
                if (!songs[i].mbid) {
                    // if name match found
                    if (nameMatch !== -1) {
                        songs[i].message = $_("text.mbNameMatch");
                        songs[i].status = "issue";
                    } else {
                        songs[i].message = $_("text.mbNoMatch");
                        songs[i].status = "flag";
                    }
                } else if (mb.regex.test(songs[i].mbid)) {
                    songs[i].message = $_("text.mbValidMBID");
                    songs[i].status = "issue";
                } else {
                    songs[i].message = $_("text.mbInvalidMBID");
                    songs[i].status = "issue";
                }
            }
        }

        combinedSources.push(...songs);

        // loop MB recordings
        for (let i = 0; i < allRecordings.length; i++) {
            let temp = {
                isRemote: true,
                title: allRecordings[i].title,
                mbid: allRecordings[i].id,
                time: allRecordings[i].length / 1000,
                disambiguation: allRecordings[i].disambiguation,
                video: allRecordings[i].video,
                message: $_("text.mbNotFound"),
                status: "missing",
            };

            let perfectMatch = songs.findIndex(function (item) {
                return item.mbid === temp.mbid;
            });

            let exactNameMatch = songs.findIndex(function (item) {
                return (
                    item.status === "exact" &&
                    sanitiseText(item.title) ===
                        sanitiseText(allRecordings[i].title)
                );
            });

            let nameMatch = songs.findIndex(function (item) {
                return (
                    sanitiseText(item.title) ===
                    sanitiseText(allRecordings[i].title)
                );
            });

            // if name match found
            if (exactNameMatch !== -1) {
                temp.message = $_("text.mbMissingMatchMBID");
                temp.status = "duplicate";
            } else if (nameMatch !== -1) {
                temp.message = $_("text.mbMissingMatchName");
                temp.status = "issue";
            }

            // if NOT a perfect match, add to the list
            if (perfectMatch === -1) {
                temp = temp;

                // add to combined sources
                combinedSources.push(temp);
            }
        }

        fetching = false;
        loaded = true;
    }
</script>

<div class="top">
    <sl-button
        onclick={() => {
            dialog.show();
        }}
    >
        {$_("text.filters")}
    </sl-button>

    <span>
        {$_("text.mbShowing", {
            values: {
                filteredCount: filteredRecordings.length,
                totalCount: combinedSources.length,
            },
        })}
    </span>
</div>

<div class="results">
    {#if fetching && additionalQueries > 0}
        <sl-progress-bar
            value={(loadCount / (additionalQueries + 1)) * 100}
        ></sl-progress-bar>
    {/if}

    {#if hasMusicbrainz}
        {#if loadCount < 1}
            <sl-button variant="primary" onclick={handleGo} class="submit">
                {$_("text.beginComparison")}
            </sl-button>
        {/if}
    {:else}
        <p>{$_("text.mbArtistMissingMBID")}</p>
    {/if}

    {#if loaded & (loadCount > 0)}
        {#if filteredRecordings.length > 0}
            <table in:fade>
                <thead>
                    <tr>
                        <th>{$_("text.item")}</th>
                        <th>{$_("text.length")}</th>
                        <th>{$_("text.result")}</th>
                    </tr>
                </thead>
                <tbody>
                    {#each filteredRecordings as item, i}
                        <tr class:is-remote={item.isRemote}>
                            <td class="title">
                                <div class="item-container">
                                    {#if !item.isRemote}
                                        <a class="art" href="#/song/{item.id}">
                                            <Art
                                                size="thumbnail"
                                                data={item}
                                                type="song"
                                            />
                                        </a>
                                    {/if}

                                    <div class="info">
                                        {item.title}
                                        {#if item.mbid}
                                            <a
                                                class="mbid"
                                                target="_blank"
                                                href={`https://musicbrainz.org/recording/${item.mbid}`}
                                            >
                                                {item.mbid}
                                            </a>
                                        {/if}
                                    </div>
                                </div>
                            </td>
                            <td class="time">
                                {formatTotalTime(item.time)}
                            </td>
                            <td>
                                {#if item.status === "exact"}
                                    <sl-badge variant="success">
                                        {item.message}
                                    </sl-badge>
                                {/if}

                                {#if item.status === "issue" || item.status === "duplicate"}
                                    <sl-badge variant="warning">
                                        {item.message}
                                    </sl-badge>
                                {/if}

                                {#if item.status === "flag"}
                                    <sl-badge variant="primary">
                                        {item.message}
                                    </sl-badge>
                                {/if}

                                {#if item.status === "missing"}
                                    <sl-badge variant="danger">
                                        {item.message}
                                    </sl-badge>
                                {/if}
                            </td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        {:else}
            <p>{$_("text.mbNoRecordings")}</p>
        {/if}
    {/if}
</div>

<Portal>
    <sl-dialog bind:this={dialog} label="Filters">
        <div class="filters">
            <div class="group">
                <h4>{$_("text.mbHideByStatus")}</h4>

                <sl-checkbox
                    checked={$Settings.MusicBrainzFilters.hideMatches}
                    onsl-change={(e) =>
                        ($Settings.MusicBrainzFilters.hideMatches =
                            e.target.checked)}
                >
                    {$_("text.mbExactMatches")} ({counts.matches})
                </sl-checkbox>

                <sl-checkbox
                    checked={$Settings.MusicBrainzFilters.hideDuplicates}
                    onsl-change={(e) =>
                        ($Settings.MusicBrainzFilters.hideDuplicates =
                            e.target.checked)}
                >
                    {$_("text.mbDuplicates")} ({counts.duplicates})
                </sl-checkbox>

                <sl-checkbox
                    checked={$Settings.MusicBrainzFilters.hideIssues}
                    onsl-change={(e) =>
                        ($Settings.MusicBrainzFilters.hideIssues =
                            e.target.checked)}
                >
                    {$_("text.mbIssues")} ({counts.issues})
                </sl-checkbox>

                <sl-checkbox
                    checked={$Settings.MusicBrainzFilters.hideFlagged}
                    onsl-change={(e) =>
                        ($Settings.MusicBrainzFilters.hideFlagged =
                            e.target.checked)}
                >
                    {$_("text.mbFlagged")} ({counts.flagged})
                </sl-checkbox>

                <sl-checkbox
                    checked={$Settings.MusicBrainzFilters.hideMissing}
                    onsl-change={(e) =>
                        ($Settings.MusicBrainzFilters.hideMissing =
                            e.target.checked)}
                >
                    {$_("text.mbMissing")} ({counts.missing})
                </sl-checkbox>
            </div>

            <div class="group">
                <h4>{$_("text.mbHideByType")}</h4>

                <sl-checkbox
                    checked={$Settings.MusicBrainzFilters.hideRemixes}
                    onsl-change={(e) =>
                        ($Settings.MusicBrainzFilters.hideRemixes =
                            e.target.checked)}
                >
                    {$_("text.mbRemixes")}

                    <sl-tooltip hoist>
                        <div slot="content">
                            <ul>
                                <li>Title contains "mix)" or "mix]"</li>
                                <li>Disambiguation contains "remix"</li>
                            </ul>
                        </div>

                        <sl-badge pill variant="neutral">?</sl-badge>
                    </sl-tooltip>
                </sl-checkbox>

                <sl-checkbox
                    checked={$Settings.MusicBrainzFilters.hideInstrumentals}
                    onsl-change={(e) =>
                        ($Settings.MusicBrainzFilters.hideInstrumentals =
                            e.target.checked)}
                >
                    {$_("text.mbInstrumentals")}

                    <sl-tooltip hoist>
                        <div slot="content">
                            <ul>
                                <li>
                                    Title contains "instrumental" or "capella"
                                </li>
                                <li>
                                    Disambiguation contains "instrumental" or
                                    "capella"
                                </li>
                            </ul>
                        </div>

                        <sl-badge pill variant="neutral">?</sl-badge>
                    </sl-tooltip>
                </sl-checkbox>

                <sl-checkbox
                    checked={$Settings.MusicBrainzFilters.hideRadioEdits}
                    onsl-change={(e) =>
                        ($Settings.MusicBrainzFilters.hideRadioEdits =
                            e.target.checked)}
                >
                    {$_("text.mbRadioEdits")}

                    <sl-tooltip hoist>
                        <div slot="content">
                            <ul>
                                <li>Title contains "(radio edit)"</li>
                                <li>Disambiguation contains "(radio edit)"</li>
                            </ul>
                        </div>

                        <sl-badge pill variant="neutral">?</sl-badge>
                    </sl-tooltip>
                </sl-checkbox>

                <sl-checkbox
                    checked={$Settings.MusicBrainzFilters.hideLive}
                    onsl-change={(e) =>
                        ($Settings.MusicBrainzFilters.hideLive =
                            e.target.checked)}
                >
                    {$_("text.mbLive")}

                    <sl-tooltip hoist>
                        <div slot="content">
                            <ul>
                                <li>Title contains "(live)" or "[live]"</li>
                                <li>Disambiguation contains "live"</li>
                            </ul>
                        </div>

                        <sl-badge pill variant="neutral">?</sl-badge>
                    </sl-tooltip>
                </sl-checkbox>

                <sl-checkbox
                    checked={$Settings.MusicBrainzFilters.hideShortSongs}
                    onsl-change={(e) =>
                        ($Settings.MusicBrainzFilters.hideShortSongs =
                            e.target.checked)}
                >
                    {$_("text.mbShort")}

                    <sl-tooltip hoist>
                        <div slot="content">
                            <ul>
                                <li>Time is less than 60 seconds</li>
                            </ul>
                        </div>

                        <sl-badge pill variant="neutral">?</sl-badge>
                    </sl-tooltip>
                </sl-checkbox>

                <sl-checkbox
                    checked={$Settings.MusicBrainzFilters.hideDemos}
                    onsl-change={(e) =>
                        ($Settings.MusicBrainzFilters.hideDemos =
                            e.target.checked)}
                >
                    {$_("text.mbDemos")}

                    <sl-tooltip hoist>
                        <div slot="content">
                            <ul>
                                <li>Title contains "(demo)"</li>
                                <li>Disambiguation contains "demo"</li>
                            </ul>
                        </div>

                        <sl-badge pill variant="neutral">?</sl-badge>
                    </sl-tooltip>
                </sl-checkbox>

                <sl-checkbox
                    checked={$Settings.MusicBrainzFilters.hideInterviews}
                    onsl-change={(e) =>
                        ($Settings.MusicBrainzFilters.hideInterviews =
                            e.target.checked)}
                >
                    {$_("text.mbInterviews")}

                    <sl-tooltip hoist>
                        <div slot="content">
                            <ul>
                                <li>
                                    Title contains "interview" or "commentary"
                                </li>
                                <li>
                                    Disambiguation contains "interview" or
                                    "commentary"
                                </li>
                            </ul>
                        </div>

                        <sl-badge pill variant="neutral">?</sl-badge>
                    </sl-tooltip>
                </sl-checkbox>

                <sl-checkbox
                    checked={$Settings.MusicBrainzFilters.hideZeroTimes}
                    onsl-change={(e) =>
                        ($Settings.MusicBrainzFilters.hideZeroTimes =
                            e.target.checked)}
                >
                    {$_("text.mbZeroLength")}

                    <sl-tooltip hoist>
                        <div slot="content">
                            <ul>
                                <li>Has no "time"</li>
                            </ul>
                        </div>

                        <sl-badge pill variant="neutral">?</sl-badge>
                    </sl-tooltip>
                </sl-checkbox>

                <sl-checkbox
                    checked={$Settings.MusicBrainzFilters.hideVideos}
                    onsl-change={(e) =>
                        ($Settings.MusicBrainzFilters.hideVideos =
                            e.target.checked)}
                >
                    {$_("text.mbVideos")}

                    <sl-tooltip hoist>
                        <div slot="content">
                            <ul>
                                <li>Marked as "video"</li>
                                <li>Disambiguation contains "video"</li>
                                <li>Title contains "(video)"</li>
                            </ul>
                        </div>

                        <sl-badge pill variant="neutral">?</sl-badge>
                    </sl-tooltip>
                </sl-checkbox>
            </div>
        </div>
    </sl-dialog>
</Portal>

<style>
    /* restore dot points */
    sl-tooltip ul {
        list-style: initial;
        margin-inline-start: var(--spacing-sm);
        padding-inline-start: var(--spacing-sm);
    }

    sl-badge::part(base) {
        padding-block: 0;
    }

    .top {
        display: flex;
        gap: var(--spacing-lg);
        align-items: center;
    }

    .submit {
        margin-block-end: var(--spacing-lg);
    }

    .results {
        margin-block-start: var(--spacing-lg);
    }

    .time {
        text-align: end;
    }

    th {
        text-align: start;
    }

    tr {
        border-block-end: 1px solid var(--color-outline-variant);
    }

    td,
    th {
        padding: 0.8em 0.6em;
    }

    .art {
        overflow: hidden;
        border-radius: 3px;
        height: 36px;
        aspect-ratio: 1/1;
        flex-shrink: 0;
    }

    table {
        border-collapse: collapse;
    }

    .mbid {
        font-family: monospace;
        font-size: 0.9em;
        display: flex;
    }

    @media (max-width: 700px) {
        .mbid {
            word-break: break-all;
        }
    }

    .item-container {
        display: flex;
        gap: var(--spacing-md);
        align-items: center;
    }

    sl-badge::part(base) {
        white-space: normal;
        line-height: 1.2;
    }

    .group {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .filters {
        display: flex;
        flex-wrap: wrap;
        gap: var(--spacing-xl) var(--spacing-xxl);
    }
</style>
