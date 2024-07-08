<script>
    import { _ } from "svelte-i18n";
    import { PageTitle } from "~/stores/state.js";
    import { replace } from "svelte-spa-router";
    import Artists from "~/views/unrated/artists.svelte";
    import Albums from "~/views/unrated/albums.svelte";
    import Songs from "~/views/unrated/songs.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import Visibility from "~/components/visibility.svelte";

    export let params = {};

    let loadedTime;

    // default to artists tab
    $: {
        if (!params.section) replace(`#/unrated/artists`);
    }

    // List of tab items with labels and values.
    let tabs = [
        { id: "artists", label: $_("text.artists") },
        { id: "albums", label: $_("text.albums") },
        { id: "songs", label: $_("text.songs") },
    ];

    function changeTab(e) {
        replace(`#/unrated/${e.detail.name}`);
    }

    function refreshItems() {
        loadedTime = Date.now();
    }

    let title = $_("text.unrated");
    $PageTitle = title;
</script>

<div class="page-header">
    <h1 class="page-title">{title}</h1>

    <sl-button on:click={refreshItems} size="small">
        <MaterialSymbol name="refresh" slot="prefix" />
        Refresh
    </sl-button>
</div>

{#key loadedTime || 0}
    <sl-tab-group on:sl-tab-show={changeTab}>
        {#each tabs as tab}
            <sl-tab
                slot="nav"
                panel={tab.id}
                active={tab.id === params.section}
            >
                {tab.label}
            </sl-tab>
        {/each}

        <sl-tab-panel name="artists">
            <Visibility><Artists /></Visibility>
        </sl-tab-panel>

        <sl-tab-panel name="albums">
            <Visibility><Albums /></Visibility>
        </sl-tab-panel>

        <sl-tab-panel name="songs">
            <Visibility><Songs /></Visibility>
        </sl-tab-panel>
    </sl-tab-group>
{/key}
