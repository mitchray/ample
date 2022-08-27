<script>
    import { getContext } from 'svelte';
    import { Link } from 'svelte-routing';

    import { formatTotalTime, formatSongQuality, formatFilesize } from '../../logic/helper';

    import { CurrentSong } from '../../stores/status';

    import SVGUp from "../../../public/images/keyboard_arrow_up.svg";
    import SVGDown from "../../../public/images/keyboard_arrow_down.svg";

    export let contextKey;
    export let item;

    import Rating from '../../components/rating.svelte';
    import Actions from '../../components/actions.svelte';
    import Genres from '../../components/genre/genres.svelte';

    import SVGArtist from "../../../public/images/artist.svg";
    import SVGAlbum from "../../../public/images/album.svg";
    import SVGSong from "../../../public/images/music_note.svg";
    import SVGYear from "../../../public/images/year.svg";
    import SVGGenre from "../../../public/images/label.svg";
    import SVGCurrent from "../../../public/images/play_circle.svg";

    const { getType, visibleColumns, selectedCount, isEditMode, dataDisplay } = getContext(contextKey);

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
    <div class="cell {col.id}" data-type={col.type}>

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
            {#if item.art}
                <img class="image" src="{item.art}&thumb=1" alt="" height="50" width="50"/>
            {/if}

            {#if getType() === "artist"}
                <Link to="artists/{item.id}">
                    <span>{item.name}</span>
                </Link>
            {:else if getType() === "album"}
                <Link to="albums/{item.id}">
                    <span>{item.name}</span>
                </Link>
            {:else if getType() === "genre"}
                <Link to="genres/{item.id}">
                    <SVGGenre class="inline" /> {item.name}
                </Link>
            {:else if getType() === "playlist"}
                <Link to="playlists/{item.id}">
                    {item.name}
                </Link>
            {:else if getType() === "song"}
                {#if $CurrentSong && $CurrentSong.id === item.id}
                    <span class="current-icon">
                        <SVGCurrent class="icon" />
                    </span>
                {/if}

                <Link to="song/{item.id}">
                    {item.name}
                </Link>
            {:else}
                <span>Uhh missing type</span>
            {/if}
        {/if}

        {#if col.id === "artist"}
            <Link to="artists/{item.artist.id}">
                <SVGArtist class="inline"/> {item.artist.name}
            </Link>
        {/if}

        {#if col.id === "album"}
            <Link to="albums/{item.album.id}">
                <SVGAlbum class="inline"/> {item.album.name}
            </Link>
        {/if}

        {#if col.id === "date"}
            <Link to="albums/year/{item.year}"><SVGYear class="inline"/> {item.year || 'None'}</Link>
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
            <Link to="genres/{item.id}#artists"><SVGArtist class="inline" /> {item.artists}</Link>
        {/if}

        {#if col.id === "genreAlbumsCount"}
            <Link to="genres/{item.id}#albums"><SVGAlbum class="inline" /> {item.albums}</Link>
        {/if}

        {#if col.id === "genreSongsCount"}
            <Link to="genres/{item.id}#songs"><SVGSong class="inline" /> {item.songs}</Link>
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
            <Rating type={getType()} id="{item.id}" bind:rating="{item.rating}" flag="{item.flag}" averageRating="{item.averagerating}" />
        {/if}

        {#if col.id === "actions"}
            <Actions
                type="{getType()}"
                mode="miniButtons"
                id="{item.id}"
                count="1"
                artistID="{item.artist ? item.artist.id : null}"
                albumID="{item.album ? item.album.id : null}"
            />
        {/if}

    </div>
{/each}

<style>
    .image {
        margin-right: var(--spacing-md);
        margin-left: calc(var(--spacing-md) * -1);
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

    .cell[data-type=number],
    .cell[data-type=time] {
        justify-content: end;
    }

    .reorder {
        display: flex;
        flex-direction: column;
    }

    .reorder button {
        /*border: 1px solid lime;*/
        height: unset;
        padding: 0;
        /*display: block;*/
    }
</style>