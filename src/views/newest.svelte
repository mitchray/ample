<script>
    import CardList from '../components/cardList.svelte';
</script>

<h1>Newest</h1>

<CardList type="album" dataProvider={"newestAlbums"} limit=18 heading="Recently added" />
