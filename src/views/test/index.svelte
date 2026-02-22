<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { replace } from "svelte-spa-router";
    import { API, PageTitle } from "~/stores/state.js";
    import { errorHandler } from "~/logic/helper.js";

    let { params = {} } = $props();

    let section = $derived(params.section || "general");
    let data = $state({});

    const sectionComponents = {
        general: () => import("~/views/test/general.svelte"),
        image: () => import("~/views/test/image.svelte"),
        buttons: () => import("~/views/test/buttons.svelte"),
        menus: () => import("~/views/test/menus.svelte"),
        actions: () => import("~/views/test/actions.svelte"),
        theme: () => import("~/views/test/theme.svelte"),
        //wavesurfer: () => import("~/views/test/wavesurfer.svelte"),
    };

    let childComponent = $derived(
        () => sectionComponents[section]?.() ?? sectionComponents.general(),
    );

    // default to general tab
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
        //{ id: "wavesurfer", label: "Wavesurfer" },
    ];

    let title = $_("text.test");
    $PageTitle = title;

    function changeTab(e) {
        replace(`#/test/${e.detail.name}`);
    }

    $effect(async () => {
        data.playlist = await $API.playlist({ filter: 26 });

        if (data.playlist?.error) {
            errorHandler("getting playlist", data.playlist.error);
        }
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
            <Child />
        {/await}
    </div>
</sl-tab-group>
