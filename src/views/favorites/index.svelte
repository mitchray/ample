<script>
    import { _ } from "svelte-i18n";
    import { PageTitle } from "~/stores/state.js";
    import Artists from "~/views/favorites/artists.svelte";
    import Albums from "~/views/favorites/albums.svelte";
    import Songs from "~/views/favorites/songs.svelte";
    import { replace } from "svelte-spa-router";

    export let params = {};

    // default to artists tab
    $: {
        if (!params.section) replace(`#/favorites/artists`);
    }

    function changeTab(e) {
        replace(`#/favorites/${e.detail.name}`);
    }

    let title = $_("text.favorites");
    $PageTitle = title;

    let tabs = [
        { id: "artists", label: $_("text.artists") },
        { id: "albums", label: $_("text.albums") },
        { id: "songs", label: $_("text.songs") },
    ];
</script>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

<sl-tab-group on:sl-tab-show={changeTab}>
    {#each tabs as tab}
        <sl-tab slot="nav" panel={tab.id} active={tab.id === params.section}>
            {tab.label}
        </sl-tab>
    {/each}

    <sl-tab-panel name="artists">
        <Artists />
    </sl-tab-panel>

    <sl-tab-panel name="albums">
        <Albums />
    </sl-tab-panel>

    <sl-tab-panel name="songs">
        <Songs />
    </sl-tab-panel>
</sl-tab-group>
