<script>
    import { _ } from "svelte-i18n";
    import { keepDrawerOpen } from "~/logic/ui.js";

    export let name;
    export const show = () => drawer.show();

    let drawer;
</script>

<sl-drawer
    label={$_("text.shareCreate")}
    bind:this={drawer}
    on:sl-request-close={keepDrawerOpen}
>
    <div>
        Sharing <strong>{name}</strong>
    </div>

    <sl-input type="number" label="Expiry Days" value="7"></sl-input>
    <sl-switch checked>Allow Stream</sl-switch>
    <sl-switch checked>Allow Download</sl-switch>

    <sl-button slot="footer" variant="primary">
        {$_("text.save")}
    </sl-button>
</sl-drawer>
