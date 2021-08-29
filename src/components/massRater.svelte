<script>
    import { onMount } from 'svelte';

    import { unratedArtists } from '../logic/artist';
    import { unratedAlbums } from '../logic/album';
    import { unratedSongs } from '../logic/song';
    import { setRating } from "../logic/library";

    import { Link } from "svelte-routing";
    import Rating from '../components/rating.svelte';

    import SVGArtist from "../../public/images/artist.svg";
    import SVGAlbum from "../../public/images/album.svg";

    let data = [];
    let type = 'song';
    let newRating = 3;
    let logic;
    let loading = true;
    let limit = 100;
    let showArtist = false;
    let showAlbum = false;

    let timeout;
    let customRegex = '';

    function handleRegexChange(event) {
        clearTimeout(timeout);

        timeout = setTimeout(function () {
            let chars = event.target.value;

            if (chars.length >= 3) {
                loadItems();
            }
        }, 600);
    }

    function handleType(e) {
        type = e.target.value;
        loadItems();
    }

    async function loadItems() {
        switch (type) {
            case "song":
                logic = unratedSongs;
                showAlbum = true;
                showArtist = true;
                break;
            case "album":
                logic = unratedAlbums;
                showAlbum = false;
                showArtist = true;
                break;
            case "artist":
                logic = unratedArtists;
                showAlbum = false;
                showArtist = false;
                break;
            default:
                break;
        }

        loading = true;
        data = await logic({query: customRegex, limit: limit});
        loading = false;
    }

    function handleToggleAll(e) {
        let allCheckboxes = document.querySelectorAll("#massRater tbody input[type=checkbox]");
        allCheckboxes.forEach(element => element.checked = !!(e.target.checked));
    }

    function handleApply() {
        let checkedBoxes = document.querySelectorAll("#massRater tbody input[type=checkbox]:checked");

        checkedBoxes.forEach(async function(element) {
            await setRating(type, element.id, newRating);
            element.closest("tr").hidden = true;
        });
    }

    function handleRating(e) {
        newRating = parseInt(e.target.value);
    }

    onMount (() =>  {
        loadItems();
    });
</script>

<div class="inputs">
    <label>
        Regex pattern:
        <input type=text
           bind:value={customRegex}
           on:paste={handleRegexChange}
           on:keyup={handleRegexChange}
        />
    </label>

    <label>
        Type

        <select on:change={handleType}>
            <option value="artist">Artists</option>
            <option value="album">Albums</option>
            <option value="song" selected>Songs</option>
        </select>
    </label>

    <label>
        Rating

        <select on:change={handleRating}>
            <option value="1" selected={newRating === 1}>1</option>
            <option value="2" selected={newRating === 2}>2</option>
            <option value="3" selected={newRating === 3}>3</option>
            <option value="4" selected={newRating === 4}>4</option>
            <option value="5" selected={newRating === 5}>5</option>
        </select>
    </label>

    <button class="primary" on:click={handleApply}>Apply to selected items</button>
    <button class="secondary" on:click={loadItems}>Reload</button>
</div>

{#if loading}
    <p>Loading</p>
{:else}
    {#if data.length > 0}
        <table id="massRater" class="massRater {type}">
            <thead>
            <tr>
                <th>
                    <label>
                        <input type="checkbox" on:change={handleToggleAll} />
                    </label>
                </th>
                <th>{type}</th>
                <th>Rating</th>
            </tr>
            </thead>

            <tbody>
            {#each data as item}
                <tr>
                    <td>
                        <label>
                            <input type="checkbox" id="{item.id}" />
                        </label>
                    </td>
                    <td>
                        <div class="item">
                            <span class="thumb">
                                <img src="{item.art}&thumb=1" height="60" width="60" alt="" loading="lazy"/>
                            </span>
                            <span class="details">
                                <div class="name">
                                    {#if type === 'song'}
                                        {item.name}
                                    {/if}

                                    {#if type === 'album'}
                                        <Link to="albums/{item.id}" title="{item.name}">{item.name}</Link>
                                    {/if}

                                    {#if type === 'artist'}
                                        <Link to="artists/{item.id}" title="{item.name}">{item.name}</Link>
                                    {/if}
                                </div>

                                {#if showAlbum && item.album}
                                    <div class="album">
                                        <Link to="albums/{item.album.id}" title="{item.album.name}"><SVGAlbum class="inline"/> {item.album.name}</Link>
                                    </div>
                                {/if}
                                {#if showArtist && item.artist}
                                    <div class="artist">
                                        <Link to="artists/{item.artist.id}" title="{item.artist.name}"><SVGArtist class="inline"/> {item.artist.name}</Link>
                                    </div>
                                {/if}
                            </span>
                        </div>
                    </td>
                    <td><Rating type="{type}" id="{item.id}" rating="{item.rating}" flag="{item.flag}" averageRating="{item.averagerating}" /></td>
                </tr>
            {/each}
            </tbody>
        </table>
    {:else}
        <p>No unrated {type} found</p>
    {/if}
{/if}

<style>
    .massRater {
        border-collapse: collapse;
    }

    .massRater :global(th) {
        text-transform: capitalize;
        text-align: left;
    }

    .inputs {
        margin-bottom: var(--spacing-lg);
    }

    label {
        margin-right: var(--spacing-lg);
    }

    .massRater :global(tr) {
        border-bottom: 1px solid var(--color-lines);
    }

    .massRater :global(td), .massRater :global(th) {
        padding: 0.6em 0.6em;
    }

    .thumb {
        margin-right: var(--spacing-md);
    }

    .thumb img {
        border-radius: 2px;
    }

    .artist .thumb img {
        border-radius: 999px;
    }

    .item {
        display: flex;
        align-items: center;
    }
</style>