<script>
    import {_} from "svelte-i18n";
    import { PageTitle } from "../stores/status";
    import AlbumsByYear from '../components/album/albumsByYear.svelte';

    export let params = {}

    let title = $_('text.albumsByYear');
    $PageTitle = title;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="page-main">
    {#key params.year || 0}
        <AlbumsByYear showYear={params.year} />
    {/key}
</div>