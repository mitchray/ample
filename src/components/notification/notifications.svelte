<script>
    import { get } from "svelte/store";
    import { _ } from "svelte-i18n";
    import { Notifications } from "~/stores/message.js";
    import {
        Saved,
        NotificationAlternateVersions,
        NotificationGainTagsMissing,
        NotificationRatingMissing,
        NotificationLyricsMissing,
        NotificationLyricsNotTimestamped,
    } from "~/stores/settings.js";
    import Portal from "~/components/portal.svelte";
    import NotificationList from "~/components/notification/_notificationList.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let dialog;

    $: $Notifications = $Notifications;

    function handleClearNotifications() {
        $Notifications = [];
    }

    function handleChange({ prop, val, store, key }) {
        let newObject = { ...get(store), [prop]: val };
        $Saved.setItem(key, newObject);
        store.set(newObject);
    }
</script>

<sl-dropdown hoist>
    <div class="container" slot="trigger">
        <sl-button>
            <MaterialSymbol name="notifications" />

            <span>
                <sl-badge variant="neutral" pill>
                    {$Notifications.length}
                </sl-badge>
            </span>
        </sl-button>
    </div>

    <sl-card>
        <div class="header" slot="header">
            {$_("text.notifications")}

            <sl-button
                size="small"
                variant="danger"
                class="clear-notifications"
                circle
                on:click={handleClearNotifications}
                title={$_("text.clearAll")}
            >
                <MaterialSymbol name="delete" />
            </sl-button>

            <sl-button class="settings" on:click={() => dialog.show()}>
                <MaterialSymbol name="settings" />
            </sl-button>
        </div>

        <NotificationList notifications={$Notifications} />
    </sl-card>
</sl-dropdown>

<Portal>
    <sl-dialog label="Notifications settings" bind:this={dialog}>
        <div class="table">
            <div class="row heading">
                <div class="text header"></div>
                <div class="checkbox header">Enable</div>
                <div class="checkbox header">Silent</div>
            </div>

            <div class="row">
                <div class="text">
                    {$_("text.alternateSongVersions")}

                    <sl-tooltip>
                        <div slot="content">
                            {$_("text.alternateSongVersionsInfo")}
                        </div>

                        <sl-badge variant="neutral" pill>?</sl-badge>
                    </sl-tooltip>
                </div>
                <div class="checkbox">
                    <sl-switch
                        checked={$NotificationAlternateVersions.isEnabled}
                        on:sl-change={(e) => {
                            handleChange({
                                prop: "isEnabled",
                                val: e.target.checked,
                                store: NotificationAlternateVersions,
                                key: "NotificationAlternateVersions",
                            });
                        }}
                    ></sl-switch>
                </div>
                <div class="checkbox">
                    <sl-switch
                        checked={$NotificationAlternateVersions.isSilent}
                        on:sl-change={(e) => {
                            handleChange({
                                prop: "isSilent",
                                val: e.target.checked,
                                store: NotificationAlternateVersions,
                                key: "NotificationAlternateVersions",
                            });
                        }}
                    ></sl-switch>
                </div>
            </div>

            <div class="row">
                <div class="text">
                    {$_("text.missingVolumeTags")}

                    <sl-tooltip>
                        <div slot="content">
                            {$_("text.missingVolumeTagsInfo")}
                        </div>

                        <sl-badge variant="neutral" pill>?</sl-badge>
                    </sl-tooltip>
                </div>
                <div class="checkbox">
                    <sl-switch
                        checked={$NotificationGainTagsMissing.isEnabled}
                        on:sl-change={(e) => {
                            handleChange({
                                prop: "isEnabled",
                                val: e.target.checked,
                                store: NotificationGainTagsMissing,
                                key: "NotificationGainTagsMissing",
                            });
                        }}
                    ></sl-switch>
                </div>
                <div class="checkbox">
                    <sl-switch
                        checked={$NotificationGainTagsMissing.isSilent}
                        on:sl-change={(e) => {
                            handleChange({
                                prop: "isSilent",
                                val: e.target.checked,
                                store: NotificationGainTagsMissing,
                                key: "NotificationGainTagsMissing",
                            });
                        }}
                    ></sl-switch>
                </div>
            </div>

            <div class="row">
                <div class="text">
                    {$_("text.missingSongRating")}

                    <sl-tooltip>
                        <div slot="content">
                            {$_("text.missingSongRatingInfo")}
                        </div>

                        <sl-badge variant="neutral" pill>?</sl-badge>
                    </sl-tooltip>
                </div>
                <div class="checkbox">
                    <sl-switch
                        checked={$NotificationRatingMissing.isEnabled}
                        on:sl-change={(e) => {
                            handleChange({
                                prop: "isEnabled",
                                val: e.target.checked,
                                store: NotificationRatingMissing,
                                key: "NotificationRatingMissing",
                            });
                        }}
                    ></sl-switch>
                </div>
                <div class="checkbox">
                    <sl-switch
                        checked={$NotificationRatingMissing.isSilent}
                        on:sl-change={(e) => {
                            handleChange({
                                prop: "isSilent",
                                val: e.target.checked,
                                store: NotificationRatingMissing,
                                key: "NotificationRatingMissing",
                            });
                        }}
                    ></sl-switch>
                </div>
            </div>

            <div class="row">
                <div class="text">
                    {$_("text.missingLyrics")}

                    <sl-tooltip>
                        <div slot="content">
                            {$_("text.missingLyricsInfo")}
                        </div>

                        <sl-badge variant="neutral" pill>?</sl-badge>
                    </sl-tooltip>
                </div>
                <div class="checkbox">
                    <sl-switch
                        checked={$NotificationLyricsMissing.isEnabled}
                        on:sl-change={(e) => {
                            handleChange({
                                prop: "isEnabled",
                                val: e.target.checked,
                                store: NotificationLyricsMissing,
                                key: "NotificationLyricsMissing",
                            });
                        }}
                    ></sl-switch>
                </div>
                <div class="checkbox">
                    <sl-switch
                        checked={$NotificationLyricsMissing.isSilent}
                        on:sl-change={(e) => {
                            handleChange({
                                prop: "isSilent",
                                val: e.target.checked,
                                store: NotificationLyricsMissing,
                                key: "NotificationLyricsMissing",
                            });
                        }}
                    ></sl-switch>
                </div>
            </div>

            <div class="row">
                <div class="text">
                    {$_("text.missingLyricsTimestamp")}

                    <sl-tooltip>
                        <div slot="content">
                            {$_("text.missingLyricsTimestampInfo")}
                        </div>

                        <sl-badge variant="neutral" pill>?</sl-badge>
                    </sl-tooltip>
                </div>
                <div class="checkbox">
                    <sl-switch
                        checked={$NotificationLyricsNotTimestamped.isEnabled}
                        on:sl-change={(e) => {
                            handleChange({
                                prop: "isEnabled",
                                val: e.target.checked,
                                store: NotificationLyricsNotTimestamped,
                                key: "NotificationLyricsNotTimestamped",
                            });
                        }}
                    ></sl-switch>
                </div>
                <div class="checkbox">
                    <sl-switch
                        checked={$NotificationLyricsNotTimestamped.isSilent}
                        on:sl-change={(e) => {
                            handleChange({
                                prop: "isSilent",
                                val: e.target.checked,
                                store: NotificationLyricsNotTimestamped,
                                key: "NotificationLyricsNotTimestamped",
                            });
                        }}
                    ></sl-switch>
                </div>
            </div>
        </div>

        <sl-alert open>
            <MaterialSymbol name="info" slot="icon" size="1.5em" />
            Silent notifications won't display an alert, but will still be listed
        </sl-alert>

        <sl-button
            slot="footer"
            variant="primary"
            on:click={() => dialog.hide()}
        >
            Done
        </sl-button>
    </sl-dialog>
</Portal>

<style>
    /* new */
    .table {
        display: grid;
        grid-template-columns: 1fr min-content min-content;
        gap: var(--spacing-lg);
    }

    .row {
        display: contents;
    }

    sl-alert {
        margin-block-start: var(--spacing-xl);
    }

    sl-card::part(base) {
        width: 300px;
    }

    .clear-notifications {
        margin-inline-end: auto;
    }

    .container {
        display: flex;
        align-items: center;
    }

    .header {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
    }

    .settings {
        margin-inline-start: auto;
    }

    .recent.hide {
        display: none;
    }
</style>
