<script>
    import CardList from '../components/cardList.svelte';

    import { CurrentSong } from "../stores/status";

    import { recentSongs } from "../logic/song";
    import { newestAlbums, randomAlbums } from "../logic/album";
</script>

<CardList type="album" dataProvider={"newestAlbums"} limit=12 containerType="scroll" heading="Newest albums" />

{#key ($CurrentSong) ? $CurrentSong.id : 0}
    <CardList type="song" dataProvider={"recentSongs"} limit=9 containerType="scroll" heading="Recently played" />
{/key}

<CardList type="album" dataProvider={"randomAlbums"} limit=12 refresh=true containerType="scroll" heading="Random albums" />

