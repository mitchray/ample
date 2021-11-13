<script>
    import { fade, fly } from 'svelte/transition';

    import { SearchQuery, ShowSearch } from '../stores/status';
    import { SiteContentBind } from '../stores/player';

    import CardList from './cardList.svelte';

    import SVGClose from "../../public/images/close.svg";

    function handleClick(event) {
        // Close search if we are following a link
        if (event.target.href !== undefined) {
            ShowSearch.set(false);
        }
    }

    function handleClose() {
        ShowSearch.set(false);
    }
</script>

{#if $SearchQuery}
    <div class="container"
        on:click={handleClick}
        transition:fade={{ duration: 300 }}
        style="width: {$SiteContentBind.clientWidth}px; height: {$SiteContentBind.clientHeight}px; top: {$SiteContentBind.getBoundingClientRect().top}px; left: {$SiteContentBind.getBoundingClientRect().left}px;"
    >
        <div class="header panel-header">
            <h4>Results for <b>{$SearchQuery}</b></h4>
            <button class="icon close" on:click={handleClose}><SVGClose /></button>
        </div>

        <div class="results">
            {#key $SearchQuery}
                <CardList type="artist" dataProvider={"searchArtists"} limit=6 arg={encodeURI($SearchQuery)} heading="Artists" />

                <CardList type="album" dataProvider={"searchAlbums"} limit=6 arg={encodeURI($SearchQuery)} heading="Albums" />

                <CardList type="song" dataProvider={"searchSongs"} limit=9 arg={encodeURI($SearchQuery)} heading="Songs" />

                <CardList type="playlist" dataProvider={"searchPlaylists"} limit=6 arg={encodeURI($SearchQuery)} heading="Playlists" />

                <CardList type="smartlist" dataProvider={"searchSmartlists"} limit=6 arg={encodeURI($SearchQuery)} heading="Smartlists" />
            {/key}
        </div>
    </div>
{/if}

<style>
    .container {
        background-color: var(--color-interface-00);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
        /*border-radius: 15px;*/
        overflow: hidden;
        display: flex;
        flex-direction: column;
        /*box-shadow: rgba(0, 0, 0, 0) 0 0 0 0,*/
        /*    rgba(0, 0, 0, 0) 0 0 0 0,*/
        /*    rgba(0, 0, 0, 0.25) 0 25px 50px -12px;*/
    }

    .header {
        background-color: var(--color-interface-10);
        display: flex;
        flex-shrink: 0;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-md);
        padding-left: var(--spacing-lg);
    }

    .header h4 {
        margin: 0;
        margin-right: auto;
    }

    .results {
        padding: var(--spacing-xl);
        overflow-y: auto;
    }

    .results:after {
        content: '';
        padding: inherit;
        padding-top: 0;
        display: block;
    }
</style>