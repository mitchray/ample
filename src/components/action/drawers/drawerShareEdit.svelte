<script>
    import { _ } from "svelte-i18n";
    import { API } from "~/stores/state.js";
    import { keepDrawerOpen } from "~/logic/ui.js";
    import { Tabulator } from "tabulator-tables";
    import { addAlert } from "~/logic/alert.js";

    export let share = {};
    export const show = () => drawer.show();
    export let isNew = false;

    let drawer;
    let canStream;
    let canDownload;
    let description;
    let expiryDays;

    function resetValues() {
        canStream = share.allow_stream;
        canDownload = share.allow_download;
        description = share.description;
        expiryDays = share.expire_days;
    }

    $: if (share) {
        resetValues();
    }

    async function handleSave() {
        await $API.shareEdit({
            filter: share.id,
            stream: canStream,
            download: canDownload,
            expires: expiryDays,
            description: description,
        });

        // Update the share object with the new values
        share = {
            ...share,
            allow_stream: canStream,
            allow_download: canDownload,
            expire_days: expiryDays,
            description: description,
        };

        // update Tabulator if that exists
        const sharesTable = Tabulator.findTable("[data-id=shares]");

        if (sharesTable.length > 0) {
            if (Array.isArray(sharesTable)) {
                sharesTable.forEach((table) => {
                    table?.updateRow(share.id, share);
                });
            }
        }

        addAlert({
            title: $_("text.shareSaved"),
            style: "success",
        });

        drawer.hide();
    }

    function handleClose() {
        resetValues();
    }
</script>

<sl-drawer
    bind:this={drawer}
    label={isNew ? $_("text.shareCreate") : $_("text.shareEdit")}
    on:sl-request-close={keepDrawerOpen}
    on:sl-hide={handleClose}
>
    <div>
        Sharing <strong>{share.name}</strong>
    </div>

    <sl-input
        label="Days before expiry"
        type="number"
        value={expiryDays}
        min="1"
        on:sl-change={(e) => {
            expiryDays = e.target.value;
        }}
    ></sl-input>
    <sl-switch
        checked={canStream}
        on:sl-change={(e) => {
            canStream = e.target.checked ? 1 : 0;
        }}
    >
        Allow Stream
    </sl-switch>
    <sl-switch
        checked={canDownload}
        on:sl-change={(e) => {
            canDownload = e.target.checked ? 1 : 0;
        }}
    >
        Allow Download
    </sl-switch>

    <sl-input
        label="Description"
        type="text"
        value={description}
        help-text="(Optional)"
        on:sl-change={(e) => {
            description = e.target.value;
        }}
    ></sl-input>

    <sl-divider></sl-divider>

    <h3>Share link</h3>
    <div class="url">
        <sl-input type="text" value={share.public_url} readonly></sl-input>
        <sl-copy-button value={share.public_url}>Copy link</sl-copy-button>
    </div>

    <sl-qr-code value={share.public_url} label="Share link"></sl-qr-code>

    <div class="footer" slot="footer">
        <sl-button variant="primary" on:click={handleSave}>
            {$_("text.save")}
        </sl-button>
    </div>
</sl-drawer>

<style>
    .url {
        display: flex;
        flex-direction: row;
        align-items: center;
        width: 100%;
    }

    .url sl-input {
        flex-grow: 1;
    }
</style>
