<script>
    import CardList from '../components/cardList.svelte';
    import { newestAlbums, randomAlbums } from "../logic/album";
</script>

<svelte:head>
    <title>Ample</title>
</svelte:head>

<CardList type="album" dataProvider={"newestAlbums"} limit=12 containerType="scroll" heading="Newest Albums" />

<CardList type="artist_mix" dataProvider={"artistMixes"} limit=5 refresh=true containerType="scroll" heading="Artist Mixes" />

<CardList type="recent_songs" dataProvider={"recentSongs"} limit=10 containerType="scroll" heading="Recently Played" />

<CardList type="album" dataProvider={"randomAlbums"} limit=12 refresh=true containerType="scroll" heading="Random Albums" />

