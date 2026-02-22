<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { PageTitle } from "~/stores/state.js";
    import { replace } from "svelte-spa-router";
    import Visibility from "~/components/visibility.svelte";

    let { params = {} } = $props();

    let section = $derived(params.section || "mine");

    const sectionComponents = {
        mine: () => import("~/views/smartlists/mine.svelte"),
        all: () => import("~/views/smartlists/all.svelte"),
    };

    let childComponent = $derived(
        () => sectionComponents[section]?.() ?? sectionComponents.mine(),
    );

    let title = $_("text.smartlists");
    $PageTitle = title;

    const tabs = [
        { id: "mine", label: "Mine" },
        { id: "all", label: "All" },
    ];

    function changeTab(e) {
        replace(`#/smartlists/${e.detail.name}`);
    }

    // default to mine tab
    $effect(() => {
        if (!params.section) replace(`#/smartlists/mine`);
    });
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
                <Child />
            </Visibility>
        {/await}
    </div>
</sl-tab-group>
