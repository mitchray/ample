<script>
    import { Link } from "svelte-routing";
    import { serverURL } from "../../stores/server";
    import { API } from "../../stores/api";
    import Actions2 from '../../components/action/actions.svelte';
    import samplesize from "lodash/sampleSize";

    export let data = null; // needed for cardList dynamic components

    let playlist;
    let similars = Promise.resolve([]);

    $: playlist = data;
    $: {
        if (playlist?.id) {
            getSimilar();
        }
    }

    function getSimilar() {
        similars = $API.getSimilar({ type: "artist", filter: playlist?.id, limit: 15 })
            .then((results) => {
                return samplesize(results, 3);
            });
    }
</script>

<div class="mix-card card">
    {#if playlist?.id}
        <div class="image-container">
            <Link to="mix/{playlist.playlistType}/{playlist.id}" title="{playlist.name}">
                <div class="image-text">{playlist.name} <span class="mix-text">Mix</span></div>
                <img class="image"
                     src="{playlist.art}&thumb=22"
                     alt="Image of {playlist.name}"
                     width="400"
                     height="400"
                     on:error={e => { e.onerror=null; e.target.src=$serverURL + '/image.php?object_id=0&object_type=artist&thumb=22' }}
                />
            </Link>
        </div>

        <div class="details">
            <div class="similar">
                {#await similars}
                    Finding similar artists
                    <br>
                {:then artists}
                    {#if artists.length > 0}
                        {#each artists as artist, i}
                            <span>
                                <Link to="artists/{artist.id}" title="{artist.name}">{artist.name}</Link>{#if i + 1 < artists.length},&nbsp;{/if}
                            </span>
                        {/each}

                        {#if artists.length === 3}
                            & more
                        {/if}
                    {:else}
                        Just {playlist.name}
                    {/if}
                {/await}
            </div>

            <div class="actions">
                <Actions2
                    type="artistMix"
                    mode="miniButtons"
                    id="{playlist.id}"
                />
            </div>
        </div>
    {:else}
        <div class="image-container">
            <div class="image-text">Loading</div>
            <img class="image"
                 height="400"
                 width="400"
                 src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                 alt=""
            >
        </div>

        <div class="details">
            <div class="similar">
                <br><br>
            </div>
            <div class="actions">
                <Actions2 type="playlist" mode="miniButtons"/>
            </div>
        </div>
    {/if}
</div>

<style>
    /* Playlist grids should have this on the containing element */
    :global(.mix-grid) {
        display: grid;
        column-gap: var(--spacing-lg);
        row-gap: var(--spacing-xl);
        grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    }

    :global(.mix-scroll) {
        border: 2px solid var(--color-separator);
        border-radius: 15px;
        padding: var(--spacing-lg);
        gap: var(--spacing-lg);
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        padding-bottom: 20px;
    }

    :global(.mix-scroll) .mix-card {
        width: 220px;
    }

    :global(.mix-card) {
        height: 100%; /* equal height with siblings */
        display: flex;
        flex-direction: column;
        position: relative;
        overflow: hidden;
    }

    :global(.highlight .mix-card) {
        border: 2px solid var(--color-highlight);
    }

    .image {
        filter: saturate(0%) brightness(100%) contrast(70%);
        mix-blend-mode: luminosity;
        position: relative;
        opacity: 0.5;
    }

    .image-container {
        position: relative;
        z-index: 1;
        justify-content: center;
        display: flex;
        border-radius: 5px;
        overflow: hidden;
        aspect-ratio: 1 / 1;
        background-color: var(--color-mix-background);
    }

    .image-container :global(img) {
        color: transparent;
        height: 100%;
        object-fit: cover;
        width: 100%;
    }

    .image-container :global(a) {
        display: flex; /* white space removal */
    }

    .image-text {
        z-index: 100;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: var(--spacing-md);
        font-size: 18px;
        font-weight: 700;
        line-height: 1.2;
        color: white;
    }

    .image-text::before {
        content: '';
        pointer-events: none;
        height: calc(100% + var(--spacing-xxl));
        width: 100%;
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: linear-gradient(
                to bottom,
                transparent,
                var(--color-mix-background)
        );
        z-index: -1;
    }

    .mix-text {
        font-weight: 400;
    }

    .details {
        padding: var(--spacing-md);
        padding-bottom: 0;
        text-align: center;
    }

    .similar {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        overflow: hidden;
        margin-bottom: var(--spacing-md);
    }

    .actions {
        display: flex;
        justify-content: center;
    }
</style>