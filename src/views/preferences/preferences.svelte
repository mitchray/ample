<script>
    import Portal from "~/components/portal.svelte";
    import { SiteContentBind } from "~/stores/elements.js";
    import { ShowPreferences } from "~/stores/state.js";
    import { _ } from "svelte-i18n";
    import Theme from "~/views/preferences/_theme.svelte";

    let drawer;
    let tabs;

    $: {
        $ShowPreferences ? drawer?.show() : drawer?.hide();
    }

    function handleClose(event) {
        // ignore bubbled sl-hide events from other components
        if (event.target === drawer) {
            ShowPreferences.set(false);
        }
    }
</script>

{#if $SiteContentBind}
    <Portal target={$SiteContentBind}>
        <sl-drawer
            placement="bottom"
            bind:this={drawer}
            on:sl-hide={handleClose}
            contained
        >
            <div slot="label">
                {$_("text.preferences")}
            </div>

            <div class="wrapper">
                <div class="categories">
                    <div style="position:sticky; top: 0;">
                        <sl-tab-group class="fake" placement="start">
                            <sl-tab
                                slot="nav"
                                panel="general"
                                on:click={() => {
                                    tabs.show("general");
                                }}
                            >
                                General
                            </sl-tab>
                            <sl-tab
                                slot="nav"
                                panel="theme"
                                on:click={() => {
                                    tabs.show("theme");
                                }}
                            >
                                Theme
                            </sl-tab>
                            <sl-tab
                                slot="nav"
                                panel="advanced"
                                on:click={() => {
                                    tabs.show("advanced");
                                }}
                            >
                                Advanced
                            </sl-tab>
                            <sl-tab
                                slot="nav"
                                panel="disabled"
                                on:click={() => {
                                    tabs.show("disabled");
                                }}
                                disabled
                            >
                                Disabled
                            </sl-tab>

                            <sl-tab-panel name="general"></sl-tab-panel>
                            <sl-tab-panel name="theme"></sl-tab-panel>
                            <sl-tab-panel name="advanced"></sl-tab-panel>
                            <sl-tab-panel name="disabled"></sl-tab-panel>
                        </sl-tab-group>
                    </div>
                </div>

                <sl-tab-group placement="start" class="real" bind:this={tabs}>
                    <sl-tab slot="nav" panel="general"></sl-tab>
                    <sl-tab slot="nav" panel="theme"></sl-tab>
                    <sl-tab slot="nav" panel="advanced"></sl-tab>
                    <sl-tab slot="nav" panel="disabled" disabled></sl-tab>

                    <sl-tab-panel name="general">
                        <div style="height: 10000px">
                            This is the general tab panel.
                        </div>
                    </sl-tab-panel>
                    <sl-tab-panel name="theme">
                        <Theme />
                    </sl-tab-panel>
                    <sl-tab-panel name="advanced">
                        This is the advanced tab panel.
                    </sl-tab-panel>
                    <sl-tab-panel name="disabled">
                        This is a disabled tab panel.
                    </sl-tab-panel>
                </sl-tab-group>
            </div>
        </sl-drawer>
    </Portal>
{/if}

<style>
    .wrapper {
        display: grid;
        grid-template-columns: min-content auto;
        /*justify-content: start;*/
    }

    sl-drawer::part(panel) {
        min-height: 100%;
    }

    /* always show the footer, though empty */
    sl-drawer::part(footer) {
        display: block;
    }

    sl-tab-group.real::part(nav),
    .real sl-tab {
        pointer-events: none;
        display: none;
    }

    .fake sl-tab-panel {
        pointer-events: none;
        display: none;
    }

    sl-tab-panel {
        /*background-color: darkblue;*/
        /*height: 100%;*/
        /*overflow: auto;*/
    }
</style>
