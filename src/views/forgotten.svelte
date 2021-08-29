<script>
    import CardList from '../components/cardList.svelte';
</script>

<h1>Forgotten</h1>

<CardList type="artist" dataProvider={"forgottenArtists"} limit=12 containerType="scroll" heading="Artists" />

<CardList type="album" dataProvider={"forgottenAlbums"} limit=12 containerType="scroll" heading="Albums" />

<CardList type="song" dataProvider={"forgottenSongs"} limit=9 containerType="scroll" heading="Songs" />
