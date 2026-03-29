<script>
    import { _ } from "@rgglez/svelte-i18n";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import OptionsVolume from "~/components/player/player_optionsVolume.svelte";
</script>

<sl-dropdown>
    <sl-button slot="trigger" title={$_("text.playerOptions")} variant="text">
        <MaterialSymbol name="tune" />
    </sl-button>

    <sl-card style="width: 450px">
        <div slot="header">
            {$_("text.playerOptions")}
        </div>

        <OptionsVolume />
    </sl-card>
</sl-dropdown>
