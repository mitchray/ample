<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { PageTitle } from "~/stores/state.js";
    import { replace } from "svelte-spa-router";
    import Visibility from "~/components/visibility.svelte";

    let { params = {} } = $props();

    let section = $derived(params.section || "random");

    const sectionComponents = {
        random: () => import("~/views/album-artists/random.svelte"),
        all: () => import("~/components/artist/artistsAll.svelte"),
    };

    let childComponent = $derived(
        () => sectionComponents[section]?.() ?? sectionComponents.random(),
    );

    // default to random tab
    $effect(() => {
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
        <sl-tab slot="nav" panel={tab.id} active={tab.id === section}>
            {tab.label}
        </sl-tab>
    {/each}

    <div class="tab-content">
        {#await childComponent() then module}
            {@const Child = module.default}
            {@const childProps = section === "all" ? { type: "album_artist" } : {}}
            <Visibility>
                <Child {...childProps} />
            </Visibility>
        {/await}
    </div>
</sl-tab-group>
