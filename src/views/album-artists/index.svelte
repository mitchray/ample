<script>
    import { run } from 'svelte/legacy';

    import { _ } from "svelte-i18n";
    import { PageTitle } from "~/stores/state.js";
    import ArtistsAll from "~/components/artist/artistsAll.svelte";
    import { replace } from "svelte-spa-router";
    import Random from "~/views/album-artists/random.svelte";
    import Visibility from "~/components/visibility.svelte";

    /** @type {{params?: any}} */
    let { params = {} } = $props();

    // default to random tab
    run(() => {
        if (!params.section) replace(`#/album-artists/random`);
    });

    // List of tab items with labels and values.
    let tabs = [
        { id: "random", label: $_("text.random") },
        { id: "all", label: $_("text.all") },
    ];

    function changeTab(e) {
        replace(`#/album-artists/${e.detail.name}`);
    }

    let title = $_("text.albumArtists");
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

    <sl-tab-panel name="random">
        <Visibility><Random /></Visibility>
    </sl-tab-panel>

    <sl-tab-panel name="all">
        <Visibility><ArtistsAll type="album_artist" /></Visibility>
    </sl-tab-panel>
</sl-tab-group>
