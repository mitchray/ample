<script>
    import CardList from '../components/cardList.svelte';
</script>

<svelte:head>
    <title>Newest</title>
</svelte:head>

<h1 class="page-title">Newest</h1>

<CardList type="album" dataProvider={"newestAlbums"} limit=18 />
