<script>
    import { _ } from "@rgglez/svelte-i18n";
    import CardList from "~/components/cards/cardList.svelte";
    import AlbumCard from "~/components/cards/albumCard.svelte";
    import SongCard from "~/components/cards/songCard.svelte";
    import MixCard from "~/components/cards/mixCard.svelte";
    import StatsLinks from "~/components/statsLinks.svelte";
    import { newestAlbums, randomAlbums } from "~/logic/album.js";
    import { artistMixes } from "~/logic/playlist.js";
    import { recentSongs } from "~/logic/song.js";
    import { PageTitle } from "~/stores/state.js";

    let title = $_("text.home");
    $PageTitle = title;
</script>

<StatsLinks />

<CardList
    card={AlbumCard}
    dataProvider={newestAlbums}
    heading={$_("text.newestAlbums")}
    layout="scroll"
    limit="12"
    type="album"
    viewAllURL="#/newest"
/>

<sl-divider style="--spacing: var(--spacing-xxl)"></sl-divider>

<CardList
    card={MixCard}
    dataProvider={artistMixes}
    heading={$_("text.artistMixes")}
    layout="scroll"
    limit="5"
    refresh="true"
    type="mix"
/>

<sl-divider style="--spacing: var(--spacing-xxl)"></sl-divider>

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

<sl-divider style="--spacing: var(--spacing-xxl)"></sl-divider>

<CardList
    card={AlbumCard}
    dataProvider={randomAlbums}
    heading={$_("text.randomAlbums")}
    layout="scroll"
    limit="12"
    refresh="true"
    type="album"
/>
