<script>
    import { run } from "svelte/legacy";

    import { _ } from "svelte-i18n";
    import { onMount } from "svelte";
    import { API } from "~/stores/state";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { errorHandler } from "~/logic/helper.js";

    let {
        loading = $bindable(false),
        loadedTime = $bindable(),
        results = $bindable([]),
        useSettings = null,
        selectedObjectType = $bindable(null),
        immediateSearch = false,
    } = $props();

    let loaded = $state(false);
    let rows = $state([]);
    let fieldsToShow;
    let groupedFieldsToShow = $state();
    let rowCounter = $state(0);
    let allUsers = $state([]);
    let allCatalogs = $state([]);
    let allPlaylists = $state([]);
    let allSmartlists = $state([]);
    let containerBind = $state();

    // set defaults
    let settings = $state({
        type: "song",
        limit: "500",
        random: false,
        operator: "and",
    });

    function parseParams() {
        if (useSettings) {
            // override default settings with any params
            settings = { ...settings, ...useSettings };

            let joined = Object.keys(settings).join(",");
            let foundRules = joined.match(/rule_\d+(?=,)/gi);

            if (foundRules) {
                foundRules.forEach((element) => {
                    // test to see if all items are present
                    if (
                        settings[`${element}_operator`] !== undefined &&
                        settings[`${element}_input`] !== undefined
                    ) {
                        let newField = settings[`${element}`];

                        let newRow = {
                            id: parseInt(element.match(/\d+/)),
                            field: newField,
                            operator: settings[`${element}_operator`],
                            input: settings[`${element}_input`],
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
            input: "",
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

        fieldsToShow = fields.filter((field) =>
            field.object_types.find((type) => type.id === settings.type),
        );

        // setup categories based on initial order
        for (let i = 0; i < fieldsToShow.length; i++) {
            let item = fieldsToShow[i].object_types.find(
                (type) => type.id === settings.type,
            );

            // apply any overrides while we're at it
            fieldsToShow[i].label = item.label
                ? item.label
                : fieldsToShow[i].label;
            fieldsToShow[i].category = item.category
                ? item.category
                : fieldsToShow[i].category;

            if (!groups.get(fieldsToShow[i].category)) {
                groups.set(fieldsToShow[i].category, []);
            }

            groups.get(fieldsToShow[i].category).push(fieldsToShow[i]);
        }

        // alphabetize each group
        groups.forEach((group) => {
            group.sort(function (obj1, obj2) {
                return obj1.label.localeCompare(obj2.label);
            });
        });

        groupedFieldsToShow = groups;
    }

    function removeRow(row) {
        rows = rows.filter((item) => item.id !== row.id);
    }

    function clearAll() {
        rows = [];
    }

    function setField(row, event = null) {
        // reset operator if type changes
        row.operator = "0";

        // workaround to get first item from first group in map
        let firstID = Array.from(groupedFieldsToShow.entries())[0][1][0].id;

        row.field = event ? event.target.value : firstID;
        row.operatorType = getOperatorType(row.field);
        row.inputType = getInputType(row.field);

        return row;
    }

    async function search() {
        // check for invalid inputs
        if (containerBind?.querySelectorAll("*:invalid").length > 0) {
            return;
        }

        let response;
        results = [];
        loading = true;
        loadedTime = null;

        // transform rows into simple array for API call
        let simpleRows = rows.map((row) => [
            row.field,
            row.operator,
            row.input,
        ]);

        switch (settings.type) {
            case "song":
                response = await $API.advancedSearch({
                    type: "song",
                    limit: settings.limit,
                    random: settings.random ? 1 : 0,
                    operator: settings.operator,
                    rules: simpleRows,
                });
                results = response.song;
                break;
            case "album":
                response = await $API.advancedSearch({
                    type: "album",
                    limit: settings.limit,
                    random: settings.random ? 1 : 0,
                    operator: settings.operator,
                    rules: simpleRows,
                });
                results = response.album;
                break;
            case "artist":
                response = await $API.advancedSearch({
                    type: "artist",
                    limit: settings.limit,
                    random: settings.random ? 1 : 0,
                    operator: settings.operator,
                    rules: simpleRows,
                });
                results = response.artist;
                break;
            case "playlist":
                response = await $API.advancedSearch({
                    type: "playlist",
                    limit: settings.limit,
                    random: settings.random ? 1 : 0,
                    operator: settings.operator,
                    rules: simpleRows,
                });
                results = response.playlist;
                break;
            default:
                break;
        }

        if (response.error) {
            errorHandler("advanced search", response.error);
        }

        loadedTime = new Date();
        loading = false;
    }

    onMount(async () => {
        parseParams();

        allUsers = await $API.users();
        if (allUsers.error) {
            errorHandler("getting users", allUsers.error);
        }

        allCatalogs = await $API.catalogs();
        if (allCatalogs.error) {
            errorHandler("getting catalogs", allCatalogs.error);
        }

        allPlaylists = await $API.playlists({ hide_search: 1 });
        if (allPlaylists.error) {
            errorHandler("getting playlists", allPlaylists.error);
        }

        allSmartlists = await $API.smartlists();
        if (allSmartlists.error) {
            errorHandler("getting smartlists", allSmartlists.error);
        }

        loaded = true;

        if (immediateSearch) {
            await search();
        }
    });

    let fields = [
        {
            id: "anywhere",
            label: "text.searchAnyText",
            category: "",
            object_types: [{ id: "song" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "title",
            label: "text.title",
            category: "text.metadata",
            object_types: [
                { id: "song", category: "text.metadataSong" },
                { id: "album", category: "text.metadataAlbum" },
                {
                    id: "artist",
                    category: "text.metadataArtist",
                    label: "text.name",
                },
                {
                    id: "playlist",
                    category: "text.metadataPlaylist",
                    label: "text.name",
                },
            ],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "artist",
            label: "text.artist",
            category: "text.metadata",
            object_types: [
                {
                    id: "song",
                    category: "text.metadataSong",
                    label: "text.songArtist",
                },
                {
                    id: "album",
                    category: "text.metadataAlbum",
                    label: "text.albumArtist",
                },
            ],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "year",
            label: "text.year",
            category: "text.metadata",
            object_types: [
                { id: "song", category: "text.metadataSong" },
                { id: "album", category: "text.metadataAlbum" },
                { id: "artist", category: "text.metadataArtist" },
            ],
            operatorType: "number",
            inputType: "number",
        },
        {
            id: "genre",
            label: "text.genre",
            category: "text.metadata",
            object_types: [
                { id: "song", category: "text.metadataSong" },
                { id: "album", category: "text.metadataAlbum" },
                { id: "artist", category: "text.metadataArtist" },
            ],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "song_genre",
            label: "text.songGenre",
            category: "text.metadata",
            object_types: [
                { id: "album", category: "text.metadataAlbum" },
                { id: "artist", category: "text.metadataArtist" },
            ],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "album_genre",
            label: "text.albumGenre",
            category: "text.metadataSong",
            object_types: [{ id: "song" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "no_genre",
            label: "text.noGenre",
            category: "text.metadata",
            object_types: [
                { id: "song", category: "text.metadataSong" },
                { id: "album", category: "text.metadataAlbum" },
                { id: "artist", category: "text.metadataArtist" },
            ],
            operatorType: "boolean_true",
            inputType: "",
        },
        {
            id: "comment",
            label: "text.comment",
            category: "text.metadataSong",
            object_types: [{ id: "song" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "lyrics",
            label: "text.lyrics",
            category: "text.metadataSong",
            object_types: [{ id: "song" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "file",
            label: "text.filename",
            category: "text.fileData",
            object_types: [{ id: "song" }, { id: "album" }, { id: "artist" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "bitrate",
            label: "text.bitrate",
            category: "text.fileData",
            object_types: [{ id: "song" }],
            operatorType: "number",
            inputType: "number",
        },
        {
            id: "label",
            label: "text.label",
            category: "text.metadataSong",
            object_types: [{ id: "song" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "track",
            label: "text.track",
            category: "text.metadataSong",
            object_types: [{ id: "song" }],
            operatorType: "number",
            inputType: "number",
        },
        {
            id: "artist_genre",
            label: "text.artistGenre",
            category: "text.metadataSong",
            object_types: [{ id: "song" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "album",
            label: "text.album",
            category: "text.metadataSong",
            object_types: [{ id: "song" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "composer",
            label: "text.composer",
            category: "text.metadataSong",
            object_types: [{ id: "song" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "album_artist",
            label: "text.albumArtist",
            category: "text.metadataSong",
            object_types: [{ id: "song" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "orphaned_album",
            label: "text.orphanedAlbum",
            category: "text.fileData",
            object_types: [{ id: "song" }],
            operatorType: "boolean_true",
            inputType: "",
        },
        {
            id: "song_artist",
            label: "text.songArtist",
            category: "text.metadataAlbum",
            object_types: [{ id: "album" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "song_title",
            label: "text.songTitle",
            category: "text.metadata",
            object_types: [
                { id: "album", category: "text.metadataAlbum" },
                { id: "artist", category: "text.metadataArtist" },
            ],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "album_title",
            label: "text.albumTitle",
            category: "text.metadataArtist",
            object_types: [{ id: "artist" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "summary",
            label: "text.summary",
            category: "text.metadataArtist",
            object_types: [{ id: "artist" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "original_year",
            label: "text.originalYear",
            category: "text.metadataAlbum",
            object_types: [{ id: "album" }],
            operatorType: "number",
            inputType: "number",
        },
        {
            id: "song_count",
            label: "text.songCount",
            category: "text.metadata",
            object_types: [
                { id: "album", category: "text.metadataAlbum" },
                { id: "artist", category: "text.metadataArtist" },
            ],
            operatorType: "number",
            inputType: "number",
        },
        {
            id: "album_count",
            label: "text.albumCount",
            category: "text.metadataArtist",
            object_types: [{ id: "artist" }],
            operatorType: "number",
            inputType: "number",
        },
        {
            id: "release_type",
            label: "text.releaseType",
            category: "text.metadataAlbum",
            object_types: [{ id: "album" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "release_status",
            label: "text.releaseStatus",
            category: "text.metadataAlbum",
            object_types: [{ id: "album" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "yearformed",
            label: "text.yearFormed",
            category: "text.metadataArtist",
            object_types: [{ id: "artist" }],
            operatorType: "number",
            inputType: "number",
        },
        {
            id: "placeformed",
            label: "text.placeFormed",
            category: "text.metadataArtist",
            object_types: [{ id: "artist" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "barcode",
            label: "text.barcode",
            category: "text.metadataAlbum",
            object_types: [{ id: "album" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "catalog_number",
            label: "text.catalogNumber",
            category: "text.metadataAlbum",
            object_types: [{ id: "album" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "myrating",
            label: "text.myRating",
            category: "text.rating",
            object_types: [{ id: "song" }, { id: "album" }, { id: "artist" }],
            operatorType: "number",
            inputType: "rating",
        },
        {
            id: "rating",
            label: "text.ratingAverage",
            category: "text.rating",
            object_types: [{ id: "song" }, { id: "album" }, { id: "artist" }],
            operatorType: "number",
            inputType: "rating",
        },
        {
            id: "songrating",
            label: "text.myRatingSong",
            category: "text.rating",
            object_types: [{ id: "album" }, { id: "artist" }],
            operatorType: "number",
            inputType: "rating",
        },
        {
            id: "albumrating",
            label: "text.myRatingAlbum",
            category: "text.rating",
            object_types: [{ id: "song" }, { id: "artist" }],
            operatorType: "number",
            inputType: "rating",
        },
        {
            id: "artistrating",
            label: "text.myRatingArtist",
            category: "text.rating",
            object_types: [{ id: "song" }, { id: "album" }],
            operatorType: "number",
            inputType: "rating",
        },
        {
            id: "favorite",
            label: "text.favorites",
            category: "text.rating",
            object_types: [{ id: "song" }, { id: "album" }, { id: "artist" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "favorite_album",
            label: "text.favoritesAlbum",
            category: "text.rating",
            object_types: [{ id: "song" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "favorite_artist",
            label: "text.favoritesArtist",
            category: "text.rating",
            object_types: [{ id: "song" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "played_times",
            label: "text.playedTimes",
            category: "text.plays",
            object_types: [{ id: "song" }, { id: "album" }, { id: "artist" }],
            operatorType: "number",
            inputType: "number",
        },
        {
            id: "skipped_times",
            label: "text.skippedTimes",
            category: "text.plays",
            object_types: [{ id: "song" }],
            operatorType: "number",
            inputType: "number",
        },
        {
            id: "played_or_skipped_times",
            label: "text.playedSkippedTimes",
            category: "text.plays",
            object_types: [{ id: "song" }],
            operatorType: "number",
            inputType: "number",
        },
        {
            id: "play_skip_ratio",
            label: "text.playedSkippedRatio",
            category: "text.plays",
            object_types: [{ id: "song" }],
            operatorType: "number",
            inputType: "number",
        },
        {
            id: "recent_played",
            label: "text.recentlyPlayed",
            category: "text.plays",
            object_types: [{ id: "song" }, { id: "album" }, { id: "artist" }],
            operatorType: "limit",
            inputType: "number",
        },
        {
            id: "last_play",
            label: "text.myLastPlay",
            category: "text.plays",
            object_types: [{ id: "song" }, { id: "album" }, { id: "artist" }],
            operatorType: "relative_x_days",
            inputType: "number",
        },
        {
            id: "last_skip",
            label: "text.myLastSkip",
            category: "text.plays",
            object_types: [{ id: "song" }, { id: "album" }, { id: "artist" }],
            operatorType: "relative_x_days",
            inputType: "number",
        },
        {
            id: "last_play_or_skip",
            label: "text.myLastPlaySkip",
            category: "text.plays",
            object_types: [{ id: "song" }, { id: "album" }, { id: "artist" }],
            operatorType: "relative_x_days",
            inputType: "number",
        },
        {
            id: "played",
            label: "text.played",
            category: "text.plays",
            object_types: [{ id: "song" }, { id: "album" }, { id: "artist" }],
            operatorType: "boolean_true",
            inputType: "",
        },
        {
            id: "myplayed",
            label: "text.playedByMe",
            category: "text.plays",
            object_types: [{ id: "song" }, { id: "album" }, { id: "artist" }],
            operatorType: "boolean_true",
            inputType: "",
        },
        {
            id: "myplayedalbum",
            label: "text.playedByMeAlbum",
            category: "text.plays",
            object_types: [{ id: "song" }],
            operatorType: "boolean_true",
            inputType: "",
        },
        {
            id: "myplayedartist",
            label: "text.playedByMeArtist",
            category: "text.plays",
            object_types: [{ id: "song" }, { id: "album" }],
            operatorType: "boolean_true",
            inputType: "",
        },
        {
            id: "other_user",
            label: "text.anotherUser",
            category: "text.rating",
            object_types: [{ id: "song" }, { id: "album" }, { id: "artist" }],
            operatorType: "rating_expanded",
            inputType: "user",
        },
        {
            id: "catalog",
            label: "text.catalog",
            category: "text.fileData",
            object_types: [{ id: "song" }, { id: "album" }, { id: "artist" }],
            operatorType: "boolean_is",
            inputType: "catalog",
        },
        {
            id: "other_user_album",
            label: "text.anotherUserAlbum",
            category: "text.rating",
            object_types: [{ id: "song" }],
            operatorType: "rating_expanded",
            inputType: "user",
        },
        {
            id: "other_user_artist",
            label: "text.anotherUserArtist",
            category: "text.rating",
            object_types: [{ id: "song" }],
            operatorType: "rating_expanded",
            inputType: "user",
        },
        {
            id: "playlist",
            label: "text.playlist",
            category: "text.playlist",
            object_types: [{ id: "song" }, { id: "album" }, { id: "artist" }],
            operatorType: "boolean_is",
            inputType: "playlist",
        },
        {
            id: "smartplaylist",
            label: "text.smartlist",
            category: "text.playlist",
            object_types: [{ id: "song" }, { id: "album" }],
            operatorType: "boolean_is",
            inputType: "smartlist",
        },
        {
            id: "playlist_name",
            label: "text.playlistName",
            category: "text.playlist",
            object_types: [{ id: "song" }, { id: "album" }, { id: "artist" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "time",
            label: "text.lengthInMinutes",
            category: "text.fileData",
            object_types: [{ id: "song" }, { id: "album" }, { id: "artist" }],
            operatorType: "number",
            inputType: "number",
        },
        {
            id: "added",
            label: "text.added",
            category: "text.fileData",
            object_types: [{ id: "song" }],
            operatorType: "relative",
            inputType: "date",
        },
        {
            id: "updated",
            label: "text.updated",
            category: "text.fileData",
            object_types: [{ id: "song" }],
            operatorType: "relative",
            inputType: "date",
        },
        {
            id: "recent_added",
            label: "text.recentlyAdded",
            category: "text.fileData",
            object_types: [{ id: "song" }, { id: "album" }],
            operatorType: "limit",
            inputType: "number",
        },
        {
            id: "recent_updated",
            label: "text.recentlyUpdated",
            category: "text.fileData",
            object_types: [{ id: "song" }],
            operatorType: "limit",
            inputType: "number",
        },
        {
            id: "mbid",
            label: "text.musicbrainzID",
            category: "text.musicbrainz",
            object_types: [{ id: "song" }, { id: "album" }, { id: "artist" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "mbid_song",
            label: "text.musicbrainzIDSong",
            category: "text.musicbrainz",
            object_types: [{ id: "album" }, { id: "artist" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "mbid_album",
            label: "text.musicbrainzIDAlbum",
            category: "text.musicbrainz",
            object_types: [{ id: "song" }, { id: "artist" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "mbid_artist",
            label: "text.musicbrainzIDArtist",
            category: "text.musicbrainz",
            object_types: [{ id: "song" }, { id: "album" }],
            operatorType: "string",
            inputType: "text",
        },
        {
            id: "possible_duplicate",
            label: "text.possibleDuplicate",
            category: "text.fileData",
            object_types: [{ id: "song" }, { id: "album" }, { id: "artist" }],
            operatorType: "true",
            inputType: "",
        },
        {
            id: "possible_duplicate_album",
            label: "text.possibleDuplicateAlbum",
            category: "text.fileData",
            object_types: [{ id: "song" }, { id: "artist" }],
            operatorType: "true",
            inputType: "",
        },
        {
            id: "duplicate_tracks",
            label: "text.duplicateAlbumTracks",
            category: "text.fileData",
            object_types: [{ id: "song" }, { id: "album" }],
            operatorType: "true",
            inputType: "",
        },
        {
            id: "has_image",
            label: "text.localImage",
            category: "text.fileData",
            object_types: [{ id: "album" }, { id: "artist" }],
            operatorType: "true",
            inputType: "",
        },
        {
            id: "image_width",
            label: "text.imageWidth",
            category: "text.fileData",
            object_types: [{ id: "album" }, { id: "artist" }],
            operatorType: "number",
            inputType: "number",
        },
        {
            id: "image_height",
            label: "text.imageHeight",
            category: "text.fileData",
            object_types: [{ id: "album" }, { id: "artist" }],
            operatorType: "number",
            inputType: "number",
        },
    ];
    // keep selectedObjectType in sync
    run(() => {
        selectedObjectType = settings.type;
    });
    // reset everything if object type changes
    run(() => {
        if (settings.type) {
            populateFields();
        }
    });
    // auto-add a row if all are removed
    run(() => {
        if (loaded && rows.length < 1) {
            addNewRow();
        }
    });
    // get highest existing id, or start at 1
    run(() => {
        rowCounter = rows.length ? Math.max(...rows.map((t) => t.id)) + 1 : 1;
    });
</script>

<div bind:this={containerBind} class="container">
    <div class="options">
        <div class="type">
            <sl-select
                label={$_("text.searchFor")}
                onsl-change={(e) => {
                    settings.type = e.target.value;
                    clearAll();
                }}
                value={settings.type}
            >
                <sl-option value="song">{$_("text.songs")}</sl-option>
                <sl-option value="album">{$_("text.albums")}</sl-option>
                <sl-option value="artist">{$_("text.artists")}</sl-option>
                <sl-option value="playlist">{$_("text.playlists")}</sl-option>
            </sl-select>
        </div>

        <div class="maximum">
            <sl-select
                label={$_("text.limit")}
                onsl-change={(e) => {
                    settings.limit = e.target.value;
                }}
                value={settings.limit}
            >
                <sl-option value="0">{$_("text.unlimited")}</sl-option>
                <sl-option value="1">1</sl-option>
                <sl-option value="5">5</sl-option>
                <sl-option value="10">10</sl-option>
                <sl-option value="25">25</sl-option>
                <sl-option value="50">50</sl-option>
                <sl-option value="100">100</sl-option>
                <sl-option value="250">250</sl-option>
                <sl-option value="500">500</sl-option>
            </sl-select>
        </div>

        <div class="random">
            <sl-switch
                onsl-change={(e) => (settings.random = e.target.checked)}
            >
                {$_("text.random")}
            </sl-switch>
        </div>

        <div class="match">
            <sl-switch
                checked
                onsl-change={(e) => {
                    settings.operator = e.target.checked ? "and" : "or";
                }}
            >
                {$_("text.matchAllRules")}
            </sl-switch>
        </div>
    </div>

    <sl-divider></sl-divider>

    <div class="rules">
        {#each rows as row, i (row.id)}
            <div class="row">
                <sl-select
                    value={row.field}
                    onsl-change={(e) => {
                        rows[i].field = e.target.value;
                        rows[i] = setField(row, e);
                    }}
                >
                    {#each [...groupedFieldsToShow] as [key, value], i}
                        {#if key.length > 0}
                            <sl-divider></sl-divider>
                            <small>{$_(key)}</small>
                            {#each value as field}
                                <sl-option value={field.id}>
                                    {$_(field.label)}
                                </sl-option>
                            {/each}
                        {:else}
                            {#each value as field}
                                <sl-option value={field.id}>
                                    {$_(field.label)}
                                </sl-option>
                            {/each}
                        {/if}
                    {/each}
                </sl-select>

                <!-- operators -->

                {#if row.operatorType === "string"}
                    <sl-select
                        value={row.operator}
                        onsl-change={(e) => {
                            row.operator = e.target.value;
                        }}
                    >
                        <sl-option value="0">
                            {$_("text.searchContains")}
                        </sl-option>
                        <sl-option value="1">
                            {$_("text.searchContainsNot")}
                        </sl-option>
                        <sl-divider></sl-divider>
                        <sl-option value="2">
                            {$_("text.searchStartsWith")}
                        </sl-option>
                        <sl-option value="3">
                            {$_("text.searchEndsWith")}
                        </sl-option>
                        <sl-divider></sl-divider>
                        <sl-option value="4">{$_("text.searchIs")}</sl-option>
                        <sl-option value="5">
                            {$_("text.searchIsNot")}
                        </sl-option>
                        <sl-divider></sl-divider>
                        <sl-option value="6">
                            {$_("text.searchSoundsLike")}
                        </sl-option>
                        <sl-option value="7">
                            {$_("text.searchSoundsLikeNot")}
                        </sl-option>
                        <sl-divider></sl-divider>
                        <sl-option value="8">
                            {$_("text.searchMatchRegex")}
                        </sl-option>
                        <sl-option value="9">
                            {$_("text.searchMatchRegexNot")}
                        </sl-option>
                    </sl-select>
                {/if}

                {#if row.operatorType === "number"}
                    <sl-select
                        value={row.operator}
                        onsl-change={(e) => {
                            row.operator = e.target.value;
                        }}
                    >
                        <sl-option value="0">
                            {$_("text.searchGreaterThanEqual")}
                        </sl-option>
                        <sl-option value="1">
                            {$_("text.searchLessThanEqual")}
                        </sl-option>
                        <sl-divider></sl-divider>
                        <sl-option value="2">
                            {$_("text.searchEquals")}
                        </sl-option>
                        <sl-option value="3">
                            {$_("text.searchEqualsNot")}
                        </sl-option>
                        <sl-divider></sl-divider>
                        <sl-option value="4">
                            {$_("text.searchGreaterThan")}
                        </sl-option>
                        <sl-option value="5">
                            {$_("text.searchLessThan")}
                        </sl-option>
                    </sl-select>
                {/if}

                {#if row.operatorType === "relative"}
                    <sl-select
                        value={row.operator}
                        onsl-change={(e) => {
                            row.operator = e.target.value;
                        }}
                    >
                        <sl-option value="0">
                            {$_("text.searchBefore")}
                        </sl-option>
                        <sl-option value="1">
                            {$_("text.searchAfter")}
                        </sl-option>
                    </sl-select>
                {/if}

                {#if row.operatorType === "relative_x_days"}
                    <sl-select
                        value={row.operator}
                        onsl-change={(e) => {
                            row.operator = e.target.value;
                        }}
                    >
                        <sl-option value="0">
                            {$_("text.searchBeforeXDays", {
                                values: { x: "(x)" },
                            })}
                        </sl-option>
                        <sl-option value="1">
                            {$_("text.searchAfterXDays", {
                                values: { x: "(x)" },
                            })}
                        </sl-option>
                    </sl-select>
                {/if}

                {#if row.operatorType === "rating_expanded"}
                    <sl-select
                        value={row.operator}
                        onsl-change={(e) => {
                            row.operator = e.target.value;
                        }}
                    >
                        <sl-option value="0">
                            {$_("text.searchHasLoved")}
                        </sl-option>
                        <sl-divider></sl-divider>
                        <sl-option value="1">
                            {$_("text.searchStars", { values: { count: 5 } })}
                        </sl-option>
                        <sl-option value="2">
                            {$_("text.searchStars", { values: { count: 4 } })}
                        </sl-option>
                        <sl-option value="3">
                            {$_("text.searchStars", { values: { count: 3 } })}
                        </sl-option>
                        <sl-option value="4">
                            {$_("text.searchStars", { values: { count: 2 } })}
                        </sl-option>
                        <sl-option value="5">
                            {$_("text.searchStars", { values: { count: 1 } })}
                        </sl-option>
                        <sl-option value="6">
                            {$_("text.searchNotRated")}
                        </sl-option>
                    </sl-select>
                {/if}

                {#if row.operatorType === "limit"}
                    <label style="text-align: end;">
                        <input
                            name="banana"
                            type="radio"
                            value="0"
                            checked
                            readonly
                            hidden
                        />
                        {$_("text.limit")}
                    </label>
                {/if}

                {#if row.operatorType === "true"}
                    <label>
                        <input
                            name="apple"
                            type="radio"
                            value="0"
                            checked
                            readonly
                            hidden
                        />
                        {$_("text.searchTrue")}
                    </label>
                {/if}

                {#if row.operatorType === "boolean_true"}
                    <sl-select
                        value={row.operator}
                        onsl-change={(e) => {
                            row.operator = e.target.value;
                        }}
                    >
                        <sl-option value="0">{$_("text.searchTrue")}</sl-option>
                        <sl-option value="1">
                            {$_("text.searchFalse")}
                        </sl-option>
                    </sl-select>
                {/if}

                {#if row.operatorType === "boolean_is"}
                    <sl-select
                        value={row.operator}
                        onsl-change={(e) => {
                            row.operator = e.target.value;
                        }}
                    >
                        <sl-option value="0">{$_("text.searchIs")}</sl-option>
                        <sl-option value="1">
                            {$_("text.searchIsNot")}
                        </sl-option>
                    </sl-select>
                {/if}

                <!-- inputs -->

                {#if row.inputType === "text"}
                    <sl-input
                        type="text"
                        onsl-change={(e) => (row.input = e.target.value)}
                        required
                    ></sl-input>
                {/if}

                {#if row.inputType === "number"}
                    <sl-input
                        type="number"
                        onsl-change={(e) => (row.input = e.target.value)}
                        required
                    ></sl-input>
                {/if}

                {#if row.inputType === "date"}
                    <sl-input
                        type="date"
                        onsl-change={(e) => (row.input = e.target.value)}
                        required
                    ></sl-input>
                {/if}

                {#if row.inputType === "rating"}
                    <sl-select
                        value={row.input}
                        required
                        onsl-change={(e) => {
                            row.input = e.target.value;
                        }}
                    >
                        <sl-option value="5">
                            {$_("text.ratingCount", { values: { count: 5 } })}
                        </sl-option>
                        <sl-option value="4">
                            {$_("text.ratingCount", { values: { count: 4 } })}
                        </sl-option>
                        <sl-option value="3">
                            {$_("text.ratingCount", { values: { count: 3 } })}
                        </sl-option>
                        <sl-option value="2">
                            {$_("text.ratingCount", { values: { count: 2 } })}
                        </sl-option>
                        <sl-option value="1">
                            {$_("text.ratingCount", { values: { count: 1 } })}
                        </sl-option>
                        <sl-option value="0">
                            {$_("text.ratingCount", { values: { count: 0 } })}
                        </sl-option>
                    </sl-select>
                {/if}

                {#if row.inputType === "user"}
                    <sl-select
                        value={row.input}
                        required
                        onsl-change={(e) => {
                            row.input = e.target.value;
                        }}
                    >
                        {#each allUsers as user}
                            <sl-option value={user.id}>
                                {user.username}
                            </sl-option>
                        {/each}
                    </sl-select>
                {/if}

                {#if row.inputType === "catalog"}
                    <sl-select
                        value={row.input}
                        required
                        onsl-change={(e) => {
                            row.input = e.target.value;
                        }}
                    >
                        {#each allCatalogs as catalog}
                            <sl-option value={catalog.id}>
                                {catalog.name}
                            </sl-option>
                        {/each}
                    </sl-select>
                {/if}

                {#if row.inputType === "playlist"}
                    <sl-select
                        value={row.input}
                        required
                        onsl-change={(e) => {
                            row.input = e.target.value;
                        }}
                    >
                        {#each allPlaylists as playlist}
                            <sl-option value={playlist.id}>
                                {playlist.name}
                            </sl-option>
                        {/each}
                    </sl-select>
                {/if}

                {#if row.inputType === "smartlist"}
                    <sl-select
                        value={row.input}
                        required
                        onsl-change={(e) => {
                            row.input = e.target.value;
                        }}
                    >
                        {#each allSmartlists as smartlist}
                            <sl-option value={smartlist.id}>
                                {smartlist.name}
                            </sl-option>
                        {/each}
                    </sl-select>
                {/if}

                {#if row.inputType === "" || row.inputType === null}
                    <span>
                        <input type="hidden" bind:value={row.input} />
                    </span>
                {/if}

                <!-- remove row -->
                <sl-button
                    variant="danger"
                    circle
                    onclick={() => {
                        removeRow(row);
                    }}
                >
                    <MaterialSymbol name="close" />
                </sl-button>
            </div>
        {/each}

        <MaterialSymbol name="add" slot="prefix" />
        <sl-button onclick={addNewRow} variant="primary">
            {$_("text.searchAddRule")}
        </sl-button>
    </div>

    <sl-divider></sl-divider>

    <div class="actions">
        <sl-button onclick={search} variant="primary">
            {$_("text.search")}
        </sl-button>
    </div>
</div>

<style>
    .container {
        container-name: custom-search-wrapper;
        container-type: inline-size;
        margin-block-end: var(--spacing-xxl);
        overflow-y: visible; /* prevent selects from being cut off */
    }

    .rules {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        gap: var(--spacing-xl);
    }

    .row {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
        align-items: end;
        width: 100%;
    }

    label {
        align-self: center;
    }

    .row > :global(*:not(button)) {
        width: 100%;
    }

    .options {
        display: flex;
        gap: var(--spacing-lg) var(--spacing-xl);
        align-items: end;
        flex-wrap: wrap;
        white-space: nowrap;
    }

    sl-switch {
        margin-block-end: var(--spacing-md);
    }

    @container custom-search-wrapper (min-width: 700px) {
        .rules {
            display: grid;
            grid-template-columns: repeat(4, auto);
            width: fit-content;
            gap: var(--spacing-md);
        }

        .row {
            display: contents;
        }
    }

    .container :global(*:invalid) {
        outline: 2px solid var(--swatch-red-500);
    }
</style>
