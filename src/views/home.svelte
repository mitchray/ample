<script>
    import { _ } from 'svelte-i18n';
    import CardList from '../components/cardList.svelte';
    import { newestAlbums, randomAlbums } from "../logic/album";
    import { PageTitle } from "../stores/status";

    let title = $_('title.home');
    $PageTitle = title;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<CardList type="album" dataProvider={"newestAlbums"} limit=12 containerType="scroll" heading="{$_('text.newestAlbums')}" />

<CardList type="artist_mix" dataProvider={"artistMixes"} limit=5 refresh=true containerType="scroll" heading="{$_('text.artistMixes')}" />

<CardList type="recent_songs" dataProvider={"recentSongs"} limit=10 containerType="scroll" heading="{$_('text.recentlyPlayed')}" />

<CardList type="album" dataProvider={"randomAlbums"} limit=12 refresh=true containerType="scroll" heading="{$_('text.randomAlbums')}" />

