<script>
    import { Link } from "svelte-routing";
    import { serverURL } from "../../stores/server";

    import Rating from '../../components/rating.svelte';
    import Actions2 from '../../components/action/actions.svelte';

    export let data = null; // needed for cardList dynamic components

    let podcast;
    $: podcast = data;
</script>

<div class="podcast-card card">
    {#if podcast}
        <div class="image-container">
            <img class="image"
                src="{podcast.art}&thumb=22"
                alt="Image of {podcast.name}"
                width="200"
                height="200"
                on:error={e => { e.onerror=null; e.target.src=$serverURL + '/image.php?object_id=0&object_type=song&thumb=22' }}
            />
        </div>

        <div class="info">
            <div class="top">
                <div class="title" title="{podcast.name}"><Link to="podcast/{podcast.id}">{podcast.name}</Link></div>
            </div>

            <div class="bottom">
                <div class="meta">
                    <span class="description" title="{podcast.description}">{podcast.description}</span>
                </div>

                <Rating type="podcast" id="{podcast.id}" rating="{podcast.rating}" flag="{podcast.flag}" averageRating="{podcast.averagerating}" />

                <div class="actions">
                    <Actions2
                        type="podcast"
                        mode="miniButtons"
                        id="{podcast.id}"
                    />
                </div>
            </div>
        </div>
    {:else}
        <div class="image-container">
            <img class="image"
                height="200"
                width="200"
                src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                alt=""
            >
        </div>

        <div class="info">
            <div class="top">
                <div class="title">Loading</div>
            </div>

            <div class="bottom">
                <div class="meta">
                    <span class="description"><br></span>
                </div>

                <Rating />

                <div class="actions">
                    <Actions2 type="song" mode="miniButtons" />
                </div>
            </div>
        </div>
    {/if}
</div>

<style>
    /* Podcast grids should have this on the containing element */
    :global(.podcast-grid) {
        gap: 20px;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }

    :global(.podcast-scroll) .podcast-card {
        width: 350px;
    }

    .podcast-card {
        padding: var(--spacing-md);
        height: 100%; /* equal height with siblings */
        display: flex;
    }

    .image-container {
        font-size: 0;
        position: relative;
        width: 150px;
        height: 150px;
        aspect-ratio: 1 / 1;
        flex-shrink: 0;
        flex-grow: 0;
        border: 1px solid hsla(0, 0%, 50%, 0.2);
        border-radius: 5px;
        overflow: hidden;
    }

    .image-container :global(.image) {
        object-fit: cover;
        color: transparent;
        height: 100%;
        width: 100%;
    }

    .info {
        margin-left: var(--spacing-md);
        display: flex;
        flex-direction: column;
        flex: 1;
        overflow: hidden;
    }

    .top {
        background-color: var(--color-card-highlight);
        padding: var(--spacing-md) var(--spacing-md);
        margin-bottom: var(--spacing-sm);
        border-radius: 5px;
    }

    .title {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .description {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        overflow: hidden;
    }

    .meta {
        display: flex;
        gap: var(--spacing-lg);
        flex: 1;
        margin-bottom: var(--spacing-sm);
    }

    .bottom {
        display: flex;
        flex-direction: column;
        flex: 1;
    }

    .actions {
        margin-top: var(--spacing-md);
    }
</style>