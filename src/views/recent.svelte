<script>
    import { _ } from "svelte-i18n";
    import { PageTitle } from "~/stores/state.js";
    import { recentSongs } from "~/logic/song.js";
    import SongCard from "~/components/cards/songCard.svelte";
    import CardList from "~/components/cards/cardList.svelte";

    let title = $_("text.recent");
    $PageTitle = title;
</script>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

<CardList
    card={SongCard}
    dataProvider={recentSongs}
    layout="grid"
    limit="20"
    type="song"
/>
