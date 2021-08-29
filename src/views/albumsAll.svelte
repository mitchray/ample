<script>
    import { allAlbums } from '../stores/server';

    import AlphanumericPagination from '../components/alphanumericPagination.svelte';
    import Actions from '../components/actions.svelte';
    import Lister from '../components/lister.svelte';

    let selectedChar = ''; // bound from alphanumericPagination
    let filterChars = "";
    let dataDisplay = [];

    $: {
        if ($allAlbums.loaded) {
            filterChars = selectedChar.replaceAll("#", "(\\d|\\W)");

            if (selectedChar) {
                dataDisplay = $allAlbums.data.filter(function(a) {
                    let regex = new RegExp("^" + filterChars, "i");

                    return regex.test(a.name);
                });
            } else {
                dataDisplay = $allAlbums.data;
            }
        }
    }
</script>

<h1>Albums by name</h1>

<AlphanumericPagination bind:selectedChar={selectedChar} type="albums" />

{#if $allAlbums.loaded}
    {#key selectedChar}
        <Actions type="albumAlpha" mode="fullButtons" data={{char: selectedChar}} count="3" />

        <Lister data={dataDisplay} type="album" />
    {/key}
{/if}