<script>
    import { run } from "svelte/legacy";

    import { _ } from "svelte-i18n";
    import { Notifications } from "~/stores/message.js";
    import { Settings } from "~/stores/settings.js";
    import Portal from "~/components/portal.svelte";
    import NotificationList from "~/components/notification/_notificationList.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let dialog = $state();

    run(() => {
        $Notifications = $Notifications;
    });

    function handleClearNotifications() {
        $Notifications = [];
    }
</script>

<sl-dropdown hoist>
    <div slot="trigger">
        <sl-button
            class="main-button"
            variant="text"
            title={$_("text.notifications")}
        >
            <MaterialSymbol
                name="notifications"
                slot="prefix"
                fill={$Notifications.length > 0 ? 1 : 0}
            />

            <span class="counter">
                {$Notifications.length}
            </span>
        </sl-button>
    </div>

    <sl-card>
        <div class="header" slot="header">
            {$_("text.notifications")}

            <sl-button
                circle
                class="clear-notifications"
                onclick={handleClearNotifications}
                size="small"
                title={$_("text.clearAll")}
                variant="danger"
            >
                <MaterialSymbol name="delete" />
            </sl-button>

            <sl-button class="settings" onclick={() => dialog.show()}>
                <MaterialSymbol name="settings" />
            </sl-button>
        </div>

        <NotificationList notifications={$Notifications} />
    </sl-card>
</sl-dropdown>

<Portal>
    <sl-dialog bind:this={dialog} label="Notifications settings">
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

                        <sl-badge pill variant="neutral">?</sl-badge>
                    </sl-tooltip>
                </div>
                <div class="checkbox">
                    <sl-switch
                        checked={$Settings.Notifications.AlternateVersions
                            .isEnabled}
                        onsl-change={(e) => {
                            $Settings.Notifications.AlternateVersions.isEnabled =
                                e.target.checked;
                        }}
                    ></sl-switch>
                </div>
                <div class="checkbox">
                    <sl-switch
                        checked={$Settings.Notifications.AlternateVersions
                            .isSilent}
                        onsl-change={(e) => {
                            $Settings.Notifications.AlternateVersions.isSilent =
                                e.target.checked;
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

                        <sl-badge pill variant="neutral">?</sl-badge>
                    </sl-tooltip>
                </div>
                <div class="checkbox">
                    <sl-switch
                        checked={$Settings.Notifications.GainTagsMissing
                            .isEnabled}
                        onsl-change={(e) => {
                            $Settings.Notifications.GainTagsMissing.isEnabled =
                                e.target.checked;
                        }}
                    ></sl-switch>
                </div>
                <div class="checkbox">
                    <sl-switch
                        checked={$Settings.Notifications.GainTagsMissing
                            .isSilent}
                        onsl-change={(e) => {
                            $Settings.Notifications.GainTagsMissing.isSilent =
                                e.target.checked;
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

                        <sl-badge pill variant="neutral">?</sl-badge>
                    </sl-tooltip>
                </div>
                <div class="checkbox">
                    <sl-switch
                        checked={$Settings.Notifications.RatingMissing
                            .isEnabled}
                        onsl-change={(e) => {
                            $Settings.Notifications.RatingMissing.isEnabled =
                                e.target.checked;
                        }}
                    ></sl-switch>
                </div>
                <div class="checkbox">
                    <sl-switch
                        checked={$Settings.Notifications.RatingMissing.isSilent}
                        onsl-change={(e) => {
                            $Settings.Notifications.RatingMissing.isSilent =
                                e.target.checked;
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

                        <sl-badge pill variant="neutral">?</sl-badge>
                    </sl-tooltip>
                </div>
                <div class="checkbox">
                    <sl-switch
                        checked={$Settings.Notifications.LyricsMissing
                            .isEnabled}
                        onsl-change={(e) => {
                            $Settings.Notifications.LyricsMissing.isEnabled =
                                e.target.checked;
                        }}
                    ></sl-switch>
                </div>
                <div class="checkbox">
                    <sl-switch
                        checked={$Settings.Notifications.LyricsMissing.isSilent}
                        onsl-change={(e) => {
                            $Settings.Notifications.LyricsMissing.isSilent =
                                e.target.checked;
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

                        <sl-badge pill variant="neutral">?</sl-badge>
                    </sl-tooltip>
                </div>
                <div class="checkbox">
                    <sl-switch
                        checked={$Settings.Notifications.LyricsNotTimestamped
                            .isEnabled}
                        onsl-change={(e) => {
                            $Settings.Notifications.LyricsNotTimestamped.isEnabled =
                                e.target.checked;
                        }}
                    ></sl-switch>
                </div>
                <div class="checkbox">
                    <sl-switch
                        checked={$Settings.Notifications.LyricsNotTimestamped
                            .isSilent}
                        onsl-change={(e) => {
                            $Settings.Notifications.LyricsNotTimestamped.isSilent =
                                e.target.checked;
                        }}
                    ></sl-switch>
                </div>
            </div>
        </div>

        <sl-alert open>
            <MaterialSymbol name="info" size="1.5em" slot="icon" />
            Silent notifications won't display an alert, but will still be listed
        </sl-alert>

        <sl-button
            onclick={() => dialog.hide()}
            slot="footer"
            variant="primary"
        >
            Done
        </sl-button>
    </sl-dialog>
</Portal>

<style>
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

    .main-button::part(label) {
        padding-inline-start: var(--spacing-sm);
    }

    .counter {
        display: flex;
    }

    .header {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
    }

    .settings {
        margin-inline-start: auto;
    }
</style>
