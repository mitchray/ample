<script>
    import { _ } from "svelte-i18n";
    import { PageTitle } from "~/stores/state.js";
    import { recentSongs } from "~/logic/song.js";
    import SongCard from "~/components/cards/songCard.svelte";
    import CardList from "~/components/cards/cardList.svelte";

    let title = $_("text.recent");
    $PageTitle = title;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

<CardList
    card={SongCard}
    layout="grid"
    type="song"
    dataProvider={recentSongs}
    limit="20"
/>
