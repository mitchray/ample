<script>
    import { _ } from 'svelte-i18n';
    import { onMount } from "svelte";
    import { CurrentMedia } from '../stores/status';
    import { serverURL } from "../stores/server";
    import { cleanArtURL } from "../logic/helper";
    import Actions from '../components/action/actions.svelte';
    import SVGCurrent from "/src/images/play_circle.svg";

    export let data = null;
    export let type = ""; // passed from ...options

    let urlPrefix = "";

    onMount(() => {
        switch (type) {
            case "artist":
                urlPrefix = "artists";
                break;
            case "album":
                urlPrefix = "albums";
                break;
            case "playlist":
                urlPrefix = "playlists";
                break;
            case "smartlist":
                urlPrefix = "smartlists";
                break;
            case "song":
                urlPrefix = "song";
                break;
            default:
                break;
        }
    })
</script>

<div class="card generic-card">
    {#if data}
        {#if data.art}
            <div class="image-container">
                <a href="#/{urlPrefix}/{data.id}">
                    <img class="image"
                         src="{cleanArtURL(data.art)}&thumb=11"
                         alt="Image of {data.name}"
                         width="96"
                         height="96"
                         data-id="art-{type}-{data.id}"
                         on:error={e => { e.onerror=null; e.target.src=$serverURL + '/image.php?object_id=0&object_type=song&thumb=22' }}
                    />
                </a>
            </div>
        {/if}

        <div class="details">
            <div class="title">
                <a href="#/{urlPrefix}/{data.id}">
                    {#if type === "song"}
                        {#if $CurrentMedia?.id === data.id}
                <span class="current-icon">
                    <SVGCurrent class="icon" />
                </span>
                        {/if}
                    {/if}{data.name}
                </a>
            </div>

            <div class="secondary secondary-info">
                {#if type === "album" && data.albumartist}
                    <a href="#/artists/{data.albumartist.id}">{data.albumartist.name}</a>
                {:else if data.artist}
                    <a href="#/artists/{data.artist.id}">{data.artist.name}</a>
                {/if}
            </div>

            <div class="actions">
                <Actions
                        type="{type}"
                        mode="miniButtons"
                        id="{data.id}"
                        showShuffle={data.songcount > 1}
                        data={Object.create({
                    album: data.album ? data.album : null,
                    artists: data.artists?.length > 0 ? data.artists : null,
                    albumArtist: data.albumartist ? data.albumartist : null,
                    playlist: (type === "playlist" ? data : null)
                })}
                />
            </div>
        </div>
    {:else}
        <div class="image-container">
            <img width="200" height="200" class="image" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="">
        </div>

        <div class="details">
            <div class="title">{$_('text.loading')}</div>
            <div class="secondary">{$_('text.loading')}</div>
        </div>

        <div class="actions">
            <Actions type="{type}" mode="miniButtons" />
        </div>
    {/if}
</div>

<style>
    /* Song grids should have this on the containing element */
    :global(.generic-grid) {
        row-gap: var(--spacing-lg);
        column-gap: var(--spacing-md);
        grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    }

    .generic-card {
        display: flex;
        height: 100%; /* equal height with siblings */
        gap: var(--spacing-md);
        border-radius: 3px;
        overflow: hidden;
    }

    .details {
        display: flex;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
    }

    /* so it doesn't affect line height */
    .current-icon :global(svg) {
        display: inline-block;
        vertical-align: middle;
        height: 1em;
        width: 1em;
        position: relative;
        inset-block-start: -2px;
    }

    .title,
    .title span {
        display: inline-block;
        vertical-align: middle;
        margin: 0;
    }

    .title,
    .secondary {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .actions {
        margin-block-start: var(--spacing-sm);
    }

    .image-container {
        font-size: 0;
        position: relative;
        height: 72px;
        aspect-ratio: 1 / 1;
        flex-shrink: 0;
        flex-grow: 0;
        border: 1px solid hsla(0, 0%, 50%, 0.2);
        border-radius: 3px;
        overflow: hidden;
        align-self: start;
    }

    .image-container :global(.image) {
        object-fit: cover;
        color: transparent;
        width: 100%;
    }
</style>