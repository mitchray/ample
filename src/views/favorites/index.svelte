<script>
    import { _ } from "svelte-i18n";
    import { PageTitle } from "~/stores/state.js";
    import Artists from "~/views/favorites/artists.svelte";
    import Albums from "~/views/favorites/albums.svelte";
    import Songs from "~/views/favorites/songs.svelte";
    import Visibility from "~/components/visibility.svelte";
    import { replace } from "svelte-spa-router";
    import StatsLinks from "~/components/statsLinks.svelte";

    let { params = {} } = $props();

    // default to artists tab
    $effect(() => {
        if (!params.section) replace(`#/favorites/artists`);
    });

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

<StatsLinks />

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

<sl-tab-group onsl-tab-show={changeTab}>
    {#each tabs as tab}
        <sl-tab slot="nav" panel={tab.id} active={tab.id === params.section}>
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
