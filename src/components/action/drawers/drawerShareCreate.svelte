<script>
    import { _ } from "svelte-i18n";
    import { keepDrawerOpen } from "~/logic/ui.js";

    export let name;
    export const show = () => drawer.show();

    let drawer;
</script>

<sl-drawer
    bind:this={drawer}
    label={$_("text.shareCreate")}
    on:sl-request-close={keepDrawerOpen}
>
    <div>
        Sharing <strong>{name}</strong>
    </div>

    <sl-input label="Expiry Days" type="number" value="7"></sl-input>
    <sl-switch checked>Allow Stream</sl-switch>
    <sl-switch checked>Allow Download</sl-switch>

    <sl-button slot="footer" variant="primary">
        {$_("text.save")}
    </sl-button>
</sl-drawer>
