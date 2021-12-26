<script>
    import { fade } from 'svelte/transition';
    import { throttle } from 'throttle-wait';

    import { ampleVersion } from "../stores/player";

    import { getSongsFromArtist } from "../logic/song";
    import { formatTotalTime } from "../logic/helper";

    export let data;

    const musicbrainzRegex = new RegExp('[a-z0-9]{8}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{12}');

    let hasMusicbrainz = musicbrainzRegex.test(data.mbid) && data.name !== "Various Artists";

    let headers = new Headers({
        "Accept"       : "application/json",
        "Content-Type" : "application/json",
        "User-Agent"   : `Ample - Ampache client/${$ampleVersion} ( github.com/mitchray/ample )`
    });

    let songs = [];
    let allRecordings = [];
    let loadCount = 0;
    let limit = 100;
    let reportedRecordings = 0;
    let loading = false;
    let filteredRecordings = [];
    let queryURL;
    let additionalQueries;

    // filters
    let includeVideos = false;
    let includeLive = false;
    let includeInterviews = false;
    let includeZeroTimes = false;
    let includeShortSongs = false;
    let includeDemos = false;
    let includeRemixes = false;
    let includeInstrumentals = false;
    let includeRadioEdits = false;

    let includeMatches = true;
    let includeDuplicates = true;
    let includeMissing = true;

    //counts
    let countMatches;
    let countDuplicates;
    let countMissing;

    let customRegex = '';

    $: {
        queryURL = `https://musicbrainz.org/ws/2/recording/?artist=${data.mbid}&limit=${limit}&offset=${loadCount * limit}`;
        filteredRecordings = allRecordings;

        // get counts
        countMatches = allRecordings.reduce(function (n, single) {
            return n + (single.result === 'exact');
        }, 0);

        countDuplicates = allRecordings.reduce(function (n, single) {
            return n + (single.result === 'name');
        }, 0);

        countMissing = allRecordings.reduce(function (n, single) {
            return n + (single.result === undefined);
        }, 0);

        // do filtering
        if (!includeMatches) {
            filteredRecordings = filteredRecordings.filter(function(item) {
                return (item.result !== 'exact');
            })
        }

        if (!includeDuplicates) {
            filteredRecordings = filteredRecordings.filter(function(item) {
                return (item.result !== 'name');
            })
        }

        if (!includeMissing) {
            filteredRecordings = filteredRecordings.filter(function(item) {
                return (item.result !== undefined);
            })
        }

        if (!includeVideos) {
            filteredRecordings = filteredRecordings.filter(function(item) {
                return item.video === false;
            })

            filteredRecordings = filteredRecordings.filter(function(item) {
                return !item.disambiguation.match(/video/i);
            })

            filteredRecordings = filteredRecordings.filter(function(item) {
                return !item.title.match(/\(video(\)|\s)/i);
            })
        }

        if (!includeRemixes) {
            filteredRecordings = filteredRecordings.filter(function(item) {
                return !item.disambiguation.match(/remix/i);
            })

            filteredRecordings = filteredRecordings.filter(function(item) {
                return !item.title.match(/(re)?mix(,|\)|\]|\s)/i);
            })
        }

        if (!includeLive) {
            filteredRecordings = filteredRecordings.filter(function(item) {
                return !item.disambiguation.match(/live/i);
            })

            filteredRecordings = filteredRecordings.filter(function(item) {
                return !item.title.match(/(\[|\()live(,|\]|\)|\s)/i);
            })
        }

        if (!includeInstrumentals) {
            filteredRecordings = filteredRecordings.filter(function(item) {
                return !item.disambiguation.match(/(instrumentals?|a\s?capellas?)/i);
            })

            filteredRecordings = filteredRecordings.filter(function(item) {
                return !item.title.match(/\((instrumentals?|acapellas?)(,|\)|\s)/i);
            })
        }

        if (!includeDemos) {
            filteredRecordings = filteredRecordings.filter(function(item) {
                return !item.disambiguation.match(/demo/i);
            })

            filteredRecordings = filteredRecordings.filter(function(item) {
                return !item.title.match(/\(demo(,|\)|\s)/i);
            })
        }

        if (!includeInterviews) {
            filteredRecordings = filteredRecordings.filter(function(item) {
                return !item.title.match(/(interview|commentary)/i);
            })
        }

        if (!includeZeroTimes) {
            filteredRecordings = filteredRecordings.filter(function(item) {
                return !item["length"] === false;
            })
        }

        if (!includeShortSongs) {
            filteredRecordings = filteredRecordings.filter(function(item) {
                return item["length"] > 60000;
            })
        }

        if (!includeRadioEdits) {
            filteredRecordings = filteredRecordings.filter(function(item) {
                return !item.disambiguation.match(/\(radio edit\)/i);
            })

            filteredRecordings = filteredRecordings.filter(function(item) {
                return !item.title.match(/\(radio edit\)/i);
            })
        }

        if (customRegex) {
            filteredRecordings = filteredRecordings.filter(function(item) {
                return !item.title.match(new RegExp(escapeRegExp(customRegex), 'gi'));
            })
        }

        // sort alphabetically
        filteredRecordings = filteredRecordings.sort(function(obj1, obj2) { return obj1.title.localeCompare(obj2.title) });
    }

    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
    }

    const mbQuery = async () => {
        return await fetch(queryURL, {
            method  : 'GET',
            headers : headers
        })
            .then(response => response.json())
            .then(data => {
                reportedRecordings = data["recording-count"];

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

    const throttledMbQuery = throttle(2 * 1000, mbQuery);

    async function handleGo() {
        if (!hasMusicbrainz) {
            return false;
        }

        loading = true;

        // perform first query
        await throttledMbQuery(queryURL);

        additionalQueries = Math.ceil((reportedRecordings - limit) / limit);

        // perform additional queries until done
        for (let i = 0; i < additionalQueries; i++) {
            await throttledMbQuery(queryURL);
        }

        // grab our artists songs from library
        songs = await getSongsFromArtist(data.id);

        // compare recording mbid with our songs
        for (let i = 0; i < songs.length; i++) {
            // find perfect MBID matches
            let perfectMatch = allRecordings.findIndex(function(item) {
                return item.id === songs[i].mbid;
            })

            if (perfectMatch !== -1) {
                allRecordings[perfectMatch].result = 'exact';

                let similarChars = /(…|\.|,|'|’|"|!|\?)/gi;

                // mark songs that aren't exact matches but have same name
                let nameMatch = allRecordings.reduce(function(a, e, j) {
                    if (e.title.toLowerCase().trim().replace(similarChars, '') === allRecordings[perfectMatch].title.toLowerCase().trim().replace(similarChars, '')) {
                        a.push(j);
                    }

                    return a;
                }, []);

                for (let j = 0; j < nameMatch.length; j++) {
                    if (allRecordings[nameMatch[j]].result !== 'exact') {
                        allRecordings[nameMatch[j]].result = 'name';
                    }
                }
            }
        }

        loading = false;
    }
</script>

<div class="container">
    <div class="sidebar">
        <div class="total badge badge--info">Showing {filteredRecordings.length} of {allRecordings.length}</div>

        <h4>Show</h4>

        <label>
            <input type=checkbox bind:checked={includeMatches} />
            Matches ({countMatches})
        </label>

        <label>
            <input type=checkbox bind:checked={includeDuplicates} />
            Duplicates ({countDuplicates})
        </label>

        <label>
            <input type=checkbox bind:checked={includeMissing} />
            Missing ({countMissing})
        </label>

        <label class="filter-separator">
            <input type=checkbox bind:checked={includeRemixes} />
            Remixes
        </label>

        <label>
            <input type=checkbox bind:checked={includeInstrumentals} />
            Instrumentals/Acapellas
        </label>

        <label>
            <input type=checkbox bind:checked={includeRadioEdits} />
            Radio edits
        </label>

        <label>
            <input type=checkbox bind:checked={includeLive} />
            Live recordings
        </label>

        <label>
            <input type=checkbox bind:checked={includeShortSongs} />
            Length under 60 seconds
        </label>

        <label>
            <input type=checkbox bind:checked={includeDemos} />
            Demos
        </label>

        <label>
            <input type=checkbox bind:checked={includeInterviews} />
            Interviews/commentary
        </label>

        <label>
            <input type=checkbox bind:checked={includeZeroTimes} />
            Zero length tracks
        </label>

        <label>
            <input type=checkbox bind:checked={includeVideos} />
            Videos
        </label>

        <h4>Hide</h4>

        <label>
            Regex pattern:
            <input type=text bind:value={customRegex} />
        </label>
    </div>

    <div class="results">
        {#if loading && additionalQueries > 0}
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

        {#if !loading & loadCount > 0}
            {#if filteredRecordings.length > 0}
                <table in:fade>
                    <thead>
                    <tr>
                        <th>Title</th>
                        <th>Length</th>
                        <th>Result</th>
                    </tr>
                    </thead>
                    <tbody>
                    {#each filteredRecordings as mbRecording, i}
                        <tr>
                            <td>
                                <a target="_blank" href={`https://musicbrainz.org/recording/${mbRecording.id}`}>
                                    {#if mbRecording.video}[VIDEO]{/if} {mbRecording.title}
                                </a>

                                {#if mbRecording.disambiguation}
                                    <em>- {mbRecording.disambiguation}</em>
                                {/if}
                            </td>
                            <td>{formatTotalTime(mbRecording["length"] / 1000)}</td>
                            <td>
                                <span
                                    class="badge"
                                    class:badge--success={mbRecording.result === 'exact'}
                                    class:badge--warning={mbRecording.result === 'name'}
                                    class:badge--danger={!mbRecording.result}
                                >
                                    {#if mbRecording.result === 'exact'}Exact MBID match{/if}
                                    {#if mbRecording.result === 'name'}Duplicate name of exact match{/if}
                                    {#if !mbRecording.result}Missing{/if}
                                </span>
                            </td>
                        </tr>
                    {/each}
                    </tbody>
                </table>
            {:else}
                <p>No recordings found or scan has not begun</p>
            {/if}
        {/if}
    </div>
</div>

<style>
    .container {
        display: flex;
    }

    .sidebar {
        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        margin-right: var(--spacing-xxl);
        position: sticky;
        top: 0;
        align-self: flex-start; /* needed for sticky to activate */
    }

    .submit {
        margin-bottom: var(--spacing-lg);
    }

    h4 {
        margin-top: var(--spacing-md);
        margin-bottom: var(--spacing-sm);
    }

    .total {
        align-self: flex-start;
    }

    label {
        margin-bottom: var(--spacing-sm);
    }

    .filter-separator,
    .total {
        margin-top: var(--spacing-md);
    }

    .progress-bar {
        height: 10px;
        width: 100%;
        background-color: var(--color-lines);
        position: relative;
        min-width: 500px;
    }

    .progress-value {
        display: inline-block;
        height: 100%;
        background-color: var(--color-text-subheading);
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
    }

    .results :global(th) {
        text-align: left;
    }

    .results :global(tr) {
        border-bottom: 1px solid var(--color-lines);
    }

    .results :global(td), .results :global(th) {
        padding: 0.6em 0.6em;
    }

    .results :global(table) {
        border-collapse: collapse;
    }
</style>