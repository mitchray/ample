<script>
    import { fade } from 'svelte/transition';

    import { getSmartlists } from "../logic/playlist";

    import PlaylistCard from '../components/playlist/playlistCard.svelte';
</script>

<h1 class="page-title">Smartlists</h1>

{#await getSmartlists()}
    <p>Loading smartlists</p>
{:then smartlists}
    {#if smartlists.length > 0}
        <ul class="playlist-grid" in:fade>
            {#each smartlists as smartlist}
                <li>
                    <PlaylistCard data={smartlist} isSmartlist={true} />
                </li>
            {/each}
        </ul>
    {:else}
        <p>Unable to find any smartlists</p>
    {/if}
{:catch error}
    <p>Something went wrong: {error.message}</p>
{/await}