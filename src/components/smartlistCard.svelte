<script>
    import { Link } from "svelte-routing";

    import Actions from '../components/actions.svelte';

    export let data = null;

    let smartlist;
    $: smartlist = data;
</script>

<div class="playlist-card">
    {#if smartlist}
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
    .title {
        font-weight: 700;
        margin-bottom: var(--spacing-md);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .actions {
        margin-top: var(--spacing-md);
    }
</style>