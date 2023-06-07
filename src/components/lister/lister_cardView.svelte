<script>
    import { _ } from 'svelte-i18n';
    import { onMount, getContext, tick } from 'svelte';
    import Pagination from '../../components/Pagination.svelte';

    export let contextKey;

    const { _type, dataFinal, dataDisplay } = getContext(contextKey);

    let card;
    let containerClass;
    let defaultLimit = 50;
    let page = 0;
    let count = 0;
    let limit = 0;

    $: count = $dataFinal.length || 0;

    $: {
        if (limit > 0) {
            resetPage();
        }
    }

    $: {
        if (limit > 0 || page) {
            filterData();
        }
    }

    function resetPage() {
        page = 0;
    }

    function filterData() {
        $dataFinal = $dataDisplay.slice(page * limit, (page * limit) + limit).map((d, i) => {
            return d;
        })
    }

    onMount(async () => {
        switch ($_type) {
            case 'artist':
                card = (await import('../../components/artist/artistCard.svelte')).default;
                containerClass = "cardlist-grid artist-grid";
                break;
            case 'album':
                card = (await import('../../components/album/albumCard.svelte')).default;
                containerClass = "cardlist-grid album-grid";
                break;
            case 'song':
                card = (await import('../../components/song/songCard.svelte')).default;
                containerClass = "cardlist-grid song-grid";
                break;
            case 'playlist':
                card = (await import('../../components/playlist/playlistCard.svelte')).default;
                containerClass = "cardlist-grid playlist-grid";
                break;
            case 'smartlist':
                card = (await import('../../components/playlist/playlistCard.svelte')).default;
                containerClass = "cardlist-grid playlist-grid";
                break;
            case 'genre':
                card = (await import('../../components/genre/genreCard.svelte')).default;
                containerClass = "cardlist-grid genre-grid";
                break;
            default:
                break;
        }

        await tick();
    })
</script>

<div class="container {containerClass}">
    {#if $dataFinal.length > 0}
        {#each $dataFinal as row, i (i)}
            <svelte:component this={card} data={row} />
        {/each}
    {:else}
        <p>{$_('text.noItemsFound')}</p>
    {/if}
</div>

<Pagination bind:limit bind:page bind:count type="lister-grid-{$_type}" defaultLimit={defaultLimit} />
