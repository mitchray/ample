<script>
    import { getContext, tick } from 'svelte';
    import Menu from '../../components/menu.svelte';
    import PlaylistEdit from '../../components/playlist/playlist_edit.svelte';
    import SVGEdit from "/src/images/edit.svg";

    export let contextKey;

    const { getID, getData } = getContext(contextKey);

    let menuIsVisible = false;
    let id = getID();
    let data = getData();

    async function handleAction() {
        menuIsVisible = !menuIsVisible;
        await tick();
    }
</script>

<button
    type="button"
    id="js-action-playlist_edit_{id}"
    on:click={handleAction}
    title="Edit Playlist"
>
    <SVGEdit />
</button>

{#if menuIsVisible}
    <Menu anchor="left" toggleSelector={"#js-action-playlist_edit_" + id} bind:isVisible={menuIsVisible}>
        <PlaylistEdit bind:playlist={data.playlist} bind:isVisible={menuIsVisible} />
    </Menu>
{/if}