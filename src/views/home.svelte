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

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="explore">
    <sl-button size="large" href="#/favorites">
        <MaterialSymbol name="favorite" slot="prefix" />
        {$_("text.favorites")}
    </sl-button>

    <sl-button size="large" href="#/trending">
        <MaterialSymbol name="trending_up" slot="prefix" />
        {$_("text.trending")}
    </sl-button>

    <sl-button size="large" href="#/top-rated">
        <MaterialSymbol name="star" slot="prefix" />
        {$_("text.topRated")}
    </sl-button>

    <sl-button size="large" href="#/forgotten">
        <MaterialSymbol name="trending_down" slot="prefix" />
        {$_("text.forgotten")}
    </sl-button>

    <sl-button size="large" href="#/random">
        <MaterialSymbol name="gesture" slot="prefix" />
        {$_("text.random")}
    </sl-button>

    <sl-button size="large" href="#/unrated">
        <MaterialSymbol name="star" slot="prefix" fill={false} />
        {$_("text.unrated")}
    </sl-button>
</div>

<CardList
    card={AlbumCard}
    type="album"
    dataProvider={newestAlbums}
    limit="12"
    layout="scroll"
    heading={$_("text.newestAlbums")}
    viewAllURL="#/newest"
/>

<CardList
    card={MixCard}
    type="mix"
    dataProvider={artistMixes}
    limit="5"
    refresh="true"
    layout="scroll"
    heading={$_("text.artistMixes")}
/>

<CardList
    card={SongCard}
    type="song"
    dataProvider={recentSongs}
    limit="10"
    layout="scroll"
    heading={$_("text.recentlyPlayed")}
    viewAllURL="#/recent"
    autoRefreshInterval={5}
/>

<CardList
    card={AlbumCard}
    type="album"
    dataProvider={randomAlbums}
    limit="12"
    refresh="true"
    layout="scroll"
    heading={$_("text.randomAlbums")}
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
