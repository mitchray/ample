<script>
    import CardList from '../components/cardList.svelte';
</script>

<svelte:head>
    <title>Recent</title>
</svelte:head>

<h1 class="page-title">Recently Played</h1>

<CardList type="song" dataProvider={"recentSongs"} limit=20 />
