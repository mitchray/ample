<script>
    import { _ } from 'svelte-i18n';
    import { fade } from 'svelte/transition';
    import { throttle } from 'throttle-wait';
    import { serverURL } from "../stores/server";
    import { cleanArtURL, formatTotalTime } from "../logic/helper";
    import { getSongsFromArtist } from "../logic/song";
    import MusicBrainz from "../logic/musicbrainz";

    export let data;

    let mb = new MusicBrainz;
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
    let filters = JSON.parse(localStorage.getItem('AmpleMusicBrainzFilters')) || {};

    $: {
        queryURL = `https://musicbrainz.org/ws/2/recording/?artist=${data.mbid}&limit=${limit}&offset=${loadCount * limit}`;

        // save filters
        localStorage.setItem('AmpleMusicBrainzFilters', JSON.stringify(filters));

        if (loaded) {
            filteredRecordings = combinedSources;

            // get counts
            counts.matches = combinedSources.reduce(function (n, single) {
                return n + (single.status === 'exact');
            }, 0);

            counts.duplicates = combinedSources.reduce(function (n, single) {
                return n + (single.status === 'duplicate');
            }, 0);

            counts.issues = combinedSources.reduce(function (n, single) {
                return n + (single.status === 'issue');
            }, 0);

            counts.flagged = combinedSources.reduce(function (n, single) {
                return n + (single.status === 'flag');
            }, 0);

            counts.missing = combinedSources.reduce(function (n, single) {
                return n + (single.status === 'missing');
            }, 0);

            // do filtering
            if (filters.hideMatches) {
                filteredRecordings = filteredRecordings.filter(function(item) {
                    return (item.status !== 'exact');
                })
            }

            if (filters.hideDuplicates) {
                filteredRecordings = filteredRecordings.filter(function(item) {
                    return (item.status !== 'duplicate');
                })
            }

            if (filters.hideIssues) {
                filteredRecordings = filteredRecordings.filter(function(item) {
                    return (item.status !== 'issue');
                })
            }

            if (filters.hideInfos) {
                filteredRecordings = filteredRecordings.filter(function(item) {
                    return (item.status !== 'info');
                })
            }

            if (filters.hideMissing) {
                filteredRecordings = filteredRecordings.filter(function(item) {
                    return (item.status !== 'missing');
                })
            }

            if (filters.hideVideos) {
                filteredRecordings = filteredRecordings.filter(function(item) {
                    return !item.video === true;
                })

                filteredRecordings = filteredRecordings.filter(function(item) {
                    return !item.disambiguation.match(/video/i);
                })

                filteredRecordings = filteredRecordings.filter(function(item) {
                    return !item.title.match(/\(video(\)|\s)/i);
                })
            }

            if (filters.hideRemixes) {
                filteredRecordings = filteredRecordings.filter(function(item) {
                    return !item.disambiguation.match(/remix/i);
                })

                filteredRecordings = filteredRecordings.filter(function(item) {
                    return !item.title.match(/(re)?mix(,|\)|\]|\s)/i);
                })
            }

            if (filters.hideLive) {
                filteredRecordings = filteredRecordings.filter(function(item) {
                    return !item.disambiguation.match(/live/i);
                })

                filteredRecordings = filteredRecordings.filter(function(item) {
                    return !item.title.match(/(\[|\()live(,|\]|\)|\s)/i);
                })
            }

            if (filters.hideInstrumentals) {
                filteredRecordings = filteredRecordings.filter(function(item) {
                    return !item.disambiguation.match(/(instrumentals?|a\s?capellas?)/i);
                })

                filteredRecordings = filteredRecordings.filter(function(item) {
                    return !item.title.match(/\((instrumentals?|acapellas?)(,|\)|\s)/i);
                })
            }

            if (filters.hideDemos) {
                filteredRecordings = filteredRecordings.filter(function(item) {
                    return !item.disambiguation.match(/demo/i);
                })

                filteredRecordings = filteredRecordings.filter(function(item) {
                    return !item.title.match(/\(demo(,|\)|\s)/i);
                })
            }

            if (filters.hideInterviews) {
                filteredRecordings = filteredRecordings.filter(function(item) {
                    return !item.title.match(/(interview|commentary)/i);
                })

                filteredRecordings = filteredRecordings.filter(function(item) {
                    return !item.disambiguation.match(/(interview|commentary)/i);
                })
            }

            if (filters.hideZeroTimes) {
                filteredRecordings = filteredRecordings.filter(function(item) {
                    return !item.time === false;
                })
            }

            if (filters.hideShortSongs) {
                filteredRecordings = filteredRecordings.filter(function(item) {
                    return item.time > 60;
                })
            }

            if (filters.hideRadioEdits) {
                filteredRecordings = filteredRecordings.filter(function(item) {
                    return !item.disambiguation.match(/\(radio edit\)/i);
                })

                filteredRecordings = filteredRecordings.filter(function(item) {
                    return !item.title.match(/\(radio edit\)/i);
                })
            }

            // sort alphabetically
            filteredRecordings = filteredRecordings.sort(function(obj1, obj2) { return obj1.title.localeCompare(obj2.title) });
        }
    }

    async function mbQuery() {
        return await fetch(queryURL, {
            method  : 'GET',
            headers : mb.headers
        })
            .then(response => response.json())
            .then(data => {
                counts.reported = data["recording-count"];

                allRecordings = [
                    ...allRecordings,
                    ...data["recordings"]
                ];

                loadCount++;
            })
            .catch(err => {
                console.log("Error Reading data " + err);
                return err;
            });
    }

    const throttledMbQuery = throttle(2.5 * 1000, mbQuery);

    function sanitiseText(text) {
        let similarChars = /(…|\.|,|'|’|"|!|\?)/gi;

        return text.toLowerCase().trim().replace(similarChars, '');
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
            songs[i].disambiguation = songs[i].title + " " + songs[i].album.title;

            let perfectMatch = allRecordings.findIndex(function(item) {
                return item.id === songs[i].mbid;
            })

            let nameMatch = allRecordings.findIndex(function(item) {
                return sanitiseText(item.title) === sanitiseText(songs[i].title);
            })

            // exact match found
            if (perfectMatch !== -1) {
                songs[i].message = $_('text.mbPerfectMatch');
                songs[i].status = "exact";
            } else {
                if (!songs[i].mbid) {
                    // if name match found
                    if (nameMatch !== -1) {
                        songs[i].message = $_('text.mbNameMatch');
                        songs[i].status = "issue";
                    } else {
                        songs[i].message = $_('text.mbNoMatch');
                        songs[i].status = "flag";
                    }
                } else if (mb.regex.test(songs[i].mbid)) {
                    songs[i].message = $_('text.mbValidMBID');
                    songs[i].status = "issue";
                } else {
                    songs[i].message = $_('text.mbInvalidMBID');
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
                message: $_('text.mbNotFound'),
                status: "missing",
            }

            let perfectMatch = songs.findIndex(function(item) {
                return item.mbid === temp.mbid;
            })

            let exactNameMatch = songs.findIndex(function(item) {
                return item.status === "exact" && sanitiseText(item.title) === sanitiseText(allRecordings[i].title);
            })

            let nameMatch = songs.findIndex(function(item) {
                return sanitiseText(item.title) === sanitiseText(allRecordings[i].title);
            })

            // if name match found
            if (exactNameMatch !== -1) {
                temp.message = $_('text.mbMissingMatchMBID');
                temp.status = "duplicate";
            } else if (nameMatch !== -1) {
                temp.message = $_('text.mbMissingMatchName');
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

<div class="container">
    <div class="sidebar">
        <div class="total">
            <div class="badge badge--info">{$_("text.mbShowing", { values: { filteredCount: filteredRecordings.length, totalCount: combinedSources.length } })}</div>
        </div>

        <div class="group">
            <h4 class="panel-title">{$_('text.mbHideByStatus')}</h4>

            <label>
                <input type=checkbox bind:checked={filters.hideMatches} />
                {$_('text.mbExactMatches')} ({counts.matches})
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideDuplicates} />
                {$_('text.mbDuplicates')} ({counts.duplicates})
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideIssues} />
                {$_('text.mbIssues')} ({counts.issues})
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideFlagged} />
                {$_('text.mbFlagged')} ({counts.flagged})
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideMissing} />
                {$_('text.mbMissing')} ({counts.missing})
            </label>
        </div>

        <div class="group">
            <h4 class="panel-title">{$_('text.mbHideByType')}</h4>

            <label>
                <input type=checkbox bind:checked={filters.hideRemixes} />
                {$_('text.mbRemixes')}
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideInstrumentals} />
                {$_('text.mbInstrumentals')}
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideRadioEdits} />
                {$_('text.mbRadioEdits')}
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideLive} />
                {$_('text.mbLive')}
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideShortSongs} />
                {$_('text.mbShort')}
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideDemos} />
                {$_('text.mbDemos')}
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideInterviews} />
                {$_('text.mbInterviews')}
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideZeroTimes} />
                {$_('text.mbZeroLength')}
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideVideos} />
                {$_('text.mbVideos')}
            </label>
        </div>
    </div>

    <div class="results">
        {#if fetching && additionalQueries > 0}
            <div class="progress-bar">
                <span class="progress-value" style={`width: ${(loadCount / (additionalQueries + 1)) * 100}%;`}></span>
            </div>
        {/if}

        {#if hasMusicbrainz}
            {#if loadCount < 1}
                <button on:click={handleGo} class="submit button button--primary">{$_('text.beginComparison')}</button>
            {/if}
        {:else}
            <p>{$_('text.mbArtistMissingMBID')}</p>
        {/if}

        {#if loaded & loadCount > 0}
            {#if filteredRecordings.length > 0}
                <table in:fade>
                    <thead>
                    <tr>
                        <th>{$_('text.title')}</th>
                        <th>{$_('text.length')}</th>
                        <th>{$_('text.mbid')}</th>
                        <th>{$_('text.result')}</th>
                    </tr>
                    </thead>
                    <tbody>
                    {#each filteredRecordings as item, i}
                        <tr class:is-remote={item.isRemote}>
                            <td class="title">
                                {#if !item.isRemote}
                                    <a href="#/song/{item.id}">
                                        <img class="image"
                                            src="{cleanArtURL(item.art)}&thumb=1"
                                            alt=""
                                            height="30"
                                            width="30"
                                            on:error={e => { e.onerror=null; e.target.src=$serverURL + '/image.php?object_id=0&object_type=artist&thumb=22' }}
                                        />
                                        {item.title}
                                    </a>
                                {:else}
                                    {item.title}
                                {/if}
                            </td>
                            <td class="time">
                                {formatTotalTime(item.time)}
                            </td>
                            <td class="mbid">
                                {#if item.mbid}
                                    <a target="_blank" href={`https://musicbrainz.org/recording/${item.mbid}`}>
                                        {item.mbid}
                                    </a>
                                {/if}
                            </td>
                            <td>
                                <span
                                    class="badge"
                                    class:badge--success={item.status === 'exact'}
                                    class:badge--warning={item.status === 'issue' || item.status === 'duplicate'}
                                    class:badge--info={item.status === 'flag'}
                                    class:badge--danger={item.status === 'missing'}
                                >
                                    {item.message}
                                </span>
                            </td>
                        </tr>
                    {/each}
                    </tbody>
                </table>
            {:else}
                <p>{$_('text.mbNoRecordings')}</p>
            {/if}
        {/if}
    </div>
</div>

<style>
    .container {
        display: flex;
        gap: var(--spacing-xl);
    }

    .sidebar {
        display: flex;
        inset-block-start: 0;
        align-self: flex-start; /* needed for sticky to activate */
        background-color: var(--color-card-primary);
        padding: var(--spacing-lg);
        border-radius: 6px;
        box-shadow: var(--shadow-md);
        column-gap: var(--spacing-xl);
        row-gap: var(--spacing-lg);
        flex-shrink: 0;
    }

    h4 {
        margin-block-end: var(--spacing-md);
    }

    .submit {
        margin-block-end: var(--spacing-lg);
    }

    .total {
        align-self: flex-start;
        width: 100%;
    }

    label {
        margin-block-end: var(--spacing-sm);
    }

    .time {
        text-align: end;
    }

    .progress-bar {
        height: 10px;
        width: 100%;
        background-color: var(--color-waveform-wave);
        position: relative;
        min-width: 500px;
    }

    .progress-value {
        display: inline-block;
        height: 100%;
        background-color: var(--color-waveform-progress);
        position: absolute;
        inset-inline-start: 0;
        inset-block-start: 0;
        inset-block-end: 0;
    }

    .results :global(th) {
        text-align: start;
    }

    tr {
        border-block-end: 1px solid var(--color-border);
    }

    .image {
        margin: -5px 0;
    }

    td,
    th {
        padding: 0.8em 0.6em;
    }

    table {
        border-collapse: collapse;
    }

    .mbid {
        font-family: monospace;
        font-size: 0.9em;
    }

    .title :global(a) {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
    }

    .group {
        display: flex;
        flex-direction: column;
    }

    @media (max-width: 700px) {
        thead {
            display: none;
        }

        tr {
            display: flex;
            flex-direction: column;
            padding: var(--spacing-lg) 0;
        }

        td {
            padding: var(--spacing-sm);
        }

        .time {
            text-align: start;
        }

        .mbid {
            word-break: break-all;
        }
    }

    @media (max-width: 900px) {
        .container {
            flex-direction: column;
        }

        .sidebar {
            width: 100%;
            flex-direction: row;
            flex-wrap: wrap;
        }
    }

    @media (min-width: 900px) {
        .sidebar {
            position: sticky;
            max-width: fit-content;
            flex-direction: column;
        }
    }
</style>