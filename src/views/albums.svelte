<script>
    import LinkCard from '../components/linkCard.svelte';
    import CardList from '../components/cardList.svelte';

    import { newestAlbums, randomAlbums } from "../logic/album";
</script>

<h1 class="page-title">Albums</h1>

<section class="link-grid">
    <LinkCard url="albums/all">All Albums</LinkCard>
    <LinkCard url="albums/year">By Year</LinkCard>
</section>

<CardList type="album" dataProvider={"newestAlbums"} limit=6 heading="Newest" />

<CardList type="album" dataProvider={"randomAlbums"} limit=6 refresh=true heading="Random" />