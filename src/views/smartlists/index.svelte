<script>
    import { _ } from "svelte-i18n";
    import { PageTitle } from "~/stores/state.js";
    import { replace } from "svelte-spa-router";
    import Visibility from "~/components/visibility.svelte";
    import Mine from "./mine.svelte";
    import All from "./all.svelte";

    export let params = {};

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
    $: {
        if (!params.section) replace(`#/smartlists/mine`);
    }
</script>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

<sl-tab-group on:sl-tab-show={changeTab}>
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
