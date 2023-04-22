<script>
    import CardList from '../components/cardList.svelte';
    import RecentlyPlayed from '../components/song/recentlyPlayed.svelte';
    import { newestAlbums, randomAlbums } from "../logic/album";
</script>

<svelte:head>
    <title>Ample</title>
</svelte:head>

<CardList type="album" dataProvider={"newestAlbums"} limit=12 containerType="scroll" heading="Newest Albums" />

<CardList type="artist_mix" dataProvider={"artistMixes"} limit=5 refresh=true containerType="scroll" heading="Artist Mixes" />

<h2>Recently Played</h2>
<RecentlyPlayed />

<CardList type="album" dataProvider={"randomAlbums"} limit=12 refresh=true containerType="scroll" heading="Random Albums" />

