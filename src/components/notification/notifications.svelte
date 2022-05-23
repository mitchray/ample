<script>
    import { NotificationsList } from '../../stores/notification';
    import {
        ShowNotificationAlternateVersions,
        ShowNotificationGainTagsMissing,
        ShowNotificationRatingMissing
    } from '../../stores/status';

    import Menu from '../../components/menu.svelte';
    import NotificationCard from '../../components/notification/notificationCard.svelte';

    import SVGNotifications from '../../../public/images/notifications.svg';
    import SVGNotificationsNone from '../../../public/images/notifications_none.svg';

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

    function handleAlternateVersionsToggle() {
        let inverted = !$ShowNotificationAlternateVersions;
        localStorage.setItem('ShowNotificationAlternateVersions', JSON.stringify(inverted));
        ShowNotificationAlternateVersions.set(inverted);
    }

    function handleGainTagsMissingToggle() {
        let inverted = !$ShowNotificationGainTagsMissing;
        localStorage.setItem('ShowNotificationGainTagsMissing', JSON.stringify(inverted));
        ShowNotificationGainTagsMissing.set(inverted);
    }

    function handleAlternateRatingMissing() {
        let inverted = !$ShowNotificationRatingMissing;
        localStorage.setItem('ShowNotificationRatingMissing', JSON.stringify(inverted));
        ShowNotificationRatingMissing.set(inverted);
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
    <Menu anchor="bottom-left" toggleElement={document.querySelector("#notifications-toggle")} bind:isVisible={menuIsVisible} >
        <div class="container">
            <div class="notifications-view" style="display: {currentTab === 1 ? 'block' : 'none'}">
                <div class="header panel-header">
                    <h4 class="title panel-title">Notifications</h4>
                    <button class="button button--regular" on:click={e => currentTab = 2}>Settings</button>
                </div>

                <div class="panel-content">
                    {#each $NotificationsList as notification}
                        <NotificationCard item={notification} />
                    {/each}

                    {#if $NotificationsList.length === 0}
                        No notifications
                    {/if}
                </div>
            </div>

            <div class="settings-view" style="display: {currentTab === 2 ? 'block' : 'none'}">
                <div class="header panel-header">
                    <h4 class="title panel-title">Settings</h4>
                    <button class="button button--regular" on:click={e => currentTab = 1}>Back</button>
                </div>

                <div class="panel-content">
                    <div class="group">
                        <label class="toggle">
                            <input type="checkbox" on:change={handleAlternateVersionsToggle} bind:checked={$ShowNotificationAlternateVersions} />
                            Alternate song versions
                        </label>

                        <div class="info">Search for other versions of currently playing song</div>
                    </div>

                    <div class="group">
                        <label class="toggle">
                            <input type="checkbox" on:change={handleGainTagsMissingToggle} bind:checked={$ShowNotificationGainTagsMissing} />
                            Missing volume gain tags
                        </label>

                        <div class="info">Notify if currently playing song is missing ReplayGain or EBU R128 tags</div>
                    </div>

                    <div class="group">
                        <label class="toggle">
                            <input type="checkbox" on:change={handleAlternateRatingMissing} bind:checked={$ShowNotificationRatingMissing} />
                            Missing song rating
                        </label>

                        <div class="info">Notify if there was no rating set for the song that just played</div>
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
        padding: var(--spacing-md);
        background-color: var(--color-background);
    }

    .notifications-toggle:global(.notification-badge:after) {
        top: 0;
        right: calc(100% - 12px);
        bottom: unset;
        left: unset;
    }

    .header {
        display: flex;
        justify-content: space-between;
    }

    .info {
        margin-top: var(--spacing-sm);
        color: var(--color-text-secondary);
    }

    .group + .group {
        padding-top: var(--spacing-lg);
    }

    .settings-view .panel-content {
        padding: var(--spacing-lg);
    }
</style>