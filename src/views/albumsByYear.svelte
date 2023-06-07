<script>
    import {_} from "svelte-i18n";
    import { PageTitle } from "../stores/status";
    import AlbumsByYear from '../components/album/albumsByYear.svelte';

    export let year;

    let title = $_('title.albumsByYear');
    $PageTitle = title;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="page-main">
    {#key year || 0}
        <AlbumsByYear showYear={year} />
    {/key}
</div>