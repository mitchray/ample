/**
 * Sort genres alphabetically
 * @param {array} genres
 * @returns {*}
 */
export const sortGenresByName = (genres) => {
    return genres.sort(function(obj1, obj2) { return obj1.name.localeCompare(obj2.name) })
}

/**
 * Sort genres by artists count
 * @param {array} genres
 * @returns {*}
 */
export const sortGenresByArtists = (genres) => {
    return genres.sort(function(obj1, obj2) { return obj1.artists < obj2.artists })
}

/**
 * Sort genres by albums count
 * @param {array} genres
 * @returns {*}
 */
export const sortGenresByAlbums = (genres) => {
    return genres.sort(function(obj1, obj2) { return obj1.albums < obj2.albums })
}

/**
 * Sort genres by songs count
 * @param {array} genres
 * @returns {*}
 */
export const sortGenresBySongs = (genres) => {
    return genres.sort(function(obj1, obj2) { return obj1.songs < obj2.songs })
}