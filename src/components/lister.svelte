<script>
    import { onMount, tick, beforeUpdate, onDestroy } from "svelte";
    import { Link } from 'svelte-routing';

    import { formatSongLength } from '../logic/helper';
    import { removeFromPlaylist } from '../logic/playlist';
    import { getSongsFromPlaylist, getSongFromPlaylist } from '../logic/song';

    import Rating from '../components/rating.svelte';
    import Actions from '../components/actions.svelte';

    import SVGArtist from "../../public/images/artist.svg";
    import SVGAlbum from "../../public/images/album.svg";
    import SVGSong from "../../public/images/music_note.svg";
    import SVGYear from "../../public/images/year.svg";
    import SVGGenre from "../../public/images/label.svg";
    import SVGCenter from "../../public/images/center_focus.svg";
    import SVGClose from "../../public/images/close.svg";

    export let data;
    export let type;
    export let id = null;
    export let showIndex = false;
    export let showCheckboxes = false;
    export let activeSort = null;
    export let sortReverse = null;

    let moreMenuID;
    let moreMenuIsOpen = false;
    let dataDisplay;
    let allHeaders;
    let dataCopy = [];

    // lister element binds
    let lister;
    let listerContainer;
    let listerHeader;

    // conditional columns
    let showArt = true;
    let showRating = true;
    let showActions = true;

    $: data = data; //immutable
    $: dataDisplay = (sortReverse) ? dataCopy.slice().reverse() : dataCopy;
    $: visible = dataDisplay.slice(startNode, startNode + visibleNodesCount).map((data, i) => {
        return data;
    });

    $: totalContentHeight = dataDisplay.length * itemHeight;

    // virtual stuff
    let visible = [];
    let itemHeight = 47;
    let columnWidths = [];
    let myObserver;
    let nodePadding = 5;
    let viewportHeight;
    let totalContentHeight;
    let startNode;
    let visibleNodesCount;
    let offsetY;
    let scrollTimer;
    let lastKnownScroll = 0;
    let ticking = false;

    function handleActionMenu(index) {
        moreMenuID = index;
        moreMenuIsOpen = !moreMenuIsOpen;
    }

    function applySort(sortType) {
        switch (sortType) {
            case 'index':
                dataCopy = dataCopy.sort(function(obj1, obj2) { return obj1.initialOrder > obj2.initialOrder });
                break;
            case 'date':
                dataCopy = dataCopy.sort(function(obj1, obj2) { return obj1.year > obj2.year });
                break;
            case 'releases':
                dataCopy = dataCopy.sort(function(obj1, obj2) { return obj1.albumcount > obj2.albumcount });
                break;
            case 'songs':
                dataCopy = dataCopy.sort(function(obj1, obj2) { return obj1.songcount > obj2.songcount });
                break;
            case 'genreArtists':
                dataCopy = dataCopy.sort(function(obj1, obj2) { return obj1.artists > obj2.artists });
                break;
            case 'genreAlbums':
                dataCopy = dataCopy.sort(function(obj1, obj2) { return obj1.albums > obj2.albums });
                break;
            case 'genreSongs':
                dataCopy = dataCopy.sort(function(obj1, obj2) { return obj1.songs > obj2.songs });
                break;
            case 'time':
                dataCopy = dataCopy.sort(function(obj1, obj2) { return obj1.time.toString().localeCompare(obj2.time.toString(), undefined, {numeric: true}) });
                break;
            case 'rating':
                dataCopy = dataCopy.sort(function(obj1, obj2) { return obj1.rating > obj2.rating });
                break;
            case 'title':
                dataCopy = dataCopy.sort(function(obj1, obj2) { return obj1.name.localeCompare(obj2.name) });
                break;
            case 'artist':
                dataCopy = dataCopy.sort(function(obj1, obj2) { return obj1.artist.name.localeCompare(obj2.artist.name) });
                break;
            case 'album':
                dataCopy = dataCopy.sort(function(obj1, obj2) { return obj1.album.name.localeCompare(obj2.album.name) });
                break;
            default:
                break;
        }
    }

    async function handleSort(e) {
        let sortType = e.target.dataset.sort;
        activeSort = sortType;
        sortReverse = e.target.dataset.reverse ? JSON.parse(e.target.dataset.reverse) : null;

        applySort(sortType);

        // reset other items
        for (const header of allHeaders) {
            header.removeAttribute('data-reverse');
        }

        if (sortReverse === null) {
            // hasn't been clicked yet, apply no reversal
            sortReverse = false;
        } else {
            // invert the reversal
            sortReverse = !sortReverse;
        }

        await tick();

        e.target.setAttribute('data-reverse', sortReverse);
    }

    // currently just playlist specific
    async function handleRemove(event, item) {
        let update = Promise.resolve([]);

        // before we attempt to remove, double check things are ok.
        event.target.classList.add('loading');
        listerContainer.classList.add('refreshing');

        // query song at requested index to see if it matches
        let testSong = await getSongFromPlaylist({playlistID: id, songIndex: item.initialOrder});

        // if testSong equals correct song, request to remove via API
        if (testSong[0].id === item.id) {
            update = await removeFromPlaylist({playlistID: id, trackNo: item.initialOrder + 1});
        }

        // reload playlist songs regardless of match or success
        let newData = await getSongsFromPlaylist(id);

        newData = setOrders(newData);

        event.target.classList.remove('loading');
        listerContainer.classList.remove('refreshing');

        data = newData;
        await updateData();
        updateTotalHeight();
        applySort(activeSort);
    }

    async function updateData() {
        data = data;
        dataCopy = data.slice();
        await tick();
    }

    function centerLister() {
        listerContainer.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
        });
    }

    function limitScroll() {
        lastKnownScroll = listerContainer.scrollTop;
        requestTick();
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(update);
        }
        ticking = true;
    }

    function toggleAllChecked(e) {
        dataDisplay.forEach(element => element.selected = !!(e.target.checked));
        dataDisplay = dataDisplay;
    }

    beforeUpdate(() => {
        // determine columns
        switch (type) {
            case "genre":
                showArt = false;
                showRating = false;
                showActions = false;
                break;
            case "playlist":
                showIndex = true;
                break;
            default:
                break;
        }
    });

    async function update() {
        ticking = false;

        clearTimeout(scrollTimer);

        // ensure listerContainer is present before continuing
        while(!listerContainer) {
            await new Promise(r => setTimeout(r, 100));
        }

        listerContainer.classList.add('disable-hover');
        scrollTimer = setTimeout(function(){
            if (listerContainer) {
                listerContainer.classList.remove('disable-hover');
            }
        }, 200);

        startNode = Math.floor(lastKnownScroll / itemHeight) - nodePadding;
        startNode = Math.max(0, startNode);

        visibleNodesCount = Math.ceil(viewportHeight / itemHeight) + (2 * nodePadding);
        visibleNodesCount = Math.min(dataDisplay.length - startNode, visibleNodesCount);

        // account for sticky header taking up a slot at the start
        if (startNode === 0 && dataDisplay.length > visibleNodesCount) {
            visibleNodesCount = visibleNodesCount - 1;
        }

        offsetY = startNode * itemHeight;
        listerContainer.style.setProperty('--c-lister-offset', offsetY + "px");

        // DEBUG ZONE
        // console.debug('==========================');
        // console.debug('viewport height', viewportHeight);
        // console.debug('total height', totalContentHeight);
        // console.debug('index of first node to show', startNode);
        // console.debug('how many to show', visibleNodesCount);
        // console.debug('offset', offsetY);
        // console.debug('top padding', top);
        // console.debug('final test', top + viewportHeight + bottom === totalContentHeight);
    }

    function setOrders(arr) {
        for (let i = 0; i < arr.length; i++) {
            arr[i].initialOrder = i;
        }

        return arr;
    }

    function updateTotalHeight() {
        listerContainer.style.setProperty('--c-lister-total-height', totalContentHeight + "px");
    }

    onMount(async () => {
        await updateData();

        // save initial orders
        setOrders(data);

        // ensure listerContainer is present before continuing
        while(!listerContainer) {
            await new Promise(r => setTimeout(r, 100));
        }

        viewportHeight = parseInt(window.getComputedStyle(listerContainer).maxHeight, 10);
        viewportHeight = Math.min(itemHeight * dataDisplay.length, viewportHeight);

        // set column count based on how many header items exist
        allHeaders = lister.querySelectorAll('.lister-header div');
        listerContainer.style.setProperty('--c-lister-column-count', allHeaders.length);
        listerContainer.style.setProperty('--c-lister-item-height', itemHeight + "px");
        listerContainer.style.setProperty('--c-lister-offset', 0 + "px");
        updateTotalHeight();

        applySort(activeSort);

        update();

        let observed = false;

        // use ResizeObserver on Lister to grab column widths after it is rendered
        myObserver = new ResizeObserver(entries => {
            entries.forEach(entry => {
                columnWidths = window.getComputedStyle(entry.target).gridTemplateColumns;
            });

            if (!observed) {
                observed = true;

                listerContainer.style.setProperty('--c-lister-column-widths', columnWidths);

                // move header to be child of lister container once sizes are set so sticky works again
                listerHeader.classList.add('moved');
                listerContainer.prepend(listerHeader);
            }
        });

        myObserver.observe(lister);
    });

    onDestroy(() => {
        if (myObserver) {
            myObserver.disconnect();
        }
    });
</script>



<div class="c-lister-wrapper">
    <div class="lister-actions">
        <button type="button" class="center-lister just-icon" on:click={centerLister} title="Center"><SVGCenter style="padding: 0.05em;" /></button>
    </div>

    <div
        class="c-lister-container"
        bind:this={listerContainer}
        on:scroll={limitScroll}
    >
        <div class="c-lister" bind:this={lister}>
            <div class="lister-header" bind:this={listerHeader}>
                {#if type === 'playlist'}
                    <div>&nbsp;</div>
                {/if}

                {#if showCheckboxes}
                    <div><input type="checkbox" on:change={toggleAllChecked} /></div>
                {/if}

                {#if showIndex}
                    <div class="index" data-sort="index" on:click={handleSort}>#</div>
                {/if}

                {#if showArt}
                    <div class="thumb">&nbsp;</div>
                {/if}

                <div class="title" data-sort="title" on:click={handleSort}>Name</div>

                {#if type === "song" || type === "playlist" || type === "smartlist"}
                    <div class="artist" data-sort="artist" on:click={handleSort}>Artist</div>
                    <div class="album" data-sort="album" on:click={handleSort}>Album</div>
                    <div class="date" data-sort="date" on:click={handleSort}>Date</div>
                    <div class="length" data-sort="time" on:click={handleSort}>Length</div>
                {/if}

                {#if type === "artist"}
                    <div class="releases" data-sort="releases" on:click={handleSort}>Releases</div>
                    <div class="songs" data-sort="songs" on:click={handleSort}>Songs</div>
                    <div class="genres">Genres</div>
                {/if}

                {#if type === "album"}
                    <div class="artist" data-sort="artist" on:click={handleSort}>Artist</div>
                    <div class="date" data-sort="date" on:click={handleSort}>Date</div>
                    <div class="songs" data-sort="songs" on:click={handleSort}>Songs</div>
                    <div class="genres">Genres</div>
                {/if}

                {#if type === "genre"}
                    <div class="artists" data-sort="genreArtists" on:click={handleSort}>Artists</div>
                    <div class="albums" data-sort="genreAlbums" on:click={handleSort}>Albums</div>
                    <div class="songs" data-sort="genreSongs" on:click={handleSort}>Songs</div>
                {/if}

                {#if type === "playlists"}
                    <div class="owner" data-sort="owner" on:click={handleSort}>Owner</div>
                    <div class="privacy" data-sort="privacy" on:click={handleSort}>Privacy</div>
                    <div class="count" data-sort="count" on:click={handleSort}>Count</div>
                {/if}

                {#if showRating}
                    <div class="rating" data-sort="rating" on:click={handleSort}>Rating</div>
                {/if}

                {#if showActions}
                    <div class="actions">&nbsp;</div>
                {/if}
            </div>

            {#each visible as item, index (index)}
                <div class="lister-item">
                    {#if type === 'playlist'}
                        <div><button class="icon remove" on:click|stopPropagation={(e) => { handleRemove(e, item) }}><SVGClose /></button></div>
                    {/if}

                    {#if showCheckboxes}
                        <div><input type="checkbox" bind:checked={item.selected} /></div>
                    {/if}

                    {#if showIndex}
                        <div class="index">{item.initialOrder + 1}</div>
                    {/if}

                    {#if showArt}
                        <div class="thumb">
                            {#key item.art}
                                <img src="{item.art}&thumb=1" alt="" height="40" width="40"/>
                            {/key}
                        </div>
                    {/if}

                    {#if type === "song" || type === "playlist" || type === 'smartlist'}
                        <div class="title" title="{item.name}">
                            <span>{item.name}</span>
                        </div>

                        <div class="artist" title="{item.artist.name}">
                            <Link to="artists/{item.artist.id}">
                                <SVGArtist class="inline"/> {item.artist.name}
                            </Link>
                        </div>

                        <div class="album" title="{item.album.name}">
                            <Link to="albums/{item.album.id}">
                                <SVGAlbum class="inline"/> {item.album.name}
                            </Link>
                        </div>

                        <div class="date">
                            <Link to="albums/year/{item.year}"><SVGYear class="inline"/> {item.year || 'None'}</Link>
                        </div>

                        <div class="length">{formatSongLength(item.time)}</div>
                    {/if}

                    {#if type === "artist"}
                        <div class="title" title="{item.name}">
                            <Link to="artists/{item.id}">
                                <span>{item.name}</span>
                            </Link>
                        </div>

                        <div class="releases">
                            {item.albumcount}
                        </div>

                        <div class="songs">
                            {item.songcount}
                        </div>

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

                    {#if type === "album"}
                        <div class="title" title="{item.name}">
                            <Link to="albums/{item.id}">
                                <span>{item.name}</span>
                            </Link>
                        </div>

                        <div class="artist" title="{item.artist.name}">
                            <Link to="artists/{item.artist.id}">
                                <SVGArtist class="inline"/> {item.artist.name}
                            </Link>
                        </div>

                        <div class="date">
                            <Link to="albums/year/{item.year}"><SVGYear class="inline"/> {item.year || 'None'}</Link>
                        </div>

                        <div class="songs">
                            {item.songcount}
                        </div>

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

                    {#if type === "genre"}
                        <div class="title" title="{item.name}">
                            <Link to="genres/{item.id}">
                                <SVGGenre class="inline" /> {item.name}
                            </Link>
                        </div>

                        <div class="artistsCount">
                            <Link to="genres/{item.id}/artists"><SVGArtist class="inline" /> {item.artists}</Link>
                        </div>

                        <div class="albumsCount">
                            <Link to="genres/{item.id}/albums"><SVGAlbum class="inline" /> {item.albums}</Link>
                        </div>

                        <div class="songsCount">
                            <Link to="genres/{item.id}/songs"><SVGSong class="inline" /> {item.songs}</Link>
                        </div>
                    {/if}

                    {#if type === "playlists"}
                        <div class="title" title="{item.name}">
                            <Link to="playlists/{item.id}" title="{item.name}">{item.name}</Link>
                        </div>

                        <div class="owner">
                            {item.owner}
                        </div>

                        <div class="privacy">
                            {item.type[0].toUpperCase() + item.type.substring(1)}
                        </div>

                        <div class="count">
                            {item.items} {parseInt(item.items) === 1 ? 'song' : 'songs'}
                        </div>
                    {/if}

                    {#if showRating}
                        <div class="rating">
                            <Rating type={type} id="{item.id}" bind:rating="{item.rating}" flag="{item.flag}" averageRating="{item.averagerating}" />
                        </div>
                    {/if}

                    {#if showActions}
                        <div class="actions">
                            <Actions
                                type="{type}"
                                mode="miniButtons"
                                id="{item.id}"
                                count="1"
                                artistID="{item.artist ? item.artist.id : null}"
                                albumID="{item.album ? item.album.id : null}"
                            />
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    </div>
</div>



<style>
    .c-lister-wrapper {
        --lister-actions-width: 35px;

        position: relative;
        width: fit-content;
        max-width: calc(100% - var(--lister-actions-width));
        left: var(--lister-actions-width);
    }

    .lister-actions {
        position: absolute;
        top: 0;
        right: calc(100% + var(--spacing-sm));
        margin: 0;
        display: flex;
        flex-direction: column;
        width: var(--lister-actions-width);
        gap: var(--spacing-sm);
    }

    :global(.c-lister-container.disable-hover *) {
        pointer-events: none !important;
    }

    .c-lister-container {
        border-radius: 5px;
        overflow-x: hidden;
        overflow-y: scroll;
        border: 2px solid var(--color-border);
        max-height: calc(100vh - (2 * var(--spacing-xxl)) - var(--size-webplayer-height));
        max-width: 100%;
        position: relative;
        overscroll-behavior: contain;
        will-change: contents;
    }

    .c-lister-container:global(.refreshing)  {
        pointer-events: none;
    }

    :global(.refreshing) .c-lister  {
        opacity: 0.7;
    }

    .c-lister,
    .lister-header:global(.moved) {
        display: grid;
        grid-template-columns: var(--c-lister-column-widths, repeat(var(--c-lister-column-count), minmax(40px, auto))) ;
    }

    .lister-header:global(.moved) {
        position: sticky;
        top: 0;
    }

    .lister-header:not(.moved),
    .lister-item {
        display: contents;
    }

    /* simulate full height of the items */
    .c-lister:after {
        content: '';
        display: block;
        /*background-color: hsla(120, 100%, 50%, 0.5);*/
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        opacity: 0;
        height: var(--c-lister-total-height);
        pointer-events: none;
    }

    .lister-header > div,
    .lister-item > div {
        padding: var(--spacing-md);
        display: flex;
        align-items: center;
        height: var(--c-lister-item-height);
    }

    .lister-item > div {
        transform: translateY(var(--c-lister-offset));
    }

    .lister-item span,
    .lister-item ul,
    .lister-item :global(a) {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .lister-header {
        z-index: 10;
    }

    .lister-header {
        background-color: var(--color-interface-00);
        border-bottom: 2px solid var(--color-interface);
        z-index: 100;
        user-select: none;
    }

    @supports (backdrop-filter: blur(0)) {
        .lister-header {
            background-color: var(--color-interface);
            backdrop-filter: blur(10px) saturate(180%);
            border-bottom-color: var(--color-border);
        }
    }

    [data-sort]:hover {
        background-color: var(--color-tint-100);
    }

    [data-sort] {
        text-decoration: underline;
        cursor: pointer;
    }

    [data-sort]:after {
        opacity: 0;
        content: '';
        background-color: currentColor;
        mask-image: url('/ample/public/images/arrow_left.svg');
        mask-size: contain;
        mask-position: center;
        height: 25px;
        width: 25px;
    }

    .c-lister-container :global([data-reverse="false"]:after) {
        opacity: 1;
        transform: rotate(90deg);
    }

    .c-lister-container :global([data-reverse="true"]:after) {
        opacity: 1;
        transform: rotate(270deg);
    }

    .lister-item div {
        border-top: 1px solid var(--color-lines);
    }

    .lister-item:hover div {
        background-color: var(--color-tint-50);
    }

    .lister-item :global(.c-actions) {
        opacity: 0;
    }

    .lister-item:hover :global(.c-actions) {
        opacity: 1;
    }

    .title {
        color: var(--color-link-primary);
        font-weight: 700;
    }

    .actions {
        width: max-content;
    }

    .index {
        text-align: right;
    }

    .thumb img {
        height: 40px;
        width: 40px;
        border-radius: 2px;
        line-height: 0;
        margin: calc(var(--spacing-sm) * -2) 0; /* reduce impact on row padding when art is shown */
    }

    .genres li {
        display: inline;
        margin-right: var(--spacing-md);
    }
</style>