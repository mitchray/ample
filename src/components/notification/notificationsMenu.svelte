<script>
    import { _ } from 'svelte-i18n';
    import { NotificationsList } from '../../stores/message';
    import {
        ShowNotificationAlternateVersions,
        ShowNotificationGainTagsMissing,
        ShowNotificationRatingMissing,
        ShowNotificationLyricsMissing,
        ShowNotificationLyricsNotTimestamped,
    } from '../../stores/status';

    import Menu from '../../components/menu.svelte';
    import NotificationCard from '../../components/notification/notificationCard.svelte';

    import SVGNotifications from '/src/images/notifications.svg';
    import SVGNotificationsNone from '/src/images/notifications_none.svg';
    import SVGClose from '/src/images/close.svg';

    let menuIsVisible = false;

    function toggleMenu() {
        menuIsVisible = !menuIsVisible;
    }

    let currentTab = 1;
    let tabItems = [
        { label: "Notifications", value: 1 },
        { label: "Settings",      value: 2 }
    ];

    $: $NotificationsList = $NotificationsList;

    function handleClearNotifications() {
        $NotificationsList = [];
    }

    function handleAlternateVersionsToggle() {
        let inverted = !$ShowNotificationAlternateVersions;
        localStorage.setItem('AmpleShowNotificationAlternateVersions', JSON.stringify(inverted));
        ShowNotificationAlternateVersions.set(inverted);
    }

    function handleGainTagsMissingToggle() {
        let inverted = !$ShowNotificationGainTagsMissing;
        localStorage.setItem('AmpleShowNotificationGainTagsMissing', JSON.stringify(inverted));
        ShowNotificationGainTagsMissing.set(inverted);
    }

    function handleRatingMissingToggle() {
        let inverted = !$ShowNotificationRatingMissing;
        localStorage.setItem('AmpleShowNotificationRatingMissing', JSON.stringify(inverted));
        ShowNotificationRatingMissing.set(inverted);
    }

    function handleLyricsMissingToggle() {
        let inverted = !$ShowNotificationLyricsMissing;
        localStorage.setItem('AmpleShowNotificationLyricsMissing', JSON.stringify(inverted));
        ShowNotificationLyricsMissing.set(inverted);
    }

    function handleLyricsNotTimestampedToggle() {
        let inverted = !$ShowNotificationLyricsNotTimestamped;
        localStorage.setItem('AmpleShowNotificationLyricsNotTimestamped', JSON.stringify(inverted));
        ShowNotificationLyricsNotTimestamped.set(inverted);
    }
</script>

<button id="notifications-toggle" class="icon-button notifications-toggle" on:click={toggleMenu} class:notification-badge={$NotificationsList.length > 0} data-badge="{$NotificationsList.length}">
    {#if $NotificationsList.length > 0}
        <SVGNotifications />
    {:else}
        <SVGNotificationsNone />
    {/if}
</button>

{#if menuIsVisible}
    <Menu anchor="bottom" toggleSelector={"#notifications-toggle"} bind:isVisible={menuIsVisible} >
        <div class="container">
            <div class="notifications-view" style="display: {currentTab === 1 ? 'block' : 'none'}">
                <div class="header new-panel-header">
                    <h4 class="title panel-title">{$_('text.notifications')}</h4>
                    <button class="clear-notifications icon-button" title="{$_('text.clearAll')}" on:click={handleClearNotifications}><SVGClose /></button>
                    <button class="button button--regular" on:click={e => currentTab = 2}>{$_('text.settings')}</button>
                </div>

                <div class="panel-content">
                    {#each $NotificationsList as notification}
                        <NotificationCard item={notification} />
                    {/each}

                    {#if $NotificationsList.length === 0}
                        {$_('text.noItemsFound')}
                    {/if}
                </div>
            </div>

            <div class="settings-view" style="display: {currentTab === 2 ? 'block' : 'none'}">
                <div class="header new-panel-header">
                    <h4 class="title panel-title">{$_('text.settings')}</h4>
                    <button class="button button--regular" on:click={e => currentTab = 1}>{$_('text.back')}</button>
                </div>

                <div class="panel-content">
                    <div class="group">
                        <label class="toggle">
                            <input type="checkbox" on:change={handleAlternateVersionsToggle} bind:checked={$ShowNotificationAlternateVersions} />
                            {$_('text.alternateSongVersions')}
                        </label>

                        <div class="info">{$_('text.alternateSongVersionsInfo')}</div>
                    </div>

                    <div class="group">
                        <label class="toggle">
                            <input type="checkbox" on:change={handleGainTagsMissingToggle} bind:checked={$ShowNotificationGainTagsMissing} />
                            {$_('text.missingVolumeTags')}
                        </label>

                        <div class="info">{$_('text.missingVolumeTagsInfo')}</div>
                    </div>

                    <div class="group">
                        <label class="toggle">
                            <input type="checkbox" on:change={handleRatingMissingToggle} bind:checked={$ShowNotificationRatingMissing} />
                            {$_('text.missingSongRating')}
                        </label>

                        <div class="info">{$_('text.missingSongRatingInfo')}</div>
                    </div>

                    <div class="group">
                        <label class="toggle">
                            <input type="checkbox" on:change={handleLyricsMissingToggle} bind:checked={$ShowNotificationLyricsMissing} />
                            {$_('text.missingLyrics')}
                        </label>

                        <div class="info">{$_('text.missingLyricsInfo')}</div>
                    </div>

                    <div class="group">
                        <label class="toggle">
                            <input type="checkbox" on:change={handleLyricsNotTimestampedToggle} bind:checked={$ShowNotificationLyricsNotTimestamped} />
                            {$_('text.missingLyricsTimestamp')}
                        </label>

                        <div class="info">{$_('text.missingLyricsTimestampInfo')}</div>
                    </div>
                </div>
            </div>
        </div>
    </Menu>
{/if}

<style>
    .container {
        width: 300px;
    }

    .panel-content {
        overflow: auto;
        max-height: 400px;
    }

    .notifications-view .panel-content {
        background-color: var(--color-background);
    }

    .notifications-toggle:global(.notification-badge:after) {
        inset-block-start: 0;
        inset-inline-end: calc(100% - 12px);
        inset-block-end:  unset;
        inset-inline-start:  unset;
    }

    .header {
        display: flex;
        justify-content: space-between;
    }

    .title {
        margin-inline-end: var(--spacing-md);
    }

    .clear-notifications {
        margin-inline-end: auto;
    }

    .group + .group {
        padding-block-start: var(--spacing-lg);
    }
</style>