const columns = [
    {
        id: "checkbox",
        label: "",
        widthPreset: "fit",
        fixedSize: true,
        type: "checkbox",
        show: false,
        alwaysShow: true,
        object_types: [
            { id: "song" },
            { id: "album" },
            { id: "artist" },
            { id: "playlist" }
        ]
    },
    {
        id: "index",
        label: "#",
        widthPreset: "fit",
        fixedSize: true,
        type: "number",
        sortable: true,
        sortBy: "initialOrder",
        show: false,
        alwaysShow: true,
        object_types: [
            { id: "song" },
            { id: "playlist" }
        ],
    },
    {
        id: "art",
        label: "Art",
        widthPreset: "art",
        fixedSize: true,
        type: "image",
        show: true,
        object_types: [
            { id: "song" },
            { id: "album" },
            { id: "artist" },
            { id: "playlist" }
        ]
    },
    {
        id: "name",
        label: "Name",
        widthPreset: "large",
        sortable: true,
        sortBy: "name",
        type: "string",
        show: true,
        alwaysShow: true,
        object_types: [
            { id: "song" },
            { id: "album" },
            { id: "artist", widthPreset: "medium" },
            { id: "playlist" },
            { id: "genre", widthPreset: "medium" }
        ],
    },
    {
        id: "artist",
        label: "Artist",
        widthPreset: "medium",
        sortable: true,
        sortBy: "artist.name",
        type: "string",
        show: true,
        object_types: [
            { id: "song" },
            { id: "album" }
        ]
    },
    {
        id: "album",
        label: "Album",
        widthPreset: "medium",
        sortable: true,
        sortBy: "album.name",
        type: "string",
        show: true,
        object_types: [
            { id: "song" }
        ]
    },
    {
        id: "date",
        label: "Date",
        fixedSize: true,
        sortable: true,
        sortBy: "year",
        type: "number",
        show: true,
        object_types: [
            { id: "song" },
            { id: "album" }
        ]
    },
    {
        id: "songCount",
        label: "Songs",
        fixedSize: true,
        sortable: true,
        sortBy: "songcount",
        type: "number",
        show: true,
        object_types: [
            { id: "album" },
            { id: "artist" },
            { id: "playlist", sortBy: "count", label: "Count" }
        ],
    },
    {
        id: "albumCount",
        label: "Releases",
        fixedSize: true,
        sortable: true,
        sortBy: "albumcount",
        type: "number",
        show: true,
        object_types: [
            { id: "artist" }
        ],
    },
    {
        id: "length",
        label: "Length",
        fixedSize: true,
        sortable: true,
        sortBy: "time",
        type: "time",
        show: true,
        object_types: [
            { id: "song" },
            { id: "album" },
            { id: "artist" }
        ]
    },
    {
        id: "type",
        label: "Type",
        widthPreset: "small",
        sortable: true,
        sortBy: "type",
        type: "string",
        show: true,
        object_types: [
            { id: "album" }
        ]
    },
    {
        id: "genreArtistsCount",
        label: "Artists",
        fixedSize: true,
        sortable: true,
        sortBy: "artists",
        type: "number",
        show: true,
        object_types: [
            { id: "genre" }
        ],
    },
    {
        id: "genreAlbumsCount",
        label: "Albums",
        fixedSize: true,
        sortable: true,
        sortBy: "albums",
        type: "number",
        show: true,
        object_types: [
            { id: "genre" }
        ],
    },
    {
        id: "genreSongsCount",
        label: "Songs",
        fixedSize: true,
        sortable: true,
        sortBy: "songs",
        type: "number",
        show: true,
        object_types: [
            { id: "genre" }
        ],
    },
    {
        id: "genres",
        label: "Genres",
        widthPreset: "medium",
        type: "string",
        show: true,
        object_types: [
            { id: "album" },
            { id: "artist" }
        ],
    },
    {
        id: "owner",
        label: "Owner",
        widthPreset: "small",
        sortable: true,
        sortBy: "owner",
        type: "string",
        show: true,
        object_types: [
            { id: "playlist" }
        ]
    },
    {
        id: "privacy",
        label: "Privacy",
        widthPreset: "small",
        sortable: true,
        sortBy: "privacy",
        type: "string",
        show: true,
        object_types: [
            { id: "playlist" }
        ]
    },
    {
        id: "playCount",
        label: "Plays",
        fixedSize: true,
        sortable: true,
        sortBy: "playcount",
        type: "number",
        show: true,
        object_types: [
            { id: "song" }
        ]
    },
    {
        id: "quality",
        label: "Quality",
        fixedSize: true,
        type: "string",
        show: true,
        object_types: [
            { id: "song" }
        ]
    },
    {
        id: "size",
        label: "Size",
        fixedSize: true,
        type: "number",
        sortable: true,
        sortBy: "size",
        show: true,
        object_types: [
            { id: "song" }
        ]
    },
    {
        id: "rating",
        label: "Rating",
        widthPreset: "rating",
        fixedSize: true,
        sortable: true,
        sortBy: "rating",
        type: "rating",
        show: true,
        object_types: [
            { id: "song" },
            { id: "album" },
            { id: "artist" },
            { id: "playlist" }
        ],
    },
    {
        id: "actions",
        label: "",
        widthPreset: "actions",
        fixedSize: true,
        show: true,
        alwaysShow: true,
        object_types: [
            { id: "song" },
            { id: "album" },
            { id: "artist" },
            { id: "playlist" }
        ],
    },
];

export { columns };