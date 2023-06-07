<script>
    import { _ } from 'svelte-i18n';
    import { PageTitle } from "../stores/status";
    import CardList from '../components/cardList.svelte';

    let title = $_('title.recent');
    $PageTitle = title;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="page-main">
    <CardList type="song" dataProvider={"recentSongs"} limit=20 />
</div>
