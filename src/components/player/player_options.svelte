<script>
    import { _ } from "svelte-i18n";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import OptionsVolume from "~/components/player/player_optionsVolume.svelte";
    import OptionsCrossfade from "~/components/player/player_optionsCrossfade.svelte";
</script>

<sl-dropdown>
    <sl-button slot="trigger" title={$_("text.playerOptions")} variant="text">
        <MaterialSymbol name="tune" />
    </sl-button>

    <sl-card style="width: 450px">
        <div slot="header">
            {$_("text.playerOptions")}
        </div>

        <sl-tab-group placement="start">
            <sl-tab slot="nav" panel="volume">{$_("text.volume")}</sl-tab>
            <sl-tab slot="nav" panel="crossfade">{$_("text.crossfade")}</sl-tab>

            <sl-tab-panel name="volume">
                <OptionsVolume />
            </sl-tab-panel>
            <sl-tab-panel name="crossfade">
                <OptionsCrossfade />
            </sl-tab-panel>
        </sl-tab-group>
    </sl-card>
</sl-dropdown>
