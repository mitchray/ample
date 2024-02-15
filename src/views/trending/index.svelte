<script>
    import { _ } from "svelte-i18n";
    import { PageTitle } from "~/stores/state.js";
    import Artists from "./artists.svelte";
    import Albums from "./albums.svelte";
    import Songs from "./songs.svelte";
    import { replace } from "svelte-spa-router";

    export let params = {};

    // default to artists tab
    $: {
        if (!params.section) replace(`#/trending/artists`);
    }

    // List of tab items with labels and values.
    let tabs = [
        { id: "artists", label: $_("text.artists") },
        { id: "albums", label: $_("text.albums") },
        { id: "songs", label: $_("text.songs") },
    ];

    function changeTab(e) {
        replace(`#/trending/${e.detail.name}`);
    }

    let title = $_("text.trending");
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
