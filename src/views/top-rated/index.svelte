<script>
    import { _ } from "svelte-i18n";
    import { PageTitle } from "~/stores/state.js";
    import { replace } from "svelte-spa-router";
    import Albums from "./albums.svelte";
    import Songs from "./songs.svelte";
    import Artists from "./artists.svelte";

    export let params = {};

    // default to artists tab
    $: {
        if (!params.section) replace(`#/top-rated/artists`);
    }

    function changeTab(e) {
        replace(`#/top-rated/${e.detail.name}`);
    }

    let tabs = [
        { id: "artists", label: $_("text.artists") },
        { id: "albums", label: $_("text.albums") },
        { id: "songs", label: $_("text.songs") },
    ];

    let title = $_("text.topRated");
    $PageTitle = title;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

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
