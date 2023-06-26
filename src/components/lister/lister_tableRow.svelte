<script>
    import { _ } from 'svelte-i18n';
    import { getContext } from 'svelte';

    import { formatTotalTime, formatSongQuality, formatFilesize, cleanArtURL } from '../../logic/helper';

    import { CurrentMedia, TabHistory } from '../../stores/status';
    import { serverURL } from "../../stores/server";

    import SVGUp from "/src/images/keyboard_arrow_up.svg";
    import SVGDown from "/src/images/keyboard_arrow_down.svg";

    export let contextKey;
    export let item;

    import Rating from '../../components/rating.svelte';
    import Actions from '../../components/action/actions.svelte';
    import Genres from '../../components/genre/genres.svelte';
    import ArtistList from '../../components/artist/artistList.svelte';

    import SVGArtist from "/src/images/artist.svg";
    import SVGAlbum from "/src/images/album.svg";
    import SVGSong from "/src/images/music_note.svg";
    import SVGCurrent from "/src/images/play_circle.svg";

    const { _type, visibleColumns, selectedCount, isEditMode, dataDisplay, _showArt } = getContext(contextKey);

    function handleChecked(e) {
        if (e.target.checked) {
            $selectedCount++;
        } else {
            $selectedCount--;
        }
    }

    function handleUp(item) {
        let thisRowIndex = $dataDisplay.findIndex(el => el === item);
        let min = thisRowIndex - 1 < 0 ? 0 : thisRowIndex - 1;

        swapArrayElements($dataDisplay, thisRowIndex, min);

        $dataDisplay = $dataDisplay;
    }

    function handleDown(item) {
        let thisRowIndex = $dataDisplay.findIndex(el => el === item);
        let total = $dataDisplay.length - 1;
        let max = thisRowIndex + 1 > total ? total : thisRowIndex + 1;

        swapArrayElements($dataDisplay, thisRowIndex, max);

        $dataDisplay = $dataDisplay;
    }

    function swapArrayElements(arr, indexA, indexB) {
        let temp = arr[indexA];
        arr[indexA] = arr[indexB];
        arr[indexB] = temp;
    }
</script>

{#each $visibleColumns as col }
    <div class="cell {col.id}"
         data-type={col.type}
         style="width: {col.width}"
    >

        {#if col.id === "checkbox"}
            {#if $isEditMode}
                <span class="reorder">
                    <button type="button" class="icon-button" on:click={e => handleUp(item)}><SVGUp style="transform: scale(1.25)" /></button>
                    <button type="button" class="icon-button" on:click={e => handleDown(item)}><SVGDown style="transform: scale(1.25)" /></button>
                </span>
            {:else}
                <input type="checkbox" bind:checked={item.selected} on:change={e => handleChecked(e)} />
            {/if}
        {/if}

        {#if col.id === "index"}
            {item.initialOrder + 1}
        {/if}

        {#if col.id === "track"}
            {item.track}
        {/if}

        {#if col.id === "name"}
            {#if item.art && $_showArt}
                <img class="image"
                    src="{cleanArtURL(item.art)}&thumb=1"
                    alt=""
                    height="43"
                    width="43"
                    on:error={e => { e.onerror=null; e.target.src=$serverURL + '/image.php?object_id=0&object_type=artist&thumb=22' }}
                />
            {/if}

            {#if $_type === "artist"}
                <a href="#/artists/{item.id}">
                    <span>{item.name}</span>
                </a>
            {:else if $_type === "album"}
                <a href="#/albums/{item.id}">
                    <span>{item.name}</span>
                </a>
            {:else if $_type === "genre"}
                <a href="#/genres/{item.id}">
                    {item.name}
                </a>
            {:else if $_type === "playlist"}
                <a href="#/playlists/{item.id}">
                    {item.name}
                </a>
            {:else if $_type === "smartlist"}
                <a href="#/smartlists/{item.id}">
                    {item.name}
                </a>
            {:else if $_type === "song" || $_type === "playlist_songs"}
                {#if $CurrentMedia?.id === item.id}
                    <span class="current-icon">
                        <SVGCurrent class="icon" />
                    </span>
                {/if}

                <a href="#/song/{item.id}">
                    {item.name}
                </a>
            {/if}
        {/if}

        {#if col.id === "artist"}
            <ArtistList artists={item.artists} />
        {/if}

        {#if col.id === "album"}
            <a href="#/albums/{item.album.id}">
                {item.album.name}
            </a>
        {/if}

        {#if col.id === "date"}
            <a href="#/albums/year/{item.year}">{item.year || $_('text.none')}</a>
        {/if}

        {#if col.id === "length"}
            {formatTotalTime(item.time)}
        {/if}

        {#if col.id === "playCount"}
            <span>{item.playcount}</span>
        {/if}

        {#if col.id === "albumCount"}
            <span>{item.albumcount}</span>
        {/if}

        {#if col.id === "songCount"}
            <span>{item.songcount}</span>
        {/if}

        {#if col.id === "items"}
            <span>{item.items}</span>
        {/if}

        {#if col.id === "type"}
            {#if item.type !== null}
                <span style="text-transform: uppercase">{item.type}</span>
            {/if}
        {/if}

        {#if col.id === "genres"}
            <Genres genres="{item.genre}" />
        {/if}

        {#if col.id === "genreArtistsCount"}
            <a href="#/genres/{item.id}" on:click={() => {$TabHistory['genre'] = 'artists'}}><SVGArtist class="inline" /> {item.artists}</a>
        {/if}

        {#if col.id === "genreAlbumsCount"}
            <a href="#/genres/{item.id}" on:click={() => {$TabHistory['genre'] = 'albums'}}><SVGAlbum class="inline" /> {item.albums}</a>
        {/if}

        {#if col.id === "genreSongsCount"}
            <a href="#/genres/{item.id}" on:click={() => {$TabHistory['genre'] = 'songs'}}><SVGSong class="inline" /> {item.songs}</a>
        {/if}

        {#if col.id === "owner"}
            {item.owner}
        {/if}

        {#if col.id === "privacy"}
            {item.type[0].toUpperCase() + item.type.substring(1)}
        {/if}

        {#if col.id === "count"}
            {item.items} {parseInt(item.items) === 1 ? 'song' : 'songs'}
        {/if}

        {#if col.id === "quality"}
            {formatSongQuality(item)}
        {/if}

        {#if col.id === "size"}
            {formatFilesize(item.size)}
        {/if}

        {#if col.id === "rating"}
            <Rating type={$_type} id="{item.id}" bind:rating="{item.rating}" flag="{item.flag}" averageRating="{item.averagerating}" />
        {/if}

        {#if col.id === "actions"}
            <Actions
                type="{$_type}"
                mode="miniButtons"
                id="{item.id}"
                data={Object.create({
                    album: item.album ? item.album : null,
                    artists: item.artists?.length > 0 ? item.artists : null,
                    albumArtist: item.albumartist ? item.albumartist : null,
                    playlist: ($_type === "playlist" ? item : null)
                })}
            />
        {/if}

    </div>
{/each}

<style>
    .image {
        margin-inline-end: var(--spacing-md);
        margin-inline-start: calc(var(--spacing-md) * -1);
        border-radius: 3px;
    }

    .cell :global(ul) {
        margin: 0;
    }

    .cell :global(.c-actions) {
        line-height: 1;
    }

    .cell :global(.genres) {
        flex-wrap: nowrap;
    }

    :global(.lister-container .header .cell[data-type=number]),
    :global(.lister-container .header .cell[data-type=time]) {
        justify-content: end;
    }

    :global(.lister-container .cell[data-type=number]),
    :global(.lister-container .cell[data-type=time]) {
        justify-content: end;
    }

    .reorder {
        display: flex;
        flex-direction: column;
    }

    .reorder button {
        height: unset;
        padding: 0;
    }
</style>