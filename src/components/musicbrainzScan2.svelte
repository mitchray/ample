<script>
    import { fade } from 'svelte/transition';
    import { Link } from "svelte-routing";
    import { throttle } from 'throttle-wait';
    import { ampleVersion } from "../stores/player";
    import { serverURL } from "../stores/server";
    import { formatTotalTime } from "../logic/helper";
    import { getSongsFromArtist } from "../logic/song";

    export let data;

    const musicbrainzRegex = new RegExp('[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}');

    let hasMusicbrainz = musicbrainzRegex.test(data.mbid) && data.name !== "Various Artists";

    let headers = new Headers({
        "Accept"       : "application/json",
        "Content-Type" : "application/json",
        "User-Agent"   : `Ample - Ampache client/${$ampleVersion} ( github.com/mitchray/ample )`
    });

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
    let filters = JSON.parse(localStorage.getItem('MusicBrainzFilters')) || {};

    $: {
        queryURL = `https://musicbrainz.org/ws/2/recording/?artist=${data.mbid}&limit=${limit}&offset=${loadCount * limit}`;

        // save filters
        localStorage.setItem('MusicBrainzFilters', JSON.stringify(filters));

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
            headers : headers
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
                songs[i].message = "Exact match with MusicBrainz recording";
                songs[i].status = "exact";
            } else {
                if (!songs[i].mbid) {
                    // if name match found
                    if (nameMatch !== -1) {
                        songs[i].message = "No MBID, but title matches a MusicBrainz recording";
                        songs[i].status = "issue";
                    } else {
                        songs[i].message = "No MBID, and no MusicBrainz recordings match";
                        songs[i].status = "flag";
                    }
                } else if (musicbrainzRegex.test(songs[i].mbid)) {
                    songs[i].message = "Valid MBID, but missing in this artist collection";
                    songs[i].status = "issue";
                } else {
                    songs[i].message = "Invalid MBID";
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
                message: "MusicBrainz recording not found in library",
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
                temp.message = "Missing recording, but an item with the same name was matched with a different MBID";
                temp.status = "duplicate";
            } else if (nameMatch !== -1) {
                temp.message = "Missing recording, but title matches an item in the library";
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
            <div class="badge badge--info">Showing {filteredRecordings.length} of {combinedSources.length}</div>
        </div>

        <div class="group">
            <h4 class="panel-title">Hide by status</h4>

            <label>
                <input type=checkbox bind:checked={filters.hideMatches} />
                Exact matches ({counts.matches})
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideDuplicates} />
                Duplicates ({counts.duplicates})
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideIssues} />
                Issues ({counts.issues})
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideFlagged} />
                Flagged ({counts.flagged})
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideMissing} />
                Missing ({counts.missing})
            </label>
        </div>

        <div class="group">
            <h4 class="panel-title">Hide by type</h4>

            <label>
                <input type=checkbox bind:checked={filters.hideRemixes} />
                Remixes
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideInstrumentals} />
                Instrumentals/Acapellas
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideRadioEdits} />
                Radio edits
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideLive} />
                Live recordings
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideShortSongs} />
                Under 60 seconds
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideDemos} />
                Demos
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideInterviews} />
                Interviews/commentary
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideZeroTimes} />
                Zero length tracks
            </label>

            <label>
                <input type=checkbox bind:checked={filters.hideVideos} />
                Videos
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
                <button on:click={handleGo} class="submit button button--primary">Begin comparison</button>
            {/if}
        {:else}
            <p>Artist is missing a MusicBrainz Artist ID tag</p>
        {/if}

        {#if loaded & loadCount > 0}
            {#if filteredRecordings.length > 0}
                <table in:fade>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Length</th>
                        <th>MBID</th>
                        <th>Result</th>
                    </tr>
                    </thead>
                    <tbody>
                    {#each filteredRecordings as item, i}
                        <tr class:is-remote={item.isRemote}>
                            <td class="title">
                                {#if !item.isRemote}
                                    <Link to="song/{item.id}">
                                        <img class="image"
                                            src="{item.art}&thumb=1"
                                            alt=""
                                            height="30"
                                            width="30"
                                            on:error={e => { e.onerror=null; e.target.src=$serverURL + '/image.php?object_id=0&object_type=artist&thumb=22' }}
                                        />
                                        {item.title}
                                    </Link>
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
                <p>No recordings to show</p>
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
        top: 0;
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
        margin-bottom: var(--spacing-md);
    }

    .submit {
        margin-bottom: var(--spacing-lg);
    }

    .total {
        align-self: flex-start;
        width: 100%;
    }

    label {
        margin-bottom: var(--spacing-sm);
    }

    .time {
        text-align: right;
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
        left: 0;
        top: 0;
        bottom: 0;
    }

    .results :global(th) {
        text-align: left;
    }

    tr {
        border-bottom: 1px solid var(--color-border);
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
            text-align: left;
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