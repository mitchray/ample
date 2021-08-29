<script>
    import CardList from '../components/cardList.svelte';
</script>

<h1>Random</h1>

<CardList type="artist" dataProvider={"randomArtists"} limit=6 refresh=true heading="Artists" />

<CardList type="album" dataProvider={"randomAlbums"} limit=6 refresh=true heading="Albums" />

<CardList type="song" dataProvider={"randomSongs"} limit=9 refresh=true heading="Songs" />
