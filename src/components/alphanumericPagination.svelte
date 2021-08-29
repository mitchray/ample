<script>
    import { ShowAlbumArtistsOnly } from "../stores/status";
    import { artistIndex, albumIndex } from '../stores/server';

    // Begin component
    export let selectedChar;
    export let type;

    let params = (new URL(document.location)).searchParams;

    // Load from URL otherwise set defaults
    let charID = params.get('filter') || '';
    let items = [];

    $: selectedChar = charID;

    function clear() {
        let url = new URL(window.location);
        url.searchParams.delete('filter');
        charID = '';
        window.history.replaceState({}, '', url);
    }

    function handleSelection(e) {
        let url = new URL(window.location);
        let charSelected = e.target.dataset.char_id;
        charID = charSelected;
        url.searchParams.set('filter', charSelected);
        window.history.replaceState({}, '', url);
    }
</script>

<div class="container pagination">
    <button class="all" on:click={clear}>
        All
    </button>

    <ul class="row">
        {#if type === "artists"}
            {#if $artistIndex}
                {#each [...$artistIndex] as [key, value], i}
                    {#if value.artistCount > 0 || value.albumArtistCount > 0}
                        <li>
                            <button
                                on:click={handleSelection}
                                data-char_id={key}
                                class:active={key === selectedChar}
                                disabled={
                                ($ShowAlbumArtistsOnly && parseInt(value.albumArtistCount) === 0) ||
                                (!$ShowAlbumArtistsOnly && parseInt(value.artistCount) === 0)
                            }
                            >
                                {key}
                            </button>
                        </li>
                    {/if}
                {/each}
            {/if}
        {:else}
            {#if $albumIndex}
                {#each [...$albumIndex] as [key, value], i}
                    {#if value.albumCount > 0}
                        <li>
                            <button
                                on:click={handleSelection}
                                data-char_id={key}
                                class:active={key === selectedChar}
                            >
                                {key}
                            </button>
                        </li>
                    {/if}
                {/each}
            {/if}
        {/if}
    </ul>
</div>

<style>
    .container {
        display: flex;
        align-items: center;
    }

    .row {
        display: flex;
        gap: var(--spacing-sm);
    }

    li {
        display: inline-block;
    }

    ul {
        margin: 0;
    }

    button {
        display: inline-flex;
        height: 30px;
        align-content: center;
        justify-content: center;
        text-transform: uppercase;
    }

    .all {
        margin-right: var(--spacing-lg);
    }

    .row button {
        width: 30px;
    }
</style>