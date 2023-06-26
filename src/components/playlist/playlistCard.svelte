<script>
    import { _ } from 'svelte-i18n';
    import { cleanArtURL } from "../../logic/helper";
    import Actions from '../../components/action/actions.svelte';
    import Rating from '../../components/rating.svelte';
    import PlaylistArt from '../../components/playlist/playlist_art.svelte';

    export let data = null; // needed for cardList dynamic components
    export let isSmartlist = false;

    let playlist;
    let parentUrl;

    $: playlist = data;
    $: parentUrl = isSmartlist ? 'smartlists' : 'playlists';
</script>

<div class="playlist-card card">
    {#if playlist}
        <div class="top">
            <div class="title">
                <a href="#/{parentUrl}/{playlist.id}" title="{playlist.name}">
                    {playlist.name}
                </a>
            </div>
        </div>

        <div class="image-container">
            {#if playlist.type === 'private'}
                <span class="private badge badge--danger">{$_('text.private')}</span>
            {/if}

            <a href="#/{parentUrl}/{playlist.id}" title="{playlist.name}">
                <PlaylistArt bind:playlist={playlist} fallback="{cleanArtURL(playlist.art)}" />
            </a>
        </div>

        <div class="details">
            {#if !isSmartlist}
                <div class="count secondary-info">
                    {$_("text.songsCount", { values: { count: parseInt(playlist.items) } })}
                </div>

                <div class="rating-container">
                    <Rating type="playlist" id="{playlist.id}" rating="{playlist.rating}" flag="{playlist.flag}" averageRating="{playlist.averagerating}" />
                </div>
            {/if}

            <div class="actions">
                <Actions
                    type="playlist"
                    mode="miniButtons"
                    showShuffle={playlist.items > 1}
                    id="{playlist.id}"
                    data={Object.create({playlist: playlist})}
                />
            </div>
        </div>
    {:else}
        <div class="top">
            <div class="title">
                {$_('text.loading')}
            </div>
        </div>

        <div class="image-container">
            <PlaylistArt fallback="{cleanArtURL(playlist.art)}" />
        </div>


        <div class="details">
            <div class="actions">
                <Actions type="playlist" mode="miniButtons" />
            </div>
        </div>
    {/if}
</div>

<style>
    /* Playlist grids should have this on the containing element */
    :global(.playlist-grid) {
        column-gap: var(--spacing-lg);
        row-gap: var(--spacing-xl);
        grid-template-columns: repeat(auto-fill, minmax(190px, 1fr));
    }

    :global(.playlist-scroll) .playlist-card {
        width: 220px;
    }

    :global(.playlist-card) {
        height: 100%; /* equal height with siblings */
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
    }

    :global(.highlight .playlist-card) {
        border: 2px solid var(--color-highlight);
    }

    .image-container {
        overflow: hidden;
        position: relative;
    }

    .image-container :global(a) {
        display: flex; /* white space removal */
    }

    .details {
        padding: var(--spacing-md);
        padding-block-end: 0;
        text-align: center;
    }

    .title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: center;
    }

    .title :global(a) {
        display: block;
        padding: var(--spacing-md);
        font-size: 16px;
    }

    .count {
        margin-block-start: var(--spacing-sm);
        margin-block-end: var(--spacing-sm);
    }

    .private {
        z-index: 20;
        position: absolute;
        inset-block-end: 5px;
        inset-inline-end: 5px;
        text-transform: uppercase;
        letter-spacing: 0.03em;
        font-weight: 700;
        font-size: 0.8em;
        box-shadow: var(--shadow-md);
        border: 1px solid var(--color-background);
        pointer-events: none;
    }

    .rating-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin: var(--spacing-md);
    }

    .actions {
        display: flex;
        justify-content: center;
    }
</style>