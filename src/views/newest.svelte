<script>
    import CardList from '../components/cardList.svelte';
    import { PageTitle } from "../stores/status";

    let title = "Newest";
    $PageTitle = title;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="page-main">
    <CardList type="album" dataProvider={"newestAlbums"} limit=18 />
</div>
