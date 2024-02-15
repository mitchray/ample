<script>
    import { _ } from "svelte-i18n";
    import { replace } from "svelte-spa-router";
    import { onMount } from "svelte";
    import { API, PageTitle } from "~/stores/state.js";
    import General from "./general.svelte";
    import Buttons from "./buttons.svelte";
    import Menus from "./menus.svelte";
    import Actions from "./actions.svelte";
    import Theme from "./theme.svelte";
    import Wavesurfer from "./wavesurfer.svelte";

    export let params = {};

    let data = {};

    // default to releases tab
    $: {
        if (!params.section) replace(`#/test/general`);
    }

    const tabs = [
        { id: "general", label: "General" },
        { id: "buttons", label: "Buttons" },
        { id: "menus", label: "Menus" },
        { id: "actions", label: "Actions" },
        { id: "theme", label: "Theme" },
        { id: "wavesurfer", label: "Wavesurfer" },
    ];

    let title = $_("text.test");
    $PageTitle = title;

    function changeTab(e) {
        replace(`#/test/${e.detail.name}`);
    }

    onMount(async () => {
        data.playlist = await $API.playlist({ filter: 26 });

        if (data.playlist.error) {
            console.error("Ample error getting playlist:", data.playlist.error);
        }
    });
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

<sl-tab-group on:sl-tab-show={changeTab}>
    {#each tabs as tab}
        <sl-tab slot="nav" panel={tab.id} active={tab.id === params.section}>
            {tab.label}
        </sl-tab>
    {/each}

    <sl-tab-panel name="general">
        <General />
    </sl-tab-panel>

    <sl-tab-panel name="buttons">
        <Buttons />
    </sl-tab-panel>

    <sl-tab-panel name="menus">
        <Menus />
    </sl-tab-panel>

    <sl-tab-panel name="actions">
        <Actions />
    </sl-tab-panel>

    <sl-tab-panel name="theme">
        <Theme />
    </sl-tab-panel>

    <sl-tab-panel name="wavesurfer">
        <Wavesurfer />
    </sl-tab-panel>
</sl-tab-group>
