<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { logout } from "~/logic/user";
    import { ampleVersion, APIVersion, User } from "~/stores/state.js";
    import { Settings } from "~/stores/settings.svelte.js";
    import ThemeToggle from "~/components/theme/themeToggle.svelte";
    import LanguageSelector from "~/components/languageSelector.svelte";
    import MaterialSymbol from "~/components//materialSymbol.svelte";

    let dropdown;
</script>

<sl-dropdown
    placement={Settings.SidebarIsExpanded ? "top" : "left"}
    hoist
    bind:this={dropdown}
>
    <sl-button
        class="user-button"
        variant="text"
        title={$User.username}
        slot="trigger"
    >
        <sl-avatar
            image={$User?.isLoggedIn && $User?.has_art ? $User?.art : null}
        ></sl-avatar>
    </sl-button>

    <sl-card style="width: 250px">
        {#if $User.isLoggedIn}
            <sl-button
                variant="warning"
                onclick={() => {
                    logout();
                    window.location.href = "#/";
                }}
                class="logout"
                title={$_("text.logOut")}
            >
                <MaterialSymbol name="logout" slot="prefix" />
                {$_("text.logOut")}
            </sl-button>

            <sl-button
                href="#/user-preferences"
                onclick={() => {
                    dropdown.hide();
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

    .user-button::part(label) {
        padding: 0;
    }

    :global(.site-sidebar) sl-avatar {
        --size: 30px;
    }

    sl-avatar::part(base) {
        position: initial;
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
