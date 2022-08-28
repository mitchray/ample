<script>
    import { Link } from "svelte-routing";

    import Actions from '../../components/actions.svelte';
    import PlaylistArt from '../../components/playlist/playlist_art.svelte';

    export let data = null;

    let smartlist;
    $: smartlist = data;
</script>

<div class="playlist-card card">
    {#if smartlist}
        <div class="image-container">
            <Link to="smartlists/{smartlist.id}" title="{smartlist.name}">
                <PlaylistArt bind:playlist={smartlist} fallback="{smartlist.art}" />
            </Link>
        </div>

        <div class="title">
            <Link to="smartlists/{smartlist.id}" title="{smartlist.name}">{smartlist.name}</Link>
        </div>

        <div class="count">
            {#if typeof smartlist.items === "number"}
                Up to {smartlist.items} songs
            {:else}
                {smartlist.items} {parseInt(smartlist.items) === 1 ? 'song' : 'songs'}
            {/if}
        </div>

        <div class="actions">
            <Actions
                type="playlist"
                mode="miniButtons"
                id="{smartlist.id}"
            />
        </div>
    {:else}
        <div class="title">
            Loading
        </div>

        <div class="count">
            <br>
        </div>

        <div class="actions">
            <Actions type="playlist" mode="miniButtons" />
        </div>
    {/if}
</div>

<style>
    .image-container {
        font-size: 0;
        border-radius: 5px;
        overflow: hidden;
        margin-bottom: var(--spacing-md);
    }

    .title {
        margin-bottom: var(--spacing-md);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .actions {
        margin-top: var(--spacing-md);
    }
</style>