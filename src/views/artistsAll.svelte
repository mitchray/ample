<script>
    import { allArtists } from '../stores/server';
    import { ShowAlbumArtistsOnly } from "../stores/status";

    import AlphanumericPagination from '../components/alphanumericPagination.svelte';
    import Actions from '../components/actions.svelte';
    import Lister2 from '../components/lister/lister.svelte';

    let selectedChar = ''; // bound from alphanumericPagination
    let filterChars = "";
    let filteredData = [];
    let dataDisplay = [];

    $: {
        if ($allArtists.loaded) {
            filteredData = $ShowAlbumArtistsOnly ? $allArtists.data.filter(a => a.albumcount > 0) : $allArtists.data;

            filterChars = selectedChar.replaceAll("#", "(\\d|\\W)");

            if (selectedChar) {
                dataDisplay = filteredData.filter(function(a) {
                    let regex = new RegExp("^" + filterChars, "i");

                    return regex.test(a.name);
                });
            } else {
                dataDisplay = filteredData;
            }
        }
    }
</script>

<h1>All artists</h1>

<label>
    <input type=checkbox bind:checked={$ShowAlbumArtistsOnly} />
    Show album artists only
</label>

<AlphanumericPagination bind:selectedChar={selectedChar} type="artists" />

{#if $allArtists.loaded}
    {#key selectedChar + $ShowAlbumArtistsOnly}
        <Actions
            type="artistAlpha"
            mode="fullButtons"
            data={{char: selectedChar}}
        />

        <Lister2 bind:data={dataDisplay} type="artist" />
    {/key}
{/if}

<style>
    label {
        display: inline-block;
        margin-bottom: var(--spacing-lg);
    }
</style>