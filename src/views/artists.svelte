<script>
    import LinkCard from '../components/linkCard.svelte';
    import CardList from '../components/cardList.svelte';

    import { newestArtists, randomArtists } from "../logic/artist";
</script>

<h1>Artists</h1>

<section class="link-grid">
    <LinkCard url="artists/all">All Artists</LinkCard>
</section>

<CardList type="artist" dataProvider={"newestArtists"} limit=6 heading="Recently updated" />

<CardList type="artist" dataProvider={"randomArtists"} limit=6 refresh=true heading="Random" />