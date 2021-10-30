<script>
    import { onMount } from 'svelte';

    import { getSongsFromAdvancedSearch } from '../logic/song';
    import { getAlbumsFromAdvancedSearch } from '../logic/album';
    import { getArtistsFromAdvancedSearch } from '../logic/artist';
    import { getPlaylistsFromAdvancedSearch, getPlaylists, getSmartlists } from '../logic/playlist';
    import { getUsers } from '../logic/user';
    import { getCatalogs } from '../logic/catalog';

    import SVGClose from "../../public/images/close.svg";

    export let loading = false;
    export let loadedTime;
    export let results = [];
    export let defaultSettings = null;
    export let selectedObjectType = null;

    let loaded = false;
    let fromParams = false;
    let rows = [];
    let fieldsToShow;
    let groupedFieldsToShow;
    let rowCounter = 0;
    let allUsers = [];
    let allCatalogs = [];
    let allPlaylists = [];
    let allSmartlists = [];

    // set defaults
    let settings = {
        type: "song",
        limit: "0",
        random: false,
        operator: "and"
    };

    // keep selectedObjectType in sync
    $: selectedObjectType = settings.type;

    // reset everything if object type changes
    $: {
        if (settings.type) {
            populateFields();
        }
    }

    // auto-add a row if all are removed
    $: {
        if (loaded && rows.length < 1) {
            addNewRow();
        }
    }

    // get highest existing id, or start at 1
    $: rowCounter = rows.length ? Math.max(...rows.map(t => t.id)) + 1 : 1;

    function parseParams() {
        if (defaultSettings) {
            // override default settings with any params
            settings = {...settings,...defaultSettings};

            let joined = Object.keys(settings).join(",");
            let foundRules = joined.match(/rule_\d+(?=,)/gi);

            if (foundRules) {
                fromParams = true;

                foundRules.forEach((element) => {
                    // test to see if all items are present
                    if (settings[`${element}_operator`] !== undefined && settings[`${element}_input`] !== undefined) {
                        let newField = settings[`${element}`];

                        let newRow = {
                            id: parseInt(element.match(/\d+/)),
                            field: newField,
                            operator: settings[`${element}_operator`],
                            input: settings[`${element}_input`]
                        };

                        newRow.operatorType = getOperatorType(newField);
                        newRow.inputType = getInputType(newField);

                        rows = [...rows, newRow];
                    }
                });
            }
        }
    }

    function getOperatorType(fieldName) {
        return fields.find((field) => field.id === fieldName).operatorType;
    }

    function getInputType(fieldName) {
        return fields.find((field) => field.id === fieldName).inputType;
    }

    function addNewRow() {
        let newRow = {
            id: rowCounter,
            field: "title",
            operator: "0",
            input: ""
        };

        if (settings.type === "song") {
            newRow.field = "anywhere";
        }

        newRow.operatorType = getOperatorType(newRow.field);
        newRow.inputType = getInputType(newRow.field);

        rows = [...rows, newRow];
    }

    function populateFields() {
        let groups = new Map();

        fieldsToShow = fields.filter((field) => field.object_types.find((type) => type.id === settings.type));

        // setup categories based on initial order
        for (let i = 0; i < fieldsToShow.length; i++) {
            let item = fieldsToShow[i].object_types.find((type) => type.id === settings.type);

            // apply any overrides while we're at it
            fieldsToShow[i].label = (item.label) ? item.label : fieldsToShow[i].label;
            fieldsToShow[i].category = (item.category) ? item.category : fieldsToShow[i].category;

            if (!groups.get(fieldsToShow[i].category)) {
                groups.set(fieldsToShow[i].category, []);
            }

            groups.get(fieldsToShow[i].category).push(fieldsToShow[i]);
        }

        // alphabetize each group
        groups.forEach((group) => {
            group.sort(function(obj1, obj2) { return obj1.label.localeCompare(obj2.label) });
        })

        groupedFieldsToShow = groups;
    }

    function removeRow(row) {
        rows = rows.filter(item => item.id !== row.id);
    }

    function clearAll() {
        rows = [];
    }

    function setField(row, event = null) {
        // reset operator if type changes
        row.operator = "0";

        // workaround to get first item from first group in map
        let firstID = Array.from(groupedFieldsToShow.entries())[0][1][0].id;

        row.field = (event) ? event.target.value : firstID;
        row.operatorType = getOperatorType(row.field);
        row.inputType = getInputType(row.field);

        return row;
    }

    async function search() {
        results = [];
        loading = true;
        loadedTime = null;

        switch (settings.type) {
            case "song":
                results = await getSongsFromAdvancedSearch({rows: rows, limit: settings.limit, random: settings.random, match: settings.operator});
                break;
            case "album":
                results = await getAlbumsFromAdvancedSearch({rows: rows, limit: settings.limit, random: settings.random, match: settings.operator});
                break;
            case "artist":
                results = await getArtistsFromAdvancedSearch({rows: rows, limit: settings.limit, random: settings.random, match: settings.operator});
                break;
            case "playlist":
                results = await getPlaylistsFromAdvancedSearch({rows: rows, limit: settings.limit, random: settings.random, match: settings.operator});
                break;
            default:
                break;
        }

        loadedTime = new Date();
        loading = false;
    }

    onMount(async () => {
        parseParams();

        allUsers = await getUsers();
        allCatalogs = await getCatalogs();
        allPlaylists = await getPlaylists();
        allSmartlists = await getSmartlists(true);

        loaded = true;
    });

    let fields = [
        {
            id: "anywhere",
            label: "Any searchable text",
            category: "",
            object_types: [
                { id: "song"}
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "title",
            label: "Title",
            category: "Metadata",
            object_types: [
                { id: "song", category: "Song Metadata" },
                { id: "album", category: "Album Metadata" },
                { id: "artist", category: "Artist Metadata", label: "Name" },
                { id: "playlist", category: "Playlist Metadata", label: "Name" }
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "artist",
            label: "Artist",
            category: "Metadata",
            object_types: [
                { id: "song", category: "Song Metadata", label: "Song Artist" },
                { id: "album", category: "Album Metadata", label: "Album Artist" }
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "year",
            label: "Year",
            category: "Metadata",
            object_types: [
                { id: "song", category: "Song Metadata" },
                { id: "album", category: "Album Metadata" },
                { id: "artist", category: "Artist Metadata" }
            ],
            operatorType: "number",
            inputType: "number"
        },
        {
            id: "tag",
            label: "Genre",
            category: "Metadata",
            object_types: [
                { id: "song", category: "Song Metadata" },
                { id: "album", category: "Album Metadata" },
                { id: "artist", category: "Artist Metadata" }
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "album_tag",
            label: "Album Genre",
            category: "Song Metadata",
            object_types: [
                { id: "song" }
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "comment",
            label: "Comment",
            category: "Song Metadata",
            object_types: [
                { id: "song" }
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "lyrics",
            label: "Lyrics",
            category: "Song Metadata",
            object_types: [
                { id: "song" }
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "file",
            label: "Filename",
            category: "File Data",
            object_types: [
                { id: "song" }
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "bitrate",
            label: "Bitrate",
            category: "File Data",
            object_types: [
                { id: "song" }
            ],
            operatorType: "number",
            inputType: "number"
        },
        {
            id: "label",
            label: "Label",
            category: "Song Metadata",
            object_types: [
                { id: "song" }
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "artist_tag",
            label: "Artist Genre",
            category: "Song Metadata",
            object_types: [
                { id: "song" }
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "album",
            label: "Album",
            category: "Song Metadata",
            object_types: [
                { id: "song" }
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "composer",
            label: "Composer",
            category: "Song Metadata",
            object_types: [
                { id: "song" },
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "album_artist",
            label: "Album Artist",
            category: "Song Metadata",
            object_types: [
                { id: "song" },
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "original_year",
            label: "Original Year",
            category: "Album Metadata",
            object_types: [
                { id: "album" }
            ],
            operatorType: "number",
            inputType: "number"
        },
        {
            id: "release_type",
            label: "Release Type",
            category: "Album Metadata",
            object_types: [
                { id: "album" }
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "release_status",
            label: "Release Status",
            category: "Album Metadata",
            object_types: [
                { id: "album" }
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "yearformed",
            label: "Year Formed",
            category: "Artist Metadata",
            object_types: [
                { id: "artist" }
            ],
            operatorType: "number",
            inputType: "number"
        },
        {
            id: "placeformed",
            label: "Place Formed",
            category: "Artist Metadata",
            object_types: [
                { id: "artist" }
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "myrating",
            label: "My Rating",
            category: "Rating",
            object_types: [
                { id: "song" },
                { id: "album" },
                { id: "artist" }
            ],
            operatorType: "number",
            inputType: "rating"
        },
        {
            id: "rating",
            label: "Rating (average)",
            category: "Rating",
            object_types: [
                { id: "song" },
                { id: "album" },
                { id: "artist" }
            ],
            operatorType: "number",
            inputType: "rating"
        },
        {
            id: "albumrating",
            label: "My Rating (album)",
            category: "Rating",
            object_types: [
                { id: "song" }
            ],
            operatorType: "number",
            inputType: "rating"
        },
        {
            id: "artistrating",
            label: "My Rating (artist)",
            category: "Rating",
            object_types: [
                { id: "song" },
                { id: "album" }
            ],
            operatorType: "number",
            inputType: "rating"
        },
        {
            id: "favorite",
            label: "Favorites",
            category: "Rating",
            object_types: [
                { id: "song" },
                { id: "album" },
                { id: "artist" }
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "favorite_album",
            label: "Favorites (Album)",
            category: "Rating",
            object_types: [
                { id: "song" }
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "favorite_artist",
            label: "Favorites (Artist)",
            category: "Rating",
            object_types: [
                { id: "song" }
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "played_times",
            label: "# Played",
            category: "Plays",
            object_types: [
                { id: "song" },
                { id: "album" },
                { id: "artist" }
            ],
            operatorType: "number",
            inputType: "number"
        },
        {
            id: "skipped_times",
            label: "# Skipped",
            category: "Plays",
            object_types: [
                { id: "song" }
            ],
            operatorType: "number",
            inputType: "number"
        },
        {
            id: "played_or_skipped_times",
            label: "# Played or Skipped",
            category: "Plays",
            object_types: [
                { id: "song" }
            ],
            operatorType: "number",
            inputType: "number"
        },
        {
            id: "play_skip_ratio",
            label: "Played/Skipped ratio",
            category: "Plays",
            object_types: [
                { id: "song" }
            ],
            operatorType: "number",
            inputType: "number"
        },
        {
            id: "recent_played",
            label: "Recently played",
            category: "Plays",
            object_types: [
                { id: "song" },
                { id: "album" },
                { id: "artist" }
            ],
            operatorType: "limit",
            inputType: "number"
        },
        {
            id: "last_play",
            label: "My Last Play",
            category: "Plays",
            object_types: [
                { id: "song" },
                { id: "album" },
                { id: "artist" }
            ],
            operatorType: "relative_x_days",
            inputType: "number"
        },
        {
            id: "last_skip",
            label: "My Last Skip",
            category: "Plays",
            object_types: [
                { id: "song" },
                { id: "album" },
                { id: "artist" }
            ],
            operatorType: "relative_x_days",
            inputType: "number"
        },
        {
            id: "last_play_or_skip",
            label: "My Last Play or Skip",
            category: "Plays",
            object_types: [
                { id: "song" },
                { id: "album" },
                { id: "artist" }
            ],
            operatorType: "relative_x_days",
            inputType: "number"
        },
        {
            id: "played",
            label: "Played",
            category: "Plays",
            object_types: [
                { id: "song" },
                { id: "album" },
                { id: "artist" }
            ],
            operatorType: "boolean_true",
            inputType: ""
        },
        {
            id: "myplayed",
            label: "Played by me",
            category: "Plays",
            object_types: [
                { id: "song" },
                { id: "album" },
                { id: "artist" }
            ],
            operatorType: "boolean_true",
            inputType: ""
        },
        {
            id: "myplayedalbum",
            label: "Played by Me (Album)",
            category: "Plays",
            object_types: [
                { id: "song" }
            ],
            operatorType: "boolean_true",
            inputType: ""
        },
        {
            id: "myplayedartist",
            label: "Played by Me (Artist)",
            category: "Plays",
            object_types: [
                { id: "song" }
            ],
            operatorType: "boolean_true",
            inputType: ""
        },
        {
            id: "other_user",
            label: "Another User",
            category: "Rating",
            object_types: [
                { id: "song" },
                { id: "album" },
                { id: "artist" }
            ],
            operatorType: "rating_expanded",
            inputType: "user"
        },
        {
            id: "catalog",
            label: "Catalog",
            category: "File Data",
            object_types: [
                { id: "song" },
                { id: "album" },
                { id: "artist" }
            ],
            operatorType: "boolean_is",
            inputType: "catalog"
        },
        {
            id: "other_user_album",
            label: "Another User (Album)",
            category: "Rating",
            object_types: [
                { id: "song" }
            ],
            operatorType: "rating_expanded",
            inputType: "user"
        },
        {
            id: "other_user_artist",
            label: "Another User (Artist)",
            category: "Rating",
            object_types: [
                { id: "song" }
            ],
            operatorType: "rating_expanded",
            inputType: "user"
        },
        {
            id: "playlist",
            label: "Playlist",
            category: "Playlist",
            object_types: [
                { id: "song" }
            ],
            operatorType: "boolean_is",
            inputType: "playlist"
        },
        {
            id: "smartplaylist",
            label: "Smartlist",
            category: "Playlist",
            object_types: [
                { id: "song" }
            ],
            operatorType: "boolean_is",
            inputType: "smartlist"
        },
        {
            id: "playlist_name",
            label: "Playlist Name",
            category: "Playlist",
            object_types: [
                { id: "song" }
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "time",
            label: "Length (in minutes)",
            category: "File Data",
            object_types: [
                { id: "song" },
                { id: "album" },
                { id: "artist" }
            ],
            operatorType: "number",
            inputType: "number"
        },
        {
            id: "added",
            label: "Added",
            category: "File Data",
            object_types: [
                { id: "song" }
            ],
            operatorType: "relative",
            inputType: "number"
        },
        {
            id: "updated",
            label: "Updated",
            category: "File Data",
            object_types: [
                { id: "song" }
            ],
            operatorType: "relative",
            inputType: "number"
        },
        {
            id: "recent_added",
            label: "Recently added",
            category: "File Data",
            object_types: [
                { id: "song" }
            ],
            operatorType: "limit",
            inputType: "number"
        },
        {
            id: "recent_updated",
            label: "Recently updated",
            category: "File Data",
            object_types: [
                { id: "song" }
            ],
            operatorType: "limit",
            inputType: "number"
        },
        {
            id: "mbid",
            label: "MusicBrainz ID",
            category: "MusicBrainz",
            object_types: [
                { id: "song" },
                { id: "album" },
                { id: "artist" }
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "mbid_album",
            label: "MusicBrainz ID (Album)",
            category: "MusicBrainz",
            object_types: [
                { id: "song" }
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "mbid_artist",
            label: "MusicBrainz ID (Artist)",
            category: "MusicBrainz",
            object_types: [
                { id: "song" }
            ],
            operatorType: "string",
            inputType: "text"
        },
        {
            id: "possible_duplicate",
            label: "Possible Duplicate",
            category: "File Data",
            object_types: [
                { id: "song" },
                { id: "album" },
                { id: "artist" }
            ],
            operatorType: "true",
            inputType: ""
        },
        {
            id: "possible_duplicate_album",
            label: "Possible Duplicate Albums",
            category: "File Data",
            object_types: [
                { id: "artist" }
            ],
            operatorType: "true",
            inputType: ""
        },
        {
            id: "has_image",
            label: "Local Image",
            category: "File Data",
            object_types: [
                { id: "album" },
                { id: "artist" }
            ],
            operatorType: "true",
            inputType: ""
        },
        {
            id: "image_width",
            label: "Image Width",
            category: "File Data",
            object_types: [
                { id: "album" },
                { id: "artist" }
            ],
            operatorType: "number",
            inputType: "number"
        },
        {
            id: "image_height",
            label: "Image Height",
            category: "File Data",
            object_types: [
                { id: "album" },
                { id: "artist" }
            ],
            operatorType: "number",
            inputType: "number"
        },
    ];
</script>


<div class="container">
    <div class="options">
        <div class="type">
            <label>
                Search for
                <select bind:value={settings.type} on:change={clearAll}>
                    <option value="song">songs</option>
                    <option value="album">albums</option>
                    <option value="artist">artists</option>
                    <option value="playlist">playlists</option>
                </select>
            </label>
        </div>

        <div class="maximum">
            <label>
                Showing
                <select bind:value={settings.limit}>
                    <option value="0">unlimited</option>
                    <option value="1">1</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                    <option value="250">250</option>
                    <option value="500">500</option>
                </select>
                {parseInt(settings.limit) === 1 ? 'result' : 'results'}
            </label>
        </div>

        <div class="random">
            <label>
                <input type="checkbox" bind:checked={settings.random} />
                Randomized
            </label>
        </div>

        <div class="match">
            <label>
                Matching
                <select bind:value={settings.operator}>
                    <option value="and">all</option>
                    <option value="or">any</option>
                </select>
                {settings.operator === "and" ? 'rules' : 'rule'}
            </label>
        </div>
    </div>

    <div>
        <button type="button" class="secondary" on:click={addNewRow}>Add another rule</button>
    </div>

    <div class="rules">
        {#each rows as row (row.id)}
            <div class="row">
                <select bind:value={row.field} on:change={(e) => { row = setField(row, e) }}>
                    {#each [...groupedFieldsToShow] as [key, value], i}
                        {#if key.length > 0}
                            <optgroup label="{key}">
                                {#each value as field}
                                    <option value="{field.id}">{field.label}</option>
                                {/each}
                            </optgroup>
                        {:else}
                            {#each value as field}
                                <option value="{field.id}">{field.label}</option>
                            {/each}
                        {/if}
                    {/each}
                </select>

                <!-- operators -->

                {#if row.operatorType === "string"}
                    <select bind:value={row.operator}>
                        <option value="0">contains</option>
                        <option value="1">does not contain</option>
                        <option value="2">starts with</option>
                        <option value="3">ends with</option>
                        <option value="4">is</option>
                        <option value="5">is not</option>
                        <option value="6">sounds like</option>
                        <option value="7">does not sound like</option>
                        <option value="8">matches regular expression</option>
                        <option value="9">does not match regular expression</option>
                    </select>
                {/if}

                {#if row.operatorType === "number"}
                    <select bind:value={row.operator}>
                        <option value="0">is greater than or equal to</option>
                        <option value="1">is less than or equal to</option>
                        <option value="2">equals</option>
                        <option value="3">does not equal</option>
                        <option value="4">is greater than</option>
                        <option value="5">is less than</option>
                    </select>
                {/if}

                {#if row.operatorType === "relative"}
                    <select bind:value={row.operator}>
                        <option value="0">before</option>
                        <option value="1">after</option>
                    </select>
                {/if}

                {#if row.operatorType === "relative_x_days"}
                    <select bind:value={row.operator}>
                        <option value="0">before (x) days ago</option>
                        <option value="1">after (x) days ago</option>
                    </select>
                {/if}

                {#if row.operatorType === "rating_expanded"}
                    <select bind:value={row.operator}>
                        <option value="0">has loved</option>
                        <option value="1">has rated 5 stars</option>
                        <option value="2">has rated 4 stars</option>
                        <option value="3">has rated 3 stars</option>
                        <option value="4">has rated 2 stars</option>
                        <option value="5">has rated 1 stars</option>
                        <option value="6">has not rated</option>
                    </select>
                {/if}

                {#if row.operatorType === "limit"}
                    <label>
                        <input name="banana" type="radio" value="0" checked readonly hidden />
                        limit
                    </label>
                {/if}

                {#if row.operatorType === "true"}
                    <label>
                        <input name="apple" type="radio" value="0" checked readonly hidden />
                        is true
                    </label>
                {/if}

                {#if row.operatorType === "boolean_true"}
                    <select bind:value={row.operator}>
                        <option value="0">is true</option>
                        <option value="1">is false</option>
                    </select>
                {/if}

                {#if row.operatorType === "boolean_is"}
                    <select bind:value={row.operator}>
                        <option value="0">is</option>
                        <option value="1">is not</option>
                    </select>
                {/if}

                <!-- inputs -->

                {#if row.inputType === "text"}
                    <input type="text" bind:value={row.input} />
                {/if}

                {#if row.inputType === "number"}
                    <input type="number" bind:value={row.input} />
                {/if}

                {#if row.inputType === "rating"}
                    <select bind:value={row.input}>
                        <option value="0">0 Stars</option>
                        <option value="1">1 Star</option>
                        <option value="2">2 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="5">5 Stars</option>
                    </select>
                {/if}

                {#if row.inputType === "user"}
                    <select bind:value={row.input}>
                        {#each allUsers as user}
                            <option value={user.id}>{user.username}</option>
                        {/each}
                    </select>
                {/if}

                {#if row.inputType === "catalog"}
                    <select bind:value={row.input}>
                        {#each allCatalogs as catalog}
                            <option value={catalog.id}>{catalog.name}</option>
                        {/each}
                    </select>
                {/if}

                {#if row.inputType === "playlist"}
                    <select bind:value={row.input}>
                        {#each allPlaylists as playlist}
                            <option value={playlist.id}>{playlist.name}</option>
                        {/each}
                    </select>
                {/if}

                {#if row.inputType === "smartlist"}
                    <select bind:value={row.input}>
                        {#each allSmartlists as smartlist}
                            <option value={smartlist.id}>{smartlist.name}</option>
                        {/each}
                    </select>
                {/if}

                {#if row.inputType === "" || row.inputType === null}
                <span>
                    <input type="hidden" bind:value={row.input} />
                </span>
                {/if}

                <!-- remove row -->
                <button type="button" class="icon danger" on:click={() => { removeRow(row) }}><SVGClose /></button>
            </div>
        {/each}
    </div>

    <div>
        <button type="button" class="primary" on:click={search}>Search</button>
    </div>
</div>


<style>
    .container {
        border: 2px solid var(--color-border);
        border-radius: 10px;
        padding: var(--spacing-lg);
        margin: var(--spacing-lg) 0;
    }

    .rules {
        display: grid;
        grid-template-columns: repeat(4, auto);
        width: fit-content;
        gap: var(--spacing-md);
        margin: var(--spacing-lg) 0;
    }

    .row {
        display: contents;
    }

    .options {
        margin-bottom: var(--spacing-lg);
        display: flex;
        gap: var(--spacing-xl);
        align-items: center;
    }

    button {
        margin-right: 0;
    }
</style>