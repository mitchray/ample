<script>
    import { run } from "svelte/legacy";

    import { _ } from "svelte-i18n";
    import { PageTitle } from "~/stores/state.js";
    import Artists from "~/views/trending/artists.svelte";
    import Albums from "~/views/trending/albums.svelte";
    import Songs from "~/views/trending/songs.svelte";
    import { replace } from "svelte-spa-router";
    import Visibility from "~/components/visibility.svelte";

    let { params = {} } = $props();

    // default to artists tab
    run(() => {
        if (!params.section) replace(`#/trending/artists`);
    });

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
