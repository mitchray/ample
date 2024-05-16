import { capitalize } from "lodash-es";
import ArtistList from "~/components/artist/artistList.svelte";
import Checkbox from "~/components/lister/components/checkbox_row.svelte";
import Name from "~/components/lister/components/name.svelte";
import RelativeDate from "~/components/relativeDate.svelte";
import GenreList from "~/components/genreList.svelte";
import Rating from "~/components/rating/rating.svelte";
import Badge from "~/components/badge.svelte";
import Actions from "~/components/action/actions.svelte";
import {
    formatFilesize,
    formatReleaseType,
    formatSongQuality,
    formatTotalTime,
} from "~/logic/formatters.js";

export const TableDefault = {
    rowSizing: "slim",
    sortBy: undefined,
    sortDirection: "none",
    columnOrder: [],
    hiddenColumns: [],
    canSort: true,
    showArt: true,
};

/** @type {Column} */
export class Column {
    constructor(config = {}) {
        this._cell = null;
        this.id = config.id;
        this.label = config.label || "";
        this.widthPreset = config.widthPreset || undefined;
        this.fixedSize = config.fixedSize || undefined;
        this.type = config.type || undefined;

        this.accessorKey = config.accessorKey;
        this.canSort = config.canSort === undefined ? true : config.canSort;
        this.canResize = config.canResize || false;
        this.canToggle =
            config.canToggle === undefined ? true : config.canToggle;
        this.load = config.load === undefined ? true : config.load;
        this.show = config.show === undefined ? true : config.show;
        this.isNumerical = config.isNumerical || false;
        this.sortBy = config.sortBy || undefined;
        this.fixedWidth = config.fixedWidth || undefined;
        this.ratioWidth = config.ratioWidth || "1fr";
        this.minWidth = config.minWidth || "30px";
        this.displayOrder = config.displayOrder || 0;
    }

    getCell(rowData) {
        return typeof this._cell === "function"
            ? this._cell(rowData)
            : this._cell;
    }

    setCell(newValue) {
        this._cell = newValue;
    }
}

/*
 INDIVIDUAL COLUMNS
 */

/** @type Column */
export let checkbox = {
    id: "checkbox",
    label: "Checkbox",
    widthPreset: "fit",
    fixedSize: true,
    type: "checkbox",
    cell: (data) => ({
        component: Checkbox,
        props: {
            row: data,
        },
    }),
};

/** @type Column */
export let forcedCheckbox = {
    ...checkbox,
    canToggle: false,
};

/** @type Column */
export let index = {
    id: "index",
    label: "№",
    widthPreset: "fit",
    fixedSize: true,
    type: "number",
    sortBy: "initialOrder",
    isNumerical: true,
    cell: (data) => data.initialOrder + 1,
};

/** @type Column */
export let track = {
    id: "track",
    label: "#",
    widthPreset: "fit",
    fixedSize: true,
    type: "number",
    canToggle: true,
    sortBy: "track",
    isNumerical: true,
    cell: (data) => data.track,
};

/** @type Column */
export let artist = {
    id: "artist",
    label: "text.artist",
    widthPreset: "medium",
    sortBy: "artist.name",
    type: "string",
    canToggle: true,
    cell: (data) => ({
        component: ArtistList,
        props: {
            data: data,
        },
    }),
};

/** @type Column */
export let album = {
    id: "album",
    label: "text.album",
    widthPreset: "medium",
    sortBy: "album.name",
    type: "string",
    canToggle: true,
    cell: (data) =>
        `<a href="#/album/${data.album.id}">
            ${data.album.name}
        </a>`,
};

/** @type Column */
export let date = {
    id: "date",
    label: "text.date",
    fixedSize: true,
    sortBy: "year",
    type: "number",
    canToggle: true,
    isNumerical: true,
    cell: (data) => data.year,
};

/** @type Column */
export let items = {
    id: "items",
    label: "text.items",
    fixedSize: true,
    sortBy: "items",
    type: "number",
    canToggle: true,
    isNumerical: true,
    cell: (data) => data.items || "-",
};

/** @type Column */
export let songCount = {
    id: "songCount",
    label: "text.songs",
    fixedSize: true,
    sortBy: "songcount",
    type: "number",
    canToggle: true,
    isNumerical: true,
    cell: (data) => data.songcount || "-",
};

/** @type Column */
export let albumCount = {
    id: "albumCount",
    label: "text.releases",
    fixedSize: true,
    sortBy: "albumcount",
    type: "number",
    canToggle: true,
    isNumerical: true,
    cell: (data) => data.albumcount || "-",
};

/** @type Column */
export let length = {
    id: "length",
    label: "text.length",
    fixedSize: true,
    sortBy: "time",
    type: "time",
    canToggle: true,
    isNumerical: true,
    cell: (data) => formatTotalTime(data.time),
};

/** @type Column */
export let count = {
    id: "count",
    label: "text.count",
    fixedSize: true,
    sortBy: "count",
    type: "number",
    canToggle: true,
    isNumerical: true,
    cell: (data) =>
        `${data.items} ${parseInt(data.items) === 1 ? "song" : "songs"}`,
};

/** @type Column */
export let type = {
    id: "type",
    label: "text.type",
    widthPreset: "small",
    sortBy: "type",
    type: "string",
    canToggle: true,
    cell: (data) => ({
        component: Badge,
        props: {
            text: formatReleaseType(data.type),
        },
    }),
};

/** @type Column */
export let genreArtistsCount = {
    id: "genreArtistsCount",
    label: "text.artists",
    fixedSize: true,
    sortBy: "artists",
    type: "number",
    canToggle: true,
    isNumerical: true,
    cell: (data) =>
        `<a href="#/genre/${data.id}">
            <MaterialSymbol name="artist" />
            ${data.artists}
        </a>`,
};

/** @type Column */
export let genreAlbumsCount = {
    id: "genreAlbumsCount",
    label: "text.albums",
    fixedSize: true,
    sortBy: "albums",
    type: "number",
    canToggle: true,
    isNumerical: true,
    cell: (data) =>
        `<a href="#/genre/${data.id}">
            <MaterialSymbol name="album" />
            ${data.albums}
        </a>`,
};

/** @type Column */
export let genreSongsCount = {
    id: "genreSongsCount",
    label: "text.songs",
    fixedSize: true,
    sortBy: "songs",
    type: "number",
    canToggle: true,
    isNumerical: true,
    cell: (data) =>
        `<a href="#/genre/${data.id}">
            <MaterialSymbol name="music_note" />
            ${data.songs}
        </a>`,
};

/** @type Column */
export let genres = {
    id: "genres",
    label: "text.genres",
    widthPreset: "medium",
    type: "string",
    canToggle: true,
    cell: (data) => ({
        component: GenreList,
        props: {
            items: data.genre,
            limit: 1,
        },
    }),
};

/** @type Column */
export let owner = {
    id: "owner",
    label: "text.owner",
    widthPreset: "small",
    sortBy: "owner",
    type: "string",
    canToggle: true,
    cell: (data) => data.owner,
};

/** @type Column */
export let privacy = {
    id: "privacy",
    label: "text.privacy",
    widthPreset: "small",
    sortBy: "privacy",
    type: "string",
    canToggle: true,
    cell: (data) => capitalize(data.type),
};

/** @type Column */
export let playCount = {
    id: "playCount",
    label: "text.plays",
    fixedSize: true,
    sortBy: "playcount",
    type: "number",
    canToggle: true,
    isNumerical: true,
    cell: (data) => data.playcount || "-",
};

/** @type Column */
export let quality = {
    id: "quality",
    label: "text.quality",
    fixedSize: true,
    type: "string",
    canToggle: true,
    cell: (data) => formatSongQuality(data),
};

/** @type Column */
export let size = {
    id: "size",
    label: "text.size",
    fixedSize: true,
    type: "number",
    sortBy: "size",
    canToggle: true,
    isNumerical: true,
    cell: (data) => formatFilesize(data.size),
};

/** @type Column */
export let state = {
    id: "state",
    label: "text.state",
    fixedSize: true,
    type: "string",
    canToggle: true,
    cell: (data) => data.state,
};

/** @type Column */
export let published = {
    id: "published",
    label: "text.published",
    widthPreset: "medium",
    type: "date",
    canToggle: true,
    cell: (data) => ({
        component: RelativeDate,
        props: {
            date: data.pubdate,
        },
    }),
};

/** @type Column */
let ratingBase = {
    id: "rating",
    label: "text.rating",
    widthPreset: "rating",
    fixedSize: true,
    sortBy: "rating",
    type: "rating",
    canToggle: true,
};

/** @type Column */
export let ratingSong = {
    ...ratingBase,
    cell: (data) => ({
        component: Rating,
        props: {
            data: data,
            type: "song",
        },
    }),
};

/** @type Column */
export let ratingAlbum = {
    ...ratingBase,
    cell: (data) => ({
        component: Rating,
        props: {
            data: data,
            type: "album",
        },
    }),
};

/** @type Column */
export let ratingArtist = {
    ...ratingBase,
    cell: (data) => ({
        component: Rating,
        props: {
            data: data,
            type: "artist",
        },
    }),
};

/** @type Column */
export let ratingPlaylist = {
    ...ratingBase,
    cell: (data) => ({
        component: Rating,
        props: {
            data: data,
            type: "playlist",
        },
    }),
};

/** @type Column */
export let ratingPodcast = {
    ...ratingBase,
    cell: (data) => ({
        component: Rating,
        props: {
            data: data,
            type: "podcast",
        },
    }),
};

/** @type Column */
export let ratingPodcastEpisode = {
    ...ratingBase,
    cell: (data) => ({
        component: Rating,
        props: {
            data: data,
            type: "podcast_episode",
        },
    }),
};

/** @type Column */
export let actions = {
    id: "actions",
    label: "text.actions",
    widthPreset: "actions",
    fixedSize: true,
    show: true,
    canToggle: false,
};

/*
 COLLECTION PRESETS
 */

/** @type Column[] */
export let songsPreset = [
    {
        id: "actions",
        label: "text.actions",
        widthPreset: "actions",
        fixedSize: true,
        show: true,
        canToggle: false,
        cell: (data) => ({
            component: Actions,
            props: {
                type: "song",
                displayMode: "miniButtons",
                item: data,
                data: Object.create({
                    album: data.album ? data.album : null,
                    artists: data.artists?.length > 0 ? data.artists : null,
                    albumArtist: data.albumartist ? data.albumartist : null,
                    playlist: null,
                }),
            },
        }),
    },
    {
        id: "name",
        label: "text.name",
        widthPreset: "large",
        sortBy: "name",
        type: "string",
        show: true,
        canToggle: false,
        cell: (data) => ({
            component: Name,
            props: {
                data: data,
                type: "song",
            },
        }),
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
    {
        id: "actions",
        label: "text.actions",
        widthPreset: "actions",
        fixedSize: true,
        show: true,
        canToggle: false,
        cell: (data) => ({
            component: Actions,
            props: {
                type: "song",
                displayMode: "miniButtons",
                item: data,
                data: Object.create({
                    album: data.album ? data.album : null,
                    artists: data.artists?.length > 0 ? data.artists : null,
                    albumArtist: data.albumartist ? data.albumartist : null,
                    playlist: null,
                }),
            },
        }),
    },
    track,
    {
        id: "name",
        label: "text.name",
        widthPreset: "large",
        sortBy: "name",
        type: "string",
        show: true,
        canToggle: false,
        cell: (data) => ({
            component: Name,
            props: {
                data: data,
                type: "song",
            },
        }),
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
    {
        id: "actions",
        label: "text.actions",
        widthPreset: "actions",
        fixedSize: true,
        show: true,
        canToggle: false,
        cell: (data) => ({
            component: Actions,
            props: {
                type: "album",
                displayMode: "miniButtons",
                item: data,
                showShuffle: true,
                data: Object.create({
                    album: data.album ? data.album : null,
                    artists: data.artists?.length > 0 ? data.artists : null,
                    albumArtist: data.albumartist ? data.albumartist : null,
                    playlist: null,
                }),
            },
        }),
    },
    {
        id: "name",
        label: "text.name",
        widthPreset: "large",
        sortBy: "name",
        type: "string",
        show: true,
        canToggle: false,
        cell: (data) => ({
            component: Name,
            props: {
                data: data,
                type: "album",
            },
        }),
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
    {
        id: "actions",
        label: "text.actions",
        widthPreset: "actions",
        fixedSize: true,
        show: true,
        canToggle: false,
        cell: (data) => ({
            component: Actions,
            props: {
                type: "artist",
                displayMode: "miniButtons",
                item: data,
                showShuffle: true,
                data: Object.create({}),
            },
        }),
    },
    {
        id: "name",
        label: "text.name",
        widthPreset: "large",
        sortBy: "name",
        type: "string",
        show: true,
        canToggle: false,
        cell: (data) => ({
            component: Name,
            props: {
                data: data,
                type: "artist",
            },
        }),
    },
    ratingArtist,
    songCount,
    albumCount,
    length,
    genres,
];

/** @type Column[] */
export let playlistsPreset = [
    {
        id: "actions",
        label: "text.actions",
        widthPreset: "actions",
        fixedSize: true,
        show: true,
        canToggle: false,
        cell: (data) => ({
            component: Actions,
            props: {
                type: "playlist",
                displayMode: "miniButtons",
                item: data,
                showShuffle: true,
                data: Object.create({
                    playlist: data,
                }),
            },
        }),
    },
    {
        id: "name",
        label: "text.name",
        widthPreset: "large",
        sortBy: "name",
        type: "string",
        show: true,
        canToggle: false,
        cell: (data) => ({
            component: Name,
            props: {
                data: data,
                type: "playlist",
            },
        }),
    },
    ratingPlaylist,
    items,
    owner,
    privacy,
];

/** @type Column[] */
export let smartlistsPreset = [
    {
        id: "actions",
        label: "text.actions",
        widthPreset: "actions",
        fixedSize: true,
        show: true,
        canToggle: false,
        cell: (data) => ({
            component: Actions,
            props: {
                type: "playlist",
                displayMode: "miniButtons",
                item: data,
                showShuffle: true,
                data: Object.create({}),
            },
        }),
    },
    {
        id: "name",
        label: "text.name",
        widthPreset: "large",
        sortBy: "name",
        type: "string",
        show: true,
        canToggle: false,
        cell: (data) => ({
            component: Name,
            props: {
                data: data,
                type: "smartlist",
            },
        }),
    },
    items,
    owner,
    privacy,
];

/** @type Column[] */
export let genresPreset = [
    {
        id: "actions",
        label: "text.actions",
        widthPreset: "actions",
        fixedSize: true,
        show: true,
        canToggle: false,
        cell: (data) => ({
            component: Actions,
            props: {
                type: "genre",
                displayMode: "miniButtons",
                item: data,
                showShuffle: true,
            },
        }),
    },
    {
        id: "name",
        label: "text.name",
        widthPreset: "large",
        sortBy: "name",
        type: "string",
        show: true,
        canToggle: false,
        cell: (data) => ({
            component: Name,
            props: {
                data: data,
                type: "genre",
            },
        }),
    },
    genreArtistsCount,
    genreAlbumsCount,
    genreSongsCount,
];

/** @type Column[] */
export let liveStreamsPreset = [
    {
        id: "actions",
        label: "text.actions",
        widthPreset: "actions",
        fixedSize: true,
        show: true,
        canToggle: false,
        cell: (data) => ({
            component: Actions,
            props: {
                type: "live_stream",
                displayMode: "miniButtons",
                item: data,
            },
        }),
    },
    {
        id: "name",
        label: "text.name",
        widthPreset: "large",
        sortBy: "name",
        type: "string",
        show: true,
        canToggle: false,
        cell: (data) => ({
            component: Name,
            props: {
                data: data,
                type: "live_stream",
            },
        }),
    },
];

/** @type Column[] */
export let podcastsPreset = [
    {
        id: "actions",
        label: "text.actions",
        widthPreset: "actions",
        fixedSize: true,
        show: true,
        canToggle: false,
        cell: (data) => ({
            component: Actions,
            props: {
                type: "podcast",
                displayMode: "miniButtons",
                item: data,
                showShuffle: true,
            },
        }),
    },
    {
        id: "name",
        label: "text.name",
        widthPreset: "large",
        sortBy: "name",
        type: "string",
        show: true,
        canToggle: false,
        cell: (data) => ({
            component: Name,
            props: {
                data: data,
                type: "podcast",
            },
        }),
    },
];

/** @type Column[] */
export let podcastEpisodesPreset = [
    {
        id: "actions",
        label: "text.actions",
        widthPreset: "actions",
        fixedSize: true,
        show: true,
        canToggle: false,
        cell: (data) => ({
            component: Actions,
            props: {
                type: "podcast_episode",
                displayMode: "miniButtons",
                item: data,
                hidden: data.state !== "completed",
            },
        }),
    },
    {
        id: "name",
        label: "text.name",
        widthPreset: "xl",
        sortBy: "name",
        type: "string",
        show: true,
        canToggle: false,
        cell: (data) => ({
            component: Name,
            props: {
                data: data,
                type: "podcast_episode",
            },
        }),
    },
    published,
    state,
    length,
    ratingPodcastEpisode,
];

/** @typedef {import('svelte').SvelteComponent} SvelteComponent */

/**
 * @typedef {object} Column
 * @property {string} id
 * @property {string} [accessorKey] - Pull data from this object property; else 'id' will be used. Also used as default sort source.
 * @property {string|function(component: SvelteComponent, props: Object)} [label=""] - Heading to display.
 * @property {string|function(component: SvelteComponent, props: Object)} [cell=""] - Contents of the row cell of this column.
 * @property {boolean} [canSort=true] - Can sort column.
 * @property {boolean} [canResize=false] - Can resize column.
 * @property {boolean} [canToggle=true] - Can toggle display of column.
 * @property {boolean} [load=true] - Load data in this column (persists).
 * @property {boolean} [show=true] - Visibility of column (temporary).
 * @property {boolean} [isNumerical=false] - Data is a number (so right align).
 * @property {string} [minWidth="24px"] - Min width of column as CSS unit.
 * @property {string} [maxWidth=`${Number.MAX_SAFE_INTEGER}px`] - Max width of column as CSS unit.
 * @property {number} [displayOrder=0] - Order of column.
 */
