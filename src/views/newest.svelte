<script>
    import CardList from '../components/cardList.svelte';
</script>

<h1 class="page-title">Newest</h1>

<CardList type="album" dataProvider={"newestAlbums"} limit=18 heading="Recently added" />
