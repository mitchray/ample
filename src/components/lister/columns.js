import { capitalize } from "lodash-es";
import ArtistList from "~/components/artist/artistList.svelte";
import Name from "~/components/lister/components/name.svelte";
import RelativeDate from "~/components/relativeDate.svelte";
import GenreList from "~/components/genreList.svelte";
import Rating from "~/components/rating/rating.svelte";
import Badge from "~/components/badge.svelte";
import Art from "~/components/art.svelte";
import Actions from "~/components/action/actions.svelte";
import {
    formatFilesize,
    formatReleaseType,
    formatSongQuality,
    formatTotalTime,
} from "~/logic/formatters.js";

export const ColumnDefaults = {
    headerSort: true,
    resizable: true,
    headerSortTristate: true,
    vertAlign: "middle",
    minWidth: 100,
};

export const remotePaginationDefaults = {
    pagination: true, //enable pagination
    paginationMode: "remote", //enable remote pagination
    paginationCounter: "rows",
    paginationInitialPage: 1,
    paginationButtonCount: 9,
    paginationSize: 100,
    paginationSizeSelector: [10, 25, 50, 100, 200, true],
    ajaxURL: "not used, see ajaxURLGenerator",
};

/**
 * Convert Ampache response into format Tabulator expects
 * @param objectName - Will be converted to 'data'
 * @param url
 * @param params
 * @param response
 * @returns {*}
 */
export function normalizeResponse(objectName, url, params, response) {
    // rename objectName to 'data'
    delete Object.assign(response, { ["data"]: response[objectName] })[
        objectName
    ];

    // convert value of total_count to last_page
    response.last_page = Math.ceil(response.total_count / params.size);

    // rename 'total_count' to 'last_row'
    delete Object.assign(response, {
        ["last_row"]: response["total_count"],
    })["total_count"];

    return response; // return the response data
}

/*
 BASES FOR EXTENDING
 */

/** @type Column */
let actionsBase = {
    field: "actions",
    title: "Actions",
    minWidth: 180,
    headerSort: false,
};

/** @type Column */
let artBase = {
    field: "art",
    title: "",
    minWidth: 20,
    headerSort: false,
    hozAlign: "center",
};

/** @type Column */
let ratingBase = {
    field: "rating",
    title: "Rating",
    minWidth: 130,
};

/** @type Column */
let nameBase = {
    field: "name",
    title: "Name",
    width: 300,
};

/*
 INDIVIDUAL COLUMNS
 */

/** @type Column */
export let checkbox = {
    title: "",
    formatter: "rowSelection",
    titleFormatter: "rowSelection",
    headerSort: false,
    resizable: false,
    headerHozAlign: "center",
    hozAlign: "center",
    width: 30,
    minWidth: 30,
};

/** @type Column */
export let moveHandle = {
    field: "moveHandle",
    title: "",
    rowHandle: true,
    formatter: "handle",
    headerSort: false,
    resizable: false,
    width: 30,
    minWidth: 30,
};

/** @type Column */
export let moveHandleDisabled = {
    field: "moveHandleDisabled",
    title: "",
    headerSort: false,
    resizable: false,
    width: 30,
    minWidth: 30,
};

/** @type Column */
export let index = {
    field: "order",
    title: "№",
    hozAlign: "right",
    headerHozAlign: "right",
    width: 50,
    minWidth: 50,
    sorter: "number",
    headerSortTristate: false,
};

/** @type Column */
export let track = {
    field: "track",
    title: "#",
    sorter: "number",
    hozAlign: "right",
    headerHozAlign: "right",
    width: 50,
    minWidth: 50,
};

/** @type Column */
export let artist = {
    field: "artists",
    title: "Artist",
    width: 200,
    headerSort: false,
    formatter: (cell, formatterParams, onRendered) => {
        onRendered(function () {
            new ArtistList({
                target: cell.getElement(),
                props: {
                    data: cell.getData(),
                },
            });
        });
    },
};

/** @type Column */
export let album = {
    field: "album",
    title: "Album",
    width: 200,
    formatter: (cell, formatterParams, onRendered) => {
        const data = cell.getData();
        return `<a href="#/album/${data.album.id}">
            ${data.album.name}
        </a>`;
    },
};

/** @type Column */
export let date = {
    field: "year",
    title: "Date",
    sorter: "number",
    hozAlign: "right",
    headerHozAlign: "right",
    formatter: (cell, formatterParams, onRendered) => cell.getValue() || "-",
};

/** @type Column */
export let items = {
    field: "items",
    title: "Items",
    sorter: "number",
    formatter: (cell, formatterParams, onRendered) => cell.getValue() || "-",
};

/** @type Column */
export let songCount = {
    field: "songcount",
    title: "Songs",
    sorter: "number",
    hozAlign: "right",
    headerHozAlign: "right",
    formatter: (cell, formatterParams, onRendered) => cell.getValue() || "-",
};

/** @type Column */
export let albumCount = {
    field: "albumcount",
    title: "Releases",
    sorter: "number",
    hozAlign: "right",
    headerHozAlign: "right",
    formatter: (cell, formatterParams, onRendered) => cell.getValue() || "-",
};

/** @type Column */
export let length = {
    field: "time",
    title: "Length",
    hozAlign: "right",
    headerHozAlign: "right",
    formatter: (cell, formatterParams, onRendered) =>
        formatTotalTime(cell.getValue()),
};

/** @type Column */
export let count = {
    field: "count",
    title: "Count",
    sorter: "number",
    hozAlign: "right",
    headerHozAlign: "right",
    formatter: (cell, formatterParams, onRendered) => {
        const data = cell.getData();
        return `${data.items} ${parseInt(data.items) === 1 ? "song" : "songs"}`;
    },
};

/** @type Column */
export let type = {
    field: "type",
    title: "Type",
    formatter: (cell, formatterParams, onRendered) => {
        onRendered(function () {
            return new Badge({
                target: cell.getElement(),
                props: {
                    text: formatReleaseType(cell.getValue()),
                },
            });
        });
    },
};

/** @type Column */
export let genreArtistsCount = {
    field: "artists",
    title: "Artists",
    sorter: "number",
    formatter: (cell, formatterParams, onRendered) => {
        const data = cell.getData();
        return `<a href="#/genre/${data.id}">
            <MaterialSymbol name="artist" />
            ${data.artists}
        </a>`;
    },
};

/** @type Column */
export let genreAlbumsCount = {
    field: "albums",
    title: "Albums",
    sorter: "number",
    formatter: (cell, formatterParams, onRendered) => {
        const data = cell.getData();
        return `<a href="#/genre/${data.id}">
            <MaterialSymbol name="album" />
            ${data.albums}
        </a>`;
    },
};

/** @type Column */
export let genreSongsCount = {
    field: "songs",
    title: "Songs",
    sorter: "number",
    formatter: (cell, formatterParams, onRendered) => {
        const data = cell.getData();
        return `<a href="#/genre/${data.id}">
            <MaterialSymbol name="music_note" />
            ${data.songs}
        </a>`;
    },
};

/** @type Column */
export let genres = {
    field: "genres",
    title: "Genres",
    formatter: (cell, formatterParams, onRendered) => {
        onRendered(function () {
            new GenreList({
                target: cell.getElement(),
                props: {
                    items: cell.getData().genre,
                    limit: 1,
                },
            });
        });
    },
};

/** @type Column */
export let owner = {
    field: "owner",
    title: "Owner",
};

/** @type Column */
export let privacy = {
    field: "type",
    title: "Type",
    formatter: (cell, formatterParams, onRendered) =>
        capitalize(cell.getData().type),
};

/** @type Column */
export let playCount = {
    field: "playcount",
    title: "Plays",
    sorter: "number",
    hozAlign: "right",
    headerHozAlign: "right",
    formatter: (cell, formatterParams, onRendered) => cell.getValue() || "-",
};

/** @type Column */
export let quality = {
    field: "quality",
    title: "Quality",
    sorter: "string",
    hozAlign: "right",
    headerHozAlign: "right",
    formatter: (cell, formatterParams, onRendered) =>
        formatSongQuality(cell.getData()),
};

/** @type Column */
export let size = {
    field: "size",
    title: "Size",
    sorter: "number",
    hozAlign: "right",
    headerHozAlign: "right",
    formatter: (cell, formatterParams, onRendered) =>
        formatFilesize(cell.getValue()),
};

/** @type Column */
export let state = {
    field: "state",
    title: "State",
};

/** @type Column */
export let published = {
    field: "published",
    title: "Published",
    formatter: (cell, formatterParams, onRendered) => {
        onRendered(function () {
            new RelativeDate({
                target: cell.getElement(),
                props: {
                    data: cell.getData().pubdate,
                },
            });
        });
    },
};

/** @type Column */
export let ratingSong = {
    ...ratingBase,
    formatter: (cell, formatterParams, onRendered) => {
        onRendered(function () {
            new Rating({
                target: cell.getElement(),
                props: {
                    data: cell.getData(),
                    type: "song",
                },
            });
        });
    },
};

/** @type Column */
export let ratingAlbum = {
    ...ratingBase,
    formatter: (cell, formatterParams, onRendered) => {
        onRendered(function () {
            new Rating({
                target: cell.getElement(),
                props: {
                    data: cell.getData(),
                    type: "album",
                },
            });
        });
    },
};

/** @type Column */
export let ratingArtist = {
    ...ratingBase,
    formatter: (cell, formatterParams, onRendered) => {
        onRendered(function () {
            new Rating({
                target: cell.getElement(),
                props: {
                    data: cell.getData(),
                    type: "artist",
                },
            });
        });
    },
};

/** @type Column */
export let ratingPlaylist = {
    ...ratingBase,
    formatter: (cell, formatterParams, onRendered) => {
        onRendered(function () {
            new Rating({
                target: cell.getElement(),
                props: {
                    data: cell.getData(),
                    type: "playlist",
                },
            });
        });
    },
};

/** @type Column */
export let ratingPodcast = {
    ...ratingBase,
    formatter: (cell, formatterParams, onRendered) => {
        onRendered(function () {
            new Rating({
                target: cell.getElement(),
                props: {
                    data: cell.getData(),
                    type: "podcast",
                },
            });
        });
    },
};

/** @type Column */
export let ratingPodcastEpisode = {
    ...ratingBase,
    formatter: (cell, formatterParams, onRendered) => {
        onRendered(function () {
            new Rating({
                target: cell.getElement(),
                props: {
                    data: cell.getData(),
                    type: "podcast_episode",
                },
            });
        });
    },
};

/*
 COLLECTION PRESETS
 */

/** @type Column[] */
export let songsPreset = [
    checkbox,
    {
        ...actionsBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                let data = cell.getData();
                return new Actions({
                    target: cell.getElement(),
                    props: {
                        type: "song",
                        displayMode: "miniButtons",
                        item: data,
                        data: Object.create({
                            album: data.album ? data.album : null,
                            artists:
                                data.artists?.length > 0 ? data.artists : null,
                            albumArtist: data.albumartist
                                ? data.albumartist
                                : null,
                            playlist: null,
                        }),
                    },
                });
            });
        },
    },
    {
        ...artBase,
        width: 40,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                new Art({
                    target: cell.getElement(),
                    props: {
                        data: cell.getData(),
                        type: "song",
                        size: "small",
                    },
                });
            });
        },
    },
    {
        ...nameBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                new Name({
                    target: cell.getElement(),
                    props: {
                        data: cell.getData(),
                        type: "song",
                    },
                });
            });
        },
    },
    ratingSong,
    artist,
    album,
    date,
    length,
    playCount,
    quality,
    size,
];

/** @type Column[] */
export let albumPreset = [
    checkbox,
    {
        ...actionsBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                let data = cell.getData();
                return new Actions({
                    target: cell.getElement(),
                    props: {
                        type: "song",
                        displayMode: "miniButtons",
                        item: data,
                        data: Object.create({
                            album: data.album ? data.album : null,
                            artists:
                                data.artists?.length > 0 ? data.artists : null,
                            albumArtist: data.albumartist
                                ? data.albumartist
                                : null,
                            playlist: null,
                        }),
                    },
                });
            });
        },
    },
    track,
    {
        ...nameBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                new Name({
                    target: cell.getElement(),
                    props: {
                        data: cell.getData(),
                        type: "song",
                    },
                });
            });
        },
    },
    ratingSong,
    artist,
    length,
    playCount,
    quality,
    size,
];

/** @type Column[] */
export let albumsPreset = [
    checkbox,
    {
        ...actionsBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                let data = cell.getData();
                return new Actions({
                    target: cell.getElement(),
                    props: {
                        type: "album",
                        displayMode: "miniButtons",
                        item: data,
                        showShuffle: true,
                        data: Object.create({
                            album: data.album ? data.album : null,
                            artists:
                                data.artists?.length > 0 ? data.artists : null,
                            albumArtist: data.albumartist
                                ? data.albumartist
                                : null,
                            playlist: null,
                        }),
                    },
                });
            });
        },
    },
    {
        ...artBase,
        width: 40,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                new Art({
                    target: cell.getElement(),
                    props: {
                        data: cell.getData(),
                        type: "song",
                        size: "small",
                    },
                });
            });
        },
    },
    {
        ...nameBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                new Name({
                    target: cell.getElement(),
                    props: {
                        data: cell.getData(),
                        type: "album",
                    },
                });
            });
        },
    },
    ratingAlbum,
    artist,
    date,
    songCount,
    length,
    type,
    genres,
];

/** @type Column[] */
export let artistsPreset = [
    checkbox,
    {
        ...actionsBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                let data = cell.getData();
                return new Actions({
                    target: cell.getElement(),
                    props: {
                        type: "artist",
                        displayMode: "miniButtons",
                        item: data,
                        showShuffle: true,
                        data: Object.create({}),
                    },
                });
            });
        },
    },
    {
        ...artBase,
        width: 40,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                new Art({
                    target: cell.getElement(),
                    props: {
                        data: cell.getData(),
                        type: "artist",
                        size: "small",
                    },
                });
            });
        },
    },
    {
        ...nameBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                new Name({
                    target: cell.getElement(),
                    props: {
                        data: cell.getData(),
                        type: "artist",
                    },
                });
            });
        },
    },
    ratingArtist,
    songCount,
    albumCount,
    length,
    genres,
];

/** @type Column[] */
export let playlistsPreset = [
    checkbox,
    {
        ...actionsBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                let data = cell.getData();
                return new Actions({
                    target: cell.getElement(),
                    props: {
                        type: "playlist",
                        displayMode: "miniButtons",
                        item: data,
                        showShuffle: true,
                        data: Object.create({
                            playlist: data,
                        }),
                    },
                });
            });
        },
    },
    {
        ...nameBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                new Name({
                    target: cell.getElement(),
                    props: {
                        data: cell.getData(),
                        type: "playlist",
                    },
                });
            });
        },
    },
    ratingPlaylist,
    items,
    owner,
    privacy,
];

/** @type Column[] */
export let smartlistsPreset = [
    {
        ...actionsBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                let data = cell.getData();
                return new Actions({
                    target: cell.getElement(),
                    props: {
                        type: "playlist",
                        displayMode: "miniButtons",
                        item: data,
                        showShuffle: true,
                        data: Object.create({}),
                    },
                });
            });
        },
    },
    {
        ...nameBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                new Name({
                    target: cell.getElement(),
                    props: {
                        data: cell.getData(),
                        type: "smartlist",
                    },
                });
            });
        },
    },
    ratingPlaylist,
    items,
    owner,
    privacy,
];

/** @type Column[] */
export let genresPreset = [
    {
        ...actionsBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                let data = cell.getData();
                return new Actions({
                    target: cell.getElement(),
                    props: {
                        type: "genre",
                        displayMode: "miniButtons",
                        data: { id: data.id },
                        showShuffle: true,
                    },
                });
            });
        },
    },
    {
        ...nameBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                new Name({
                    target: cell.getElement(),
                    props: {
                        data: cell.getData(),
                        type: "genre",
                    },
                });
            });
        },
    },
    genreArtistsCount,
    genreAlbumsCount,
    genreSongsCount,
];

/** @type Column[] */
export let liveStreamsPreset = [
    {
        ...actionsBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                let data = cell.getData();
                return new Actions({
                    target: cell.getElement(),
                    props: {
                        type: "live_stream",
                        displayMode: "miniButtons",
                        item: data,
                    },
                });
            });
        },
    },
    {
        ...nameBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                new Name({
                    target: cell.getElement(),
                    props: {
                        data: cell.getData(),
                        type: "live_stream",
                    },
                });
            });
        },
    },
];

/** @type Column[] */
export let podcastsPreset = [
    {
        ...actionsBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                let data = cell.getData();
                return new Actions({
                    target: cell.getElement(),
                    props: {
                        type: "podcast",
                        displayMode: "miniButtons",
                        item: data,
                        showShuffle: true,
                    },
                });
            });
        },
    },
    {
        ...nameBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                new Name({
                    target: cell.getElement(),
                    props: {
                        data: cell.getData(),
                        type: "podcast",
                    },
                });
            });
        },
    },
];

/** @type Column[] */
export let podcastEpisodesPreset = [
    {
        ...actionsBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                let data = cell.getData();
                return new Actions({
                    target: cell.getElement(),
                    props: {
                        type: "podcast_episode",
                        displayMode: "miniButtons",
                        item: data,
                        hidden: data.state !== "completed",
                    },
                });
            });
        },
    },
    {
        ...nameBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                new Name({
                    target: cell.getElement(),
                    props: {
                        data: cell.getData(),
                        type: "podcast_episode",
                    },
                });
            });
        },
    },
    published,
    state,
    length,
    ratingPodcastEpisode,
];
