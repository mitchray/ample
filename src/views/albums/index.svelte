<script>
    import { _ } from "svelte-i18n";
    import { PageTitle } from "~/stores/state.js";
    import { replace } from "svelte-spa-router";
    import Newest from "~/views/albums/newest.svelte";
    import Random from "~/views/albums/random.svelte";
    import AlbumsAll from "~/components/album/albumsAll.svelte";
    import AlbumsByYear from "~/components/album/albumsByYear.svelte";
    import Visibility from "~/components/visibility.svelte";

    export let params = {};

    // default to the newest tab
    $: {
        if (!params.section) replace(`#/albums/newest`);
    }

    // List of tab items with labels and values.
    const tabs = [
        { id: "newest", label: $_("text.newest") },
        { id: "random", label: $_("text.random") },
        { id: "year", label: $_("text.byYear") },
        { id: "all", label: $_("text.all") },
    ];

    function changeTab(e) {
        replace(`#/albums/${e.detail.name}`);
    }

    let title = $_("text.albums");
    $PageTitle = title;
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

    <sl-tab-panel name="newest">
        <Visibility><Newest /></Visibility>
    </sl-tab-panel>

    <sl-tab-panel name="random">
        <Visibility><Random /></Visibility>
    </sl-tab-panel>

    <sl-tab-panel name="year">
        <Visibility><AlbumsByYear /></Visibility>
    </sl-tab-panel>

    <sl-tab-panel name="all">
        <Visibility><AlbumsAll /></Visibility>
    </sl-tab-panel>
</sl-tab-group>
