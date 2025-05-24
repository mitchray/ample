<script>
    import { _ } from "svelte-i18n";
    import { logout } from "~/logic/user";
    import {
        ampleVersion,
        APIVersion,
        ShowPreferences,
        User,
    } from "~/stores/state.js";
    import { Settings } from "~/stores/settings.js";
    import ThemeToggle from "~/components/theme/themeToggle.svelte";
    import LanguageSelector from "~/components/languageSelector.svelte";
    import MaterialSymbol from "~/components//materialSymbol.svelte";
</script>

<sl-dropdown placement="top-start" hoist>
    <sl-button
        class="user-details"
        slot="trigger"
        variant="text"
        title={$User.username}
    >
        <sl-avatar
            image={$User.has_art ? $User.art : null}
            slot="prefix"
        ></sl-avatar>

        {#if $Settings.SidebarIsExpanded}
            {$User.username}
        {/if}
    </sl-button>

    <sl-card style="max-width: 250px">
        {#if $User.isLoggedIn}
            <sl-button
                variant="warning"
                onclick={() => {
                    logout();
                }}
                class="logout"
                title={$_("text.logOut")}
            >
                <MaterialSymbol name="logout" slot="prefix" />
                {$_("text.logOut")}
            </sl-button>

            <sl-button
                onclick={() => {
                    $ShowPreferences = !$ShowPreferences;
                }}
            >
                {$_("text.preferences")}
            </sl-button>
        {/if}

        <ThemeToggle />

        <LanguageSelector />

        <div class="meta">
            <span>Ample {$ampleVersion}</span>
            -
            <span>Ampache API {$APIVersion}</span>
        </div>
    </sl-card>
</sl-dropdown>

<style>
    sl-card::part(body) {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .user-details {
        margin: var(--spacing-sm);
        margin-block-end: 0;
        display: block;
    }

    .user-details::part(base) {
        justify-content: start;
        align-items: baseline;
        padding: 0;
    }

    .user-details::part(label) {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding-inline-end: var(--spacing-sm);
    }

    :global(.site-sidebar.is-mini) .user-details {
        transform: translateX(-2px);
        display: inline-flex;
    }

    .meta {
        color: var(--color-on-surface);
        opacity: 0.4;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        font-size: 11px;
        gap: var(--spacing-sm);
    }
</style>
