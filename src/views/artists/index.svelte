<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { replace } from "svelte-spa-router";
    import { PageTitle } from "~/stores/state.js";
    import Visibility from "~/components/visibility.svelte";

    let { params = {} } = $props();

    let section = $derived(params.section || "newest");

    const sectionComponents = {
        newest: () => import("~/views/artists/newest.svelte"),
        random: () => import("~/views/artists/random.svelte"),
        all: () => import("~/components/artist/artistsAll.svelte"),
    };

    let childComponent = $derived(
        () => sectionComponents[section]?.() ?? sectionComponents.newest(),
    );

    // default to the newest tab
    $effect(() => {
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
        <sl-tab slot="nav" panel={tab.id} active={tab.id === section}>
            {tab.label}
        </sl-tab>
    {/each}

    <div class="tab-content">
        {#await childComponent() then module}
            {@const Child = module.default}
            <Visibility>
                {@const childProps = section === "all" ? { type: "artist" } : {}}
                <Child {...childProps} />
            </Visibility>
        {/await}
    </div>
</sl-tab-group>
