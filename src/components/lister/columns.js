const columns = {
    genre: [
        {
            id: "name",
            label: "Name",
            widthPreset: "large",
            sortable: true,
            sortBy: "name",
            type: "string",
            show: true
        },
        {
            id: "artistsCount",
            label: "Artists",
            widthPreset: "small",
            sortable: true,
            sortBy: "artists",
            type: "number",
            show: true
        },
        {
            id: "albumsCount",
            label: "Albums",
            widthPreset: "small",
            sortable: true,
            sortBy: "albums",
            type: "number",
            show: true
        },
        {
            id: "songsCount",
            label: "Songs",
            widthPreset: "small",
            sortable: true,
            sortBy: "songs",
            type: "number",
            show: true
        },
    ],
    song: [
        {
            id: "index",
            label: "#",
            widthPreset: "fit",
            fixedSize: true,
            type: "number",
            sortable: true,
            sortBy: "initialOrder",
            show: false
        },
        {
            id: "checkbox",
            label: "",
            widthPreset: "fit",
            fixedSize: true,
            type: "checkbox",
            show: false
        },
        {
            id: "art",
            label: "",
            widthPreset: "art",
            fixedSize: true,
            type: "image",
            show: true
        },
        {
            id: "name",
            label: "Name",
            widthPreset: "large",
            sortable: true,
            sortBy: "name",
            type: "string",
            show: true
        },
        {
            id: "artist",
            label: "Artist",
            widthPreset: "medium",
            sortable: true,
            sortBy: "artist.name",
            type: "string",
            show: true
        },
        {
            id: "album",
            label: "Album",
            widthPreset: "medium",
            sortable: true,
            sortBy: "album.name",
            type: "string",
            show: true
        },
        {
            id: "date",
            label: "Date",
            fixedSize: true,
            sortable: true,
            sortBy: "year",
            type: "number",
            show: true
        },
        {
            id: "length",
            label: "Time",
            fixedSize: true,
            sortable: true,
            sortBy: "time",
            type: "time",
            show: true
        },
        {
            id: "rating",
            label: "Rating",
            widthPreset: "rating",
            fixedSize: true,
            sortable: true,
            sortBy: "rating",
            type: "rating",
            show: true
        },
        {
            id: "actions",
            label: "",
            widthPreset: "actions",
            fixedSize: true,
            show: true
        },
    ],
    album: [
        {
            id: "checkbox",
            label: "",
            widthPreset: "fit",
            fixedSize: true,
            type: "checkbox",
            show: false
        },
        {
            id: "art",
            label: "",
            widthPreset: "art",
            fixedSize: true,
            type: "image",
            show: true
        },
        {
            id: "name",
            label: "Name",
            widthPreset: "medium",
            sortable: true,
            sortBy: "name",
            type: "string",
            show: true
        },
        {
            id: "artist",
            label: "Artist",
            widthPreset: "medium",
            sortable: true,
            sortBy: "artist.name",
            type: "string",
            show: true
        },
        {
            id: "date",
            label: "Date",
            fixedSize: true,
            sortable: true,
            sortBy: "year",
            type: "number",
            show: true
        },
        {
            id: "songCount",
            label: "Songs",
            fixedSize: true,
            sortable: true,
            sortBy: "songcount",
            type: "number",
            show: true
        },
        {
            id: "genres",
            label: "Genres",
            widthPreset: "medium",
            type: "string",
            show: true
        },
        {
            id: "rating",
            label: "Rating",
            widthPreset: "rating",
            fixedSize: true,
            sortable: true,
            sortBy: "rating",
            type: "rating",
            show: true
        },
        {
            id: "actions",
            label: "",
            widthPreset: "actions",
            fixedSize: true,
            show: true
        },
    ],
    artist: [
        {
            id: "checkbox",
            label: "",
            widthPreset: "fit",
            fixedSize: true,
            type: "checkbox",
            show: false
        },
        {
            id: "art",
            label: "",
            widthPreset: "art",
            fixedSize: true,
            type: "image",
            show: true
        },
        {
            id: "name",
            label: "Name",
            widthPreset: "medium",
            sortable: true,
            sortBy: "name",
            type: "string",
            show: true
        },
        {
            id: "albumCount",
            label: "Releases",
            fixedSize: true,
            sortable: true,
            sortBy: "albumcount",
            type: "number",
            show: true
        },
        {
            id: "songCount",
            label: "Songs",
            fixedSize: true,
            sortable: true,
            sortBy: "songcount",
            type: "number",
            show: true
        },
        {
            id: "genres",
            label: "Genres",
            widthPreset: "medium",
            type: "string",
            show: true
        },
        {
            id: "rating",
            label: "Rating",
            widthPreset: "rating",
            fixedSize: true,
            sortable: true,
            sortBy: "rating",
            type: "rating",
            show: true
        },
        {
            id: "actions",
            label: "",
            widthPreset: "actions",
            fixedSize: true,
            show: true
        },
    ],
    playlist: [
        {
            id: "index",
            label: "#",
            widthPreset: "fit",
            fixedSize: true,
            type: "number",
            sortable: true,
            sortBy: "initialOrder",
            show: false
        },
        {
            id: "checkbox",
            label: "",
            widthPreset: "fit",
            fixedSize: true,
            type: "checkbox",
            show: false
        },
        {
            id: "art",
            label: "",
            widthPreset: "art",
            fixedSize: true,
            type: "image",
            show: true
        },
        {
            id: "name",
            label: "Name",
            widthPreset: "medium",
            sortable: true,
            sortBy: "name",
            type: "string",
            show: true
        },
        {
            id: "owner",
            label: "Owner",
            widthPreset: "small",
            sortable: true,
            sortBy: "owner",
            type: "string",
            show: true
        },
        {
            id: "privacy",
            label: "Privacy",
            widthPreset: "small",
            sortable: true,
            sortBy: "privacy",
            type: "string",
            show: true
        },
        {
            id: "count",
            label: "Count",
            widthPreset: "small",
            sortable: true,
            sortBy: "count",
            type: "number",
            show: true
        },
        {
            id: "rating",
            label: "Rating",
            widthPreset: "rating",
            fixedSize: true,
            sortable: true,
            sortBy: "rating",
            type: "rating",
            show: false
        },
        {
            id: "actions",
            label: "",
            widthPreset: "actions",
            fixedSize: true,
            show: true
        },
    ],
};

export { columns };