<script>
    import { _ } from "@rgglez/svelte-i18n";
    import Portal from "~/components/portal.svelte";
    import { PageTitle } from "~/stores/state.js";
    import DrawerEdit from "~/components/action/drawers/drawerPlaylistEdit.svelte";
    import Visibility from "~/components/visibility.svelte";
    import { replace } from "svelte-spa-router";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let { params = {} } = $props();

    let section = $derived(params.section || "mine");
    let drawerEdit = $state();

    const sectionComponents = {
        mine: () => import("~/views/playlists/mine.svelte"),
        all: () => import("~/views/playlists/all.svelte"),
    };

    let childComponent = $derived(
        () => sectionComponents[section]?.() ?? sectionComponents.mine(),
    );

    let title = $_("text.playlists");
    $PageTitle = title;

    const tabs = [
        { id: "mine", label: $_("text.mine") },
        { id: "all", label: $_("text.all") },
    ];

    function changeTab(e) {
        replace(`#/playlists/${e.detail.name}`);
    }

    // default to mine tab
    $effect(() => {
        if (!params.section) replace(`#/playlists/mine`);
    });
</script>

<div class="page-header">
    <h1 class="page-title">{title}</h1>

    <sl-button
        class="new-playlist-button"
        onclick={() => drawerEdit.show()}
        variant="primary"
        size="small"
    >
        <MaterialSymbol name="add" slot="prefix" />
        {$_("text.new")}
    </sl-button>
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

<Portal>
    <DrawerEdit bind:this={drawerEdit} isNew={true} />
</Portal>
