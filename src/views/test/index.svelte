<script>
    import { _ } from "svelte-i18n";
    import { replace } from "svelte-spa-router";
    import { API, PageTitle } from "~/stores/state.js";
    import General from "~/views/test/general.svelte";
    import Image from "~/views/test/image.svelte";
    import Buttons from "~/views/test/buttons.svelte";
    import Menus from "~/views/test/menus.svelte";
    import Actions from "~/views/test/actions.svelte";
    import Theme from "~/views/test/theme.svelte";
    import Wavesurfer from "~/views/test/wavesurfer.svelte";
    import { errorHandler } from "~/logic/helper.js";

    let { params = {} } = $props();

    let data = {};

    // default to releases tab
    $effect(() => {
        if (!params.section) replace(`#/test/general`);
    });

    const tabs = [
        { id: "general", label: "General" },
        { id: "image", label: "Image" },
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

    $effect(async () => {
        data.playlist = await $API.playlist({ filter: 26 });

        if (data.playlist.error) {
            errorHandler("getting playlist", data.playlist.error);
        }
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

    <sl-tab-panel name="general">
        <General />
    </sl-tab-panel>

    <sl-tab-panel name="image">
        <Image />
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
        <!--        <Wavesurfer />-->
    </sl-tab-panel>
</sl-tab-group>
