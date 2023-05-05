<script>
    import { PageTitle } from "../stores/status";
    import CardList from '../components/cardList.svelte';

    let title = "Recent";
    $PageTitle = title;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="page-main">
    <CardList type="song" dataProvider={"recentSongs"} limit=20 />
</div>
