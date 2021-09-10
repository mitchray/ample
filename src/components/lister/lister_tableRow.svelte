<script>
    import { getContext } from 'svelte';
    import { Link } from 'svelte-routing';

    import { formatSongLength } from '../../logic/helper';

    export let contextKey;
    export let item;

    import Rating from '../../components/rating.svelte';
    import Actions from '../../components/actions.svelte';

    import SVGArtist from "../../../public/images/artist.svg";
    import SVGAlbum from "../../../public/images/album.svg";
    import SVGSong from "../../../public/images/music_note.svg";
    import SVGYear from "../../../public/images/year.svg";
    import SVGGenre from "../../../public/images/label.svg";
    import SVGCenter from "../../../public/images/center_focus.svg";
    import SVGClose from "../../../public/images/close.svg";

    const { getType, showIndex, visibleColumns } = getContext(contextKey);
</script>

{#each $visibleColumns as col }
    {#if col.id === "checkbox"}
        <div><input type="checkbox" bind:checked={item.selected} /></div>
    {/if}

    {#if col.id === "index"}
        <div>{item.initialOrder + 1}</div>
    {/if}

    {#if col.id === "art"}
        <div class="thumb">
            {#key item.art}
                <img src="{item.art}&thumb=1" alt="" height="40" width="40"/>
            {/key}
        </div>
    {/if}

    {#if col.id === "name"}
        <div title="{item.name}">
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
            {:else if getType() === "playlists"}
                <Link to="playlists/{item.id}">
                    {item.name}
                </Link>
            {:else}
                <span>{item.name}</span>
            {/if}
        </div>
    {/if}

    {#if col.id === "artist"}
        <div title="{item.artist.name}">
            <Link to="artists/{item.artist.id}">
                <SVGArtist class="inline"/> {item.artist.name}
            </Link>
        </div>
    {/if}

    {#if col.id === "album"}
        <div title="{item.album.name}">
            <Link to="albums/{item.album.id}">
                <SVGAlbum class="inline"/> {item.album.name}
            </Link>
        </div>
    {/if}

    {#if col.id === "date"}
        <div>
            <Link to="albums/year/{item.year}"><SVGYear class="inline"/> {item.year || 'None'}</Link>
        </div>
    {/if}

    {#if col.id === "length"}
        <div>{formatSongLength(item.time)}</div>
    {/if}

    {#if col.id === "albumCount"}
        <div title="{item.albumcount}">
            <span>{item.albumcount}</span>
        </div>
    {/if}

    {#if col.id === "songCount"}
        <div title="{item.songcount}">
            <span>{item.songcount}</span>
        </div>
    {/if}

    {#if col.id === "genres"}
        <div class="genres">
            {#if item.genre.length > 0}
                <ul>
                    {#each item.genre as genre}
                        <li><Link to="genres/{genre.id}"><SVGGenre class="inline" /> {genre.name}</Link></li>
                    {/each}
                </ul>
            {/if}
        </div>
    {/if}

    {#if col.id === "artistsCount"}
        <div>
            <Link to="genres/{item.id}/artists"><SVGArtist class="inline" /> {item.artists}</Link>
        </div>
    {/if}

    {#if col.id === "albumsCount"}
        <div>
            <Link to="genres/{item.id}/albums"><SVGAlbum class="inline" /> {item.albums}</Link>
        </div>
    {/if}

    {#if col.id === "songsCount"}
        <div>
            <Link to="genres/{item.id}/songs"><SVGSong class="inline" /> {item.songs}</Link>
        </div>
    {/if}

    {#if col.id === "owner"}
        <div>{item.owner}</div>
    {/if}

    {#if col.id === "privacy"}
        <div>
            {item.type[0].toUpperCase() + item.type.substring(1)}
        </div>
    {/if}

    {#if col.id === "count"}
        <div class="count">
            {item.items} {parseInt(item.items) === 1 ? 'song' : 'songs'}
        </div>
    {/if}

    {#if col.id === "rating"}
        <div>
            <Rating type={getType()} id="{item.id}" bind:rating="{item.rating}" flag="{item.flag}" averageRating="{item.averagerating}" />
        </div>
    {/if}

    {#if col.id === "actions"}
        <div>
            <Actions
                type="{getType()}"
                mode="miniButtons"
                id="{item.id}"
                count="1"
                artistID="{item.artist ? item.artist.id : null}"
                albumID="{item.album ? item.album.id : null}"
            />
        </div>
    {/if}
{/each}

<style>
    .genres li {
        display: inline;
        margin-right: var(--spacing-md);
    }
</style>