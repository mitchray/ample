<script>
    import { _ } from "svelte-i18n";
    import { fade } from "svelte/transition";
    import { throttle } from "lodash-es";
    import { formatTotalTime } from "~/logic/formatters.js";
    import { getSongsFromArtist } from "~/logic/song";
    import MusicBrainz from "~/logic/musicbrainz";
    import Art from "~/components/art.svelte";
    import Portal from "~/components/portal.svelte";
    import { Saved } from "~/stores/settings.js";

    export let data;

    let mb = new MusicBrainz();
    let hasMusicbrainz = mb.hasMBID(data);

    let combinedSources = [];
    let songs = [];
    let allRecordings = [];
    let loadCount = 0;
    let limit = 100;
    let fetching = false;
    let loaded = false;
    let queryURL;
    let additionalQueries;
    let filteredRecordings = [];
    let counts = {
        reported: 0,
        matches: 0,
        duplicates: 0,
        issues: 0,
        flagged: 0,
        missing: 0,
    };
    let filters = $Saved.getItem("MusicBrainzFilters") || {};
    let dialog;

    $: {
        queryURL = `https://musicbrainz.org/ws/2/recording/?artist=${
            data.mbid
        }&limit=${limit}&offset=${loadCount * limit}`;

        // save filters
        $Saved.setItem("MusicBrainzFilters", filters);

        if (loaded) {
            filteredRecordings = combinedSources;

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

            // do filtering
            if (filters.hideMatches) {
                filteredRecordings = filteredRecordings.filter(function (item) {
                    return item.status !== "exact";
                });
            }

            if (filters.hideDuplicates) {
                filteredRecordings = filteredRecordings.filter(function (item) {
                    return item.status !== "duplicate";
                });
            }

            if (filters.hideIssues) {
                filteredRecordings = filteredRecordings.filter(function (item) {
                    return item.status !== "issue";
                });
            }

            if (filters.hideInfos) {
                filteredRecordings = filteredRecordings.filter(function (item) {
                    return item.status !== "info";
                });
            }

            if (filters.hideMissing) {
                filteredRecordings = filteredRecordings.filter(function (item) {
                    return item.status !== "missing";
                });
            }

            // custom filters

            if (filters.hideVideos) {
                filteredRecordings = filteredRecordings.filter(function (item) {
                    return !item.video === true;
                });

                filteredRecordings = filteredRecordings.filter(function (item) {
                    return !item.disambiguation.match(/video/i);
                });

                filteredRecordings = filteredRecordings.filter(function (item) {
                    return !item.title.match(/\(video(\)|\s)/i);
                });
            }

            if (filters.hideRemixes) {
                filteredRecordings = filteredRecordings.filter(function (item) {
                    return !item.disambiguation.match(/remix/i);
                });

                filteredRecordings = filteredRecordings.filter(function (item) {
                    return !item.title.match(/(re)?mix(,|\)|\]|\s)/i);
                });
            }

            if (filters.hideLive) {
                filteredRecordings = filteredRecordings.filter(function (item) {
                    return !item.disambiguation.match(/live/i);
                });

                filteredRecordings = filteredRecordings.filter(function (item) {
                    return !item.title.match(/(\[|\()live(,|\]|\)|\s)/i);
                });
            }

            if (filters.hideInstrumentals) {
                filteredRecordings = filteredRecordings.filter(function (item) {
                    return !item.disambiguation.match(
                        /(instrumentals?|a\s?capellas?)/i,
                    );
                });

                filteredRecordings = filteredRecordings.filter(function (item) {
                    return !item.title.match(
                        /\((instrumentals?|acapellas?)(,|\)|\s)/i,
                    );
                });
            }

            if (filters.hideDemos) {
                filteredRecordings = filteredRecordings.filter(function (item) {
                    return !item.disambiguation.match(/demo/i);
                });

                filteredRecordings = filteredRecordings.filter(function (item) {
                    return !item.title.match(/\(demo(,|\)|\s)/i);
                });
            }

            if (filters.hideInterviews) {
                filteredRecordings = filteredRecordings.filter(function (item) {
                    return !item.title.match(/(interview|commentary)/i);
                });

                filteredRecordings = filteredRecordings.filter(function (item) {
                    return !item.disambiguation.match(
                        /(interview|commentary)/i,
                    );
                });
            }

            if (filters.hideZeroTimes) {
                filteredRecordings = filteredRecordings.filter(function (item) {
                    return !item.time === false;
                });
            }

            if (filters.hideShortSongs) {
                filteredRecordings = filteredRecordings.filter(function (item) {
                    return item.time > 60;
                });
            }

            if (filters.hideRadioEdits) {
                filteredRecordings = filteredRecordings.filter(function (item) {
                    return !item.disambiguation.match(/\(radio edit\)/i);
                });

                filteredRecordings = filteredRecordings.filter(function (item) {
                    return !item.title.match(/\(radio edit\)/i);
                });
            }

            // sort alphabetically
            filteredRecordings = filteredRecordings.sort(function (obj1, obj2) {
                return obj1.title.localeCompare(obj2.title);
            });
        }
    }

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

    const throttledMbQuery = throttle(mbQuery, 2.5 * 1000);

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

        songs = songs;

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

        combinedSources = combinedSources;

        fetching = false;
        loaded = true;
    }
</script>

<div class="top">
    <sl-button
        on:click={() => {
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
            <sl-button variant="primary" on:click={handleGo} class="submit">
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
                    checked={filters.hideMatches}
                    on:sl-change={(e) =>
                        (filters.hideMatches = e.target.checked)}
                >
                    {$_("text.mbExactMatches")} ({counts.matches})
                </sl-checkbox>

                <sl-checkbox
                    checked={filters.hideDuplicates}
                    on:sl-change={(e) =>
                        (filters.hideDuplicates = e.target.checked)}
                >
                    {$_("text.mbDuplicates")} ({counts.duplicates})
                </sl-checkbox>

                <sl-checkbox
                    checked={filters.hideIssues}
                    on:sl-change={(e) =>
                        (filters.hideIssues = e.target.checked)}
                >
                    {$_("text.mbIssues")} ({counts.issues})
                </sl-checkbox>

                <sl-checkbox
                    checked={filters.hideFlagged}
                    on:sl-change={(e) =>
                        (filters.hideFlagged = e.target.checked)}
                >
                    {$_("text.mbFlagged")} ({counts.flagged})
                </sl-checkbox>

                <sl-checkbox
                    checked={filters.hideMissing}
                    on:sl-change={(e) =>
                        (filters.hideMissing = e.target.checked)}
                >
                    {$_("text.mbMissing")} ({counts.missing})
                </sl-checkbox>
            </div>

            <div class="group">
                <h4>{$_("text.mbHideByType")}</h4>

                <sl-checkbox
                    checked={filters.hideRemixes}
                    on:sl-change={(e) =>
                        (filters.hideRemixes = e.target.checked)}
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
                    checked={filters.hideInstrumentals}
                    on:sl-change={(e) =>
                        (filters.hideInstrumentals = e.target.checked)}
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
                    checked={filters.hideRadioEdits}
                    on:sl-change={(e) =>
                        (filters.hideRadioEdits = e.target.checked)}
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
                    checked={filters.hideLive}
                    on:sl-change={(e) => (filters.hideLive = e.target.checked)}
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
                    checked={filters.hideShortSongs}
                    on:sl-change={(e) =>
                        (filters.hideShortSongs = e.target.checked)}
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
                    checked={filters.hideDemos}
                    on:sl-change={(e) => (filters.hideDemos = e.target.checked)}
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
                    checked={filters.hideInterviews}
                    on:sl-change={(e) =>
                        (filters.hideInterviews = e.target.checked)}
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
                    checked={filters.hideZeroTimes}
                    on:sl-change={(e) =>
                        (filters.hideZeroTimes = e.target.checked)}
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
                    checked={filters.hideVideos}
                    on:sl-change={(e) =>
                        (filters.hideVideos = e.target.checked)}
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
