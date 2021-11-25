<script>
    import { onMount } from "svelte";
    import { Link } from "svelte-routing";

    import { allArtists, allAlbums, artistIndex, albumIndex } from '../stores/server';

    import { getArtists } from "../logic/artist";
    import { getAlbums } from "../logic/album";

    import { clickOutsideDetector } from '../actions/clickOutsideDetector';

    import SVGArtist from "../../public/images/artist.svg";

    export let visible = false;
    export let type;
    export let toggleElement;

    let data = [];
    let dataDisplay;
    let loading = true;

    $: {
        if (type === "artist" && $allArtists.loaded) {
            dataDisplay = $allArtists.data;
            dataDisplay = groupByFirstChar(dataDisplay);
        }

        if (type !== "artist" && $allAlbums.loaded) {
            dataDisplay = groupByFirstChar($allAlbums.data);
        }
    }

    function groupByFirstChar(items) {
        let grouped = new Map();

        // Add a catchall for numbers and non-word chars
        grouped.set("#", []);

        for (let i = 0; i < items.length; i++) {
            let char = items[i].name.charAt(0).toLowerCase();

            // if digit or non-word char
            if (/^(\d|\W)/i.test(char)) {
                grouped.get('#').push(items[i]);
                continue;
            }

            if (!grouped.get(char)) {
                grouped.set(char, []);
            }

            grouped.get(char).push(items[i]);
        }

        return grouped;
    }

    async function loadAll() {
        loading = true;

        if (type === 'artist') {
            data = await getArtists({limit: null, page: null});

            data = data.sort(function(obj1, obj2) {
                return obj1.name.localeCompare(obj2.name);
            });

            allArtists.set({loaded: true, data: data});
            data = null; // flush
        } else {
            data = await getAlbums({limit: null, page: null});

            data = data.sort(function(obj1, obj2) {
                return obj1.name.localeCompare(obj2.name);
            });

            allAlbums.set({loaded: true, data: data});
            data = null; // flush
        }

        loading = false;
    }

    function handleClick() {
        visible = false;
    }

    function handleClickOutside() {
        visible = false;
    }

    function handleAlphaScroll(e) {
        let thisLetter = e.target.textContent.charAt(0).toLowerCase();
        let items = e.target.closest('.container').querySelectorAll('.item');

        let foundElement = Array.from(items).find(element => element.textContent.charAt(0).toLowerCase() === thisLetter);
        
        if (thisLetter === "#") {
            Array.from(items)[0].scrollIntoView();
        }

        if (foundElement) {
            foundElement.scrollIntoView();
        }
    }

    onMount(() => {
        loadAll();
    });
</script>


<div
    class="container c-sidebar-drawer"
    class:visible={visible}
    use:clickOutsideDetector={{
        toggle: toggleElement
    }}
    on:clickedOutside={handleClickOutside}
>
    <div class="alpha" class:loaded={!loading}>
        {#if type === 'artist'}
            {#if $artistIndex}
                {#each [...$artistIndex] as [key, value], i}
                    {#if value.artistCount > 0}
                        <button
                            on:click={handleAlphaScroll}
                        >
                            {key}
                        </button>
                    {/if}
                {/each}
            {/if}
        {:else}
            {#if $albumIndex}
                {#each [...$albumIndex] as [key, value], i}
                    {#if value.albumCount > 0}
                        <button
                            on:click={handleAlphaScroll}
                        >
                            {key}
                        </button>
                    {/if}
                {/each}
            {/if}
        {/if}
    </div>

    <div class="list">
        {#if !loading}
            <ul>
                {#if type === 'artist' && $allArtists}
                    {#each [...dataDisplay] as [key, value], i}
                        <li class="item subheading">{key}</li>

                        {#each value as single}
                            <li class="item">
                                <Link
                                    to="{type === 'artist' ? 'artists' : 'albums'}/{single.id}"
                                    on:click={handleClick}
                                >
                                    <div
                                        class="item-name"
                                        title="{single.name}"
                                    >
                                        {single.name}
                                    </div>

                                    {#if type === 'album'}
                                        <div
                                            class="artist-name"
                                            title="{single.artist.name}"
                                        >
                                            <SVGArtist class="inline"/> {single.artist.name}
                                        </div>
                                    {/if}
                                </Link>
                            </li>
                        {/each}
                    {/each}
                {/if}

                {#if type === 'album' && $allAlbums}
                    {#each [...dataDisplay] as [key, value], i}
                        <li class="item subheading">{key}</li>

                        {#each value as single}
                            <li class="item">
                                <Link
                                    to="{type === 'artist' ? 'artists' : 'albums'}/{single.id}"
                                    on:click={handleClick}
                                >
                                    <div
                                        class="item-name"
                                        title="{single.name}"
                                    >
                                        {single.name}
                                    </div>

                                    {#if type === 'album'}
                                        <div
                                            class="artist-name"
                                            title="{single.artist.name}"
                                        >
                                            <SVGArtist class="inline"/> {single.artist.name}
                                        </div>
                                    {/if}
                                </Link>
                            </li>
                        {/each}
                    {/each}
                {/if}
            </ul>
        {:else}
           <p style="padding-left: var(--spacing-lg)">Loading</p>
        {/if}
    </div>
</div>

<style>
    .container {
        display: flex;
        width: 240px;
        background-color: var(--color-interface-00);
        position: absolute;
        left: 100%;
        top: 0;
        bottom: 0;
        transition: opacity ease 300ms, transform ease 300ms;
        transform: translateX(-30px);
        z-index: -1;
        opacity: 0;
        pointer-events: none;
        box-shadow: 10px 0 15px -3px rgba(0,0,0,0.3),
            4px 0 6px -2px rgba(0,0,0,0.15);
        border-right: 1px solid var(--color-tint-100);
    }

    .container.visible {
        opacity: 1;
        pointer-events: initial;
        transform: translateX(0);
    }

    .alpha {
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        overflow-x: hidden;
        flex-shrink: 0;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm);
        opacity: 0;
        transition: opacity ease 300ms;
    }

    .alpha.loaded {
        opacity: 1;
    }

    .alpha :global(button) {
        text-transform: uppercase;
        padding: 0;
        width: 35px;
        height: 25px;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        flex-shrink: 0;
        margin: 0;
    }

    .subheading {
        color: var(--color-highlight);
        font-family: var(--font-heading);
        text-transform: uppercase;
        padding-left: var(--spacing-lg);
        font-size: 1.5em;
        font-weight: 700;
    }

    .subheading:not(:first-child) {
        margin-top: var(--spacing-lg);
    }

    .list {
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border-left: 1px solid var(--color-tint-100);
        flex: 1;
    }

    .list ul {
        overflow-y: scroll;
        overflow-x: hidden;
    }

    ul {
        margin: 0;
        padding: var(--spacing-md) 0;
    }

    li :global(a) {
        display: flex;
        flex-direction: column;
        padding: var(--spacing-sm) 0;
        overflow: hidden;
        align-items: flex-start; /* have children take up content space */
    }

    .item-name,
    .artist-name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 0 var(--spacing-lg);
        max-width: 100%; /* key to having overflow take effect with the flex-start items */
    }

    .artist-name {
        opacity: 0.7;
    }
</style>