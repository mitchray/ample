<script>
    import CardList from '../components/cardList.svelte';
</script>

<h1>Recently Played</h1>

<CardList type="song" dataProvider={"recentSongs"} limit=20 heading="Songs" />
