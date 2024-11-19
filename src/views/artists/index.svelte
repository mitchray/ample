<script>
    import { run } from "svelte/legacy";

    import { _ } from "svelte-i18n";
    import { replace } from "svelte-spa-router";
    import { PageTitle } from "~/stores/state.js";
    import ArtistsAll from "~/components/artist/artistsAll.svelte";
    import Newest from "~/views/artists/newest.svelte";
    import Random from "~/views/artists/random.svelte";
    import Visibility from "~/components/visibility.svelte";

    let { params = {} } = $props();

    // default to the newest tab
    run(() => {
        if (!params.section) replace(`#/artists/newest`);
    });

    // List of tab items with labels and values.
    let tabs = [
        { id: "newest", label: $_("text.recentlyUpdated") },
        { id: "random", label: $_("text.random") },
        { id: "all", label: $_("text.all") },
    ];

    function changeTab(e) {
        replace(`#/artists/${e.detail.name}`);
    }

    let title = $_("text.artists");
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

    <sl-tab-panel name="newest">
        <Visibility><Newest /></Visibility>
    </sl-tab-panel>

    <sl-tab-panel name="random">
        <Visibility><Random /></Visibility>
    </sl-tab-panel>

    <sl-tab-panel name="all">
        <Visibility><ArtistsAll type="artist" /></Visibility>
    </sl-tab-panel>
</sl-tab-group>
