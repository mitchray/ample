<script>
    import CardList from '../components/cardList.svelte';
</script>

<h1 class="page-title">Trending</h1>

<CardList type="artist" dataProvider={"frequentArtists"} limit=12 containerType="scroll" heading="Artists" />

<CardList type="album" dataProvider={"frequentAlbums"} limit=12 containerType="scroll" heading="Albums" />

<CardList type="song" dataProvider={"frequentSongs"} limit=9 containerType="scroll" heading="Songs" />
