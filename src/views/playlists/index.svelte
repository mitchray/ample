<script>
    import { run } from 'svelte/legacy';

    import { _ } from "svelte-i18n";
    import Portal from "~/components/portal.svelte";
    import { PageTitle } from "~/stores/state.js";
    import Mine from "./mine.svelte";
    import All from "./all.svelte";
    import DrawerEdit from "~/components/action/drawers/drawerPlaylistEdit.svelte";
    import Visibility from "~/components/visibility.svelte";
    import { replace } from "svelte-spa-router";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    /** @type {{params?: any}} */
    let { params = {} } = $props();

    let drawerEdit = $state();

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
    run(() => {
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
        <sl-tab slot="nav" panel={tab.id} active={tab.id === params.section}>
            {tab.label}
        </sl-tab>
    {/each}

    <sl-tab-panel name="mine">
        <Visibility>
            <Mine />
        </Visibility>
    </sl-tab-panel>

    <sl-tab-panel name="all">
        <Visibility>
            <All />
        </Visibility>
    </sl-tab-panel>
</sl-tab-group>

<Portal>
    <DrawerEdit bind:this={drawerEdit} isNew={true} />
</Portal>
