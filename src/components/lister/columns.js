import ArtistList from "~/components/artist/artistList.svelte";
import Name from "~/components/lister/components/name.svelte";
import Privacy from "~/components/privacy.svelte";
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
import { mount } from "svelte";

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
    sorter: "number",
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
    formatter: (cell, formatterParams, onRendered) => {
        onRendered(function () {
            mount(ArtistList, {
                target: cell.getElement(),
                props: {
                    data: cell.getData(),
                },
            });
        });
    },
    sorter: function (a, b, aRow, bRow, column, dir, sorterParams) {
        const artistA = a[0].name.toLowerCase();
        const artistB = b[0].name.toLowerCase();

        if (artistA < artistB) {
            return -1;
        }
        if (artistA > artistB) {
            return 1;
        }

        // If the first artist is the same, compare subsequent artists
        const length = Math.min(a.length, b.length);
        for (let i = 1; i < length; i++) {
            const nextArtistA = a[i].name.toLowerCase();
            const nextArtistB = b[i].name.toLowerCase();

            if (nextArtistA < nextArtistB) {
                return -1;
            }
            if (nextArtistA > nextArtistB) {
                return 1;
            }
        }

        // If all compared artists are the same and one list is longer, the shorter list comes first
        return a.length - b.length;
    },
};

/** @type Column */
export let album = {
    field: "album.name",
    title: "Album",
    width: 200,
    formatter: (cell, formatterParams, onRendered) => {
        const data = cell.getData();
        return `<a href="#/album/${data.album.id}" class="truncate">
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
export let releaseType = {
    field: "type",
    title: "Type",
    formatter: (cell, formatterParams, onRendered) => {
        onRendered(function () {
            return mount(Badge, {
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
    headerSort: false,
    formatter: (cell, formatterParams, onRendered) => {
        onRendered(function () {
            mount(GenreList, {
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
    formatter: (cell, formatterParams, onRendered) => {
        onRendered(function () {
            mount(Privacy, {
                target: cell.getElement(),
                props: {
                    type: cell.getData().type,
                },
            });
        });
    },
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
    headerSort: false,
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
            mount(RelativeDate, {
                target: cell.getElement(),
                props: {
                    date: cell.getData().pubdate,
                },
            });
        });
    },
};

/** @type Column */
export let creationDate = {
    field: "creation_date",
    title: "Created",
    formatter: (cell, formatterParams, onRendered) => {
        onRendered(function () {
            mount(RelativeDate, {
                target: cell.getElement(),
                props: {
                    date: cell.getValue() * 1000,
                },
            });
        });
    },
};

/** @type Column */
export let allowStream = {
    field: "allow_stream",
    title: "Streaming",
    formatter: (cell) => (cell.getValue() ? "Yes" : "No"),
    hozAlign: "center",
};

/** @type Column */
export let allowDownload = {
    field: "allow_download",
    title: "Download",
    formatter: (cell) => (cell.getValue() ? "Yes" : "No"),
    hozAlign: "center",
};

/** @type Column */
export let expireDays = {
    field: "expire_days",
    title: "Duration",
    sorter: "number",
    hozAlign: "right",
    headerHozAlign: "right",
    formatter: (cell) => cell.getValue() + " days" || "Forever",
};

/** @type Column */
export let maxCounter = {
    field: "max_counter",
    title: "Max Visits",
    sorter: "number",
    hozAlign: "right",
    headerHozAlign: "right",
    formatter: (cell) => cell.getValue() || "Unlimited",
};

/** @type Column */
export let counter = {
    field: "counter",
    title: "Visits",
    sorter: "number",
    hozAlign: "right",
    headerHozAlign: "right",
};

/** @type Column */
export let publicUrl = {
    field: "public_url",
    title: "Public URL",
    formatter: (cell) =>
        `<a href="${cell.getValue()}" target="_blank" rel="noopener noreferrer">${cell.getValue()}</a>`,
    width: 300,
};

/** @type Column */
export let ratingSong = {
    ...ratingBase,
    formatter: (cell, formatterParams, onRendered) => {
        onRendered(function () {
            mount(Rating, {
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
            mount(Rating, {
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
            mount(Rating, {
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
            mount(Rating, {
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
            mount(Rating, {
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
            mount(Rating, {
                target: cell.getElement(),
                props: {
                    data: cell.getData(),
                    type: "podcast_episode",
                },
            });
        });
    },
};

/** @type Column */
export let description = {
    field: "description",
    title: "Description",
    width: 200,
    formatter: (cell, formatterParams, onRendered) => cell.getValue() || "-",
};

/** @type Column */
export let lastVisitDate = {
    field: "lastvisit_date",
    title: "Last Visited",
    width: 300,
    formatter: (cell, formatterParams, onRendered) => {
        const value = cell.getValue();
        if (value === 0) {
            return "-";
        }
        onRendered(function () {
            mount(RelativeDate, {
                target: cell.getElement(),
                props: {
                    date: value * 1000,
                },
            });
        });
    },
};

/** @type Column */
export let shareType = {
    field: "object_type",
    title: "Type",
    formatter: (cell, formatterParams, onRendered) => cell.getValue() || "-",
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
                return mount(Actions, {
                    target: cell.getElement(),
                    props: {
                        type: "song",
                        displayMode: "miniButtons",
                        item: data,
                        hoist: true,
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
                mount(Art, {
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
                mount(Name, {
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
                return mount(Actions, {
                    target: cell.getElement(),
                    props: {
                        type: "song",
                        displayMode: "miniButtons",
                        item: data,
                        hoist: true,
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
                mount(Name, {
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
                return mount(Actions, {
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
                mount(Art, {
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
                mount(Name, {
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
    releaseType,
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
                return mount(Actions, {
                    target: cell.getElement(),
                    props: {
                        type: "artist",
                        displayMode: "miniButtons",
                        item: data,
                        hoist: true,
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
                mount(Art, {
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
                mount(Name, {
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
                return mount(Actions, {
                    target: cell.getElement(),
                    props: {
                        type: "playlist",
                        displayMode: "miniButtons",
                        item: data,
                        hoist: true,
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
                mount(Name, {
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
    checkbox,
    {
        ...actionsBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                let data = cell.getData();
                return mount(Actions, {
                    target: cell.getElement(),
                    props: {
                        type: "playlist",
                        displayMode: "miniButtons",
                        item: data,
                        hoist: true,
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
                mount(Name, {
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
                return mount(Actions, {
                    target: cell.getElement(),
                    props: {
                        type: "genre",
                        displayMode: "miniButtons",
                        data: { id: data.id },
                        showShuffle: true,
                        hoist: true,
                    },
                });
            });
        },
    },
    {
        ...nameBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                mount(Name, {
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
                return mount(Actions, {
                    target: cell.getElement(),
                    props: {
                        type: "live_stream",
                        displayMode: "miniButtons",
                        item: data,
                        hoist: true,
                    },
                });
            });
        },
    },
    {
        ...nameBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                mount(Name, {
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
                return mount(Actions, {
                    target: cell.getElement(),
                    props: {
                        type: "podcast",
                        displayMode: "miniButtons",
                        item: data,
                        showShuffle: true,
                        hoist: true,
                    },
                });
            });
        },
    },
    {
        ...nameBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                mount(Name, {
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
                return mount(Actions, {
                    target: cell.getElement(),
                    props: {
                        type: "podcast_episode",
                        displayMode: "miniButtons",
                        item: data,
                        hoist: true,
                        hideDefaultActions: data.state !== "completed",
                    },
                });
            });
        },
    },
    {
        ...nameBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                mount(Name, {
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

/** @type Column[] */
export let sharesPreset = [
    {
        ...actionsBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                let data = cell.getData();
                return mount(Actions, {
                    target: cell.getElement(),
                    props: {
                        type: "share",
                        displayMode: "miniButtons",
                        item: data,
                        hideDefaultActions: true,
                        hoist: true,
                    },
                });
            });
        },
        minWidth: 80,
    },
    {
        ...nameBase,
        formatter: (cell, formatterParams, onRendered) => {
            onRendered(function () {
                mount(Name, {
                    target: cell.getElement(),
                    props: {
                        data: cell.getData(),
                        type: "share",
                    },
                });
            });
        },
    },
    description,
    shareType,
    owner,
    creationDate,
    lastVisitDate,
    allowStream,
    allowDownload,
    expireDays,
    maxCounter,
    counter,
    publicUrl,
];
