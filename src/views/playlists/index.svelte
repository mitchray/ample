<script>
    import { _ } from "@rgglez/svelte-i18n";
    import Portal from "~/components/portal.svelte";
    import { PageTitle } from "~/stores/state.js";
    import {
        setContextualActions,
        clearContextualActions,
    } from "~/stores/contextualActionBar.js";
    import Mine from "./mine.svelte";
    import All from "./all.svelte";
    import DrawerEdit from "~/components/action/drawers/drawerPlaylistEdit.svelte";
    import Visibility from "~/components/visibility.svelte";
    import { replace } from "svelte-spa-router";

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
    $effect(() => {
        if (!params.section) replace(`#/playlists/mine`);
    });

    // register contextual bar actions for this page
    $effect(() => {
        if (!drawerEdit) return;
        setContextualActions([
            {
                id: "new-playlist",
                label: $_("text.newPlaylist"),
                icon: "add",
                variant: "primary",
                onClick: () => drawerEdit.show(),
            },
        ]);
        return () => clearContextualActions();
    });
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
