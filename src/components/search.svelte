<script>
    import { fade, fly } from 'svelte/transition';

    import { SearchQuery, ShowSearch } from '../stores/status';

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
    <div class="container" on:click={handleClick} transition:fly={{ x: -50, duration: 300 }}>
        <div class="header">
            <div class="header-text">Results for <b>{$SearchQuery}<b></div>
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
    <div class="backdrop" transition:fade></div>
{/if}

<style>
    .container {
        background-color: var(--color-background);
        position: absolute;
        left: calc(var(--size-sidebar-width) + var(--spacing-xl));
        top: var(--spacing-xl);
        width: calc(100vw - var(--size-sidebar-width) - var(--spacing-xl) * 2);
        bottom: var(--spacing-xl);
        z-index: 100;
        border-radius: 15px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        box-shadow: rgba(0, 0, 0, 0) 0 0 0 0,
            rgba(0, 0, 0, 0) 0 0 0 0,
            rgba(0, 0, 0, 0.25) 0 25px 50px -12px;
    }

    .backdrop {
        position: absolute;
        content: '';
        top: 0;
        left: 100%;
        width: calc(100vw - var(--size-sidebar-width));
        bottom: 0;
        background-color: var(--color-tint-200);
    }

    @supports (backdrop-filter: blur(0)) {
        .backdrop {
            backdrop-filter: blur(10px) saturate(180%);
            background-color: var(--color-tint-100);
        }
    }

    :global(.theme-is-light) .backdrop {
        background-color: var(--color-shade-200);
    }

    .close {
        position: absolute;
        top: var(--spacing-lg);
        right: var(--spacing-lg);
        cursor: pointer;
        z-index: 1;
    }

    .header {
        background-color: var(--color-tint-50);
        display: flex;
        padding: var(--spacing-md);
        padding-left: var(--spacing-xl);
        border-bottom: 1px solid var(--color-tint-100);
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

    .header-text {
        font-size: 28px;
    }
</style>