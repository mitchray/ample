<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { PageTitle } from "~/stores/state.js";
    import Visibility from "~/components/visibility.svelte";
    import { replace } from "svelte-spa-router";
    import StatsLinks from "~/components/statsLinks.svelte";

    let { params = {} } = $props();

    let section = $derived(params.section || "artists");

    const sectionComponents = {
        artists: () => import("~/views/favorites/artists.svelte"),
        albums: () => import("~/views/favorites/albums.svelte"),
        songs: () => import("~/views/favorites/songs.svelte"),
    };

    let childComponent = $derived(
        () => sectionComponents[section]?.() ?? sectionComponents.artists(),
    );

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
        <sl-tab slot="nav" panel={tab.id} active={tab.id === section}>
            {tab.label}
        </sl-tab>
    {/each}

    <div class="tab-content">
        {#await childComponent() then module}
            {@const Child = module.default}
            <Visibility>
                <Child />
            </Visibility>
        {/await}
    </div>
</sl-tab-group>
