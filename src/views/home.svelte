<script>
    import CardList from '../components/cardList.svelte';

    import { CurrentMedia } from "../stores/status";

    import { recentSongs } from "../logic/song";
    import { newestAlbums, randomAlbums } from "../logic/album";
</script>

<svelte:head>
    <title>Ample</title>
</svelte:head>

<CardList type="album" dataProvider={"newestAlbums"} limit=12 containerType="scroll" heading="Newest Albums" />

<CardList type="artist_mix" dataProvider={"artistMixes"} limit=5 refresh=true containerType="scroll" heading="Artist Mixes" />

{#key ($CurrentMedia) ? $CurrentMedia.id : 0}
    <CardList type="song" dataProvider={"recentSongs"} limit=9 containerType="scroll" heading="Recently Played" />
{/key}

<CardList type="album" dataProvider={"randomAlbums"} limit=12 refresh=true containerType="scroll" heading="Random Albums" />

