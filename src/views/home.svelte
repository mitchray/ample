<script>
    import { _ } from "svelte-i18n";
    import CardList from "~/components/cards/cardList.svelte";
    import AlbumCard from "~/components/cards/albumCard.svelte";
    import SongCard from "~/components/cards/songCard.svelte";
    import MixCard from "~/components/cards/mixCard.svelte";
    import { newestAlbums, randomAlbums } from "~/logic/album.js";
    import { artistMixes } from "~/logic/playlist.js";
    import { recentSongs } from "~/logic/song.js";
    import { PageTitle } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let title = $_("text.home");
    $PageTitle = title;
</script>

<div class="explore">
    <sl-button href="#/favorites" size="large">
        <MaterialSymbol name="favorite" slot="prefix" />
        {$_("text.favorites")}
    </sl-button>

    <sl-button href="#/trending" size="large">
        <MaterialSymbol name="trending_up" slot="prefix" />
        {$_("text.trending")}
    </sl-button>

    <sl-button href="#/top-rated" size="large">
        <MaterialSymbol name="star" slot="prefix" />
        {$_("text.topRated")}
    </sl-button>

    <sl-button href="#/forgotten" size="large">
        <MaterialSymbol name="trending_down" slot="prefix" />
        {$_("text.forgotten")}
    </sl-button>

    <sl-button href="#/random" size="large">
        <MaterialSymbol name="gesture" slot="prefix" />
        {$_("text.random")}
    </sl-button>

    <sl-button href="#/unrated" size="large">
        <MaterialSymbol fill={false} name="star" slot="prefix" />
        {$_("text.unrated")}
    </sl-button>
</div>

<CardList
    card={AlbumCard}
    dataProvider={newestAlbums}
    heading={$_("text.newestAlbums")}
    layout="scroll"
    limit="12"
    type="album"
    viewAllURL="#/newest"
/>

<CardList
    card={MixCard}
    dataProvider={artistMixes}
    heading={$_("text.artistMixes")}
    layout="scroll"
    limit="5"
    refresh="true"
    type="mix"
/>

<CardList
    autoRefreshInterval={5}
    card={SongCard}
    dataProvider={recentSongs}
    heading={$_("text.recentlyPlayed")}
    layout="scroll"
    limit="10"
    type="song"
    viewAllURL="#/recent"
/>

<CardList
    card={AlbumCard}
    dataProvider={randomAlbums}
    heading={$_("text.randomAlbums")}
    layout="scroll"
    limit="12"
    refresh="true"
    type="album"
/>

<style>
    .explore {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: var(--spacing-md);
        margin-block-end: var(--spacing-xl);
    }
</style>
