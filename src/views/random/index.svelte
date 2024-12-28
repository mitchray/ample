<script>
    import { _ } from "svelte-i18n";
    import { PageTitle } from "~/stores/state.js";
    import { replace } from "svelte-spa-router";
    import Albums from "~/views/random/albums.svelte";
    import Songs from "~/views/random/songs.svelte";
    import Artists from "~/views/random/artists.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import Visibility from "~/components/visibility.svelte";
    import StatsLinks from "~/components/statsLinks.svelte";

    let { params = {} } = $props();

    let loadedTime = $state();

    // default to artists tab
    $effect(() => {
        if (!params.section) replace(`#/random/artists`);
    });

    // List of tab items with labels and values.
    let tabs = [
        { id: "artists", label: $_("text.artists") },
        { id: "albums", label: $_("text.albums") },
        { id: "songs", label: $_("text.songs") },
    ];

    function changeTab(e) {
        replace(`#/random/${e.detail.name}`);
    }

    function refreshItems() {
        loadedTime = Date.now();
    }

    let title = $_("text.random");
    $PageTitle = title;
</script>

<StatsLinks />

<div class="page-header">
    <h1 class="page-title">{title}</h1>

    <sl-button onclick={refreshItems} size="small">
        <MaterialSymbol name="refresh" slot="prefix" /> Refresh
    </sl-button>
</div>

{#key loadedTime || 0}
    <sl-tab-group onsl-tab-show={changeTab}>
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
