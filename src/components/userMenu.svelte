<script>
    import { _ } from "svelte-i18n";
    import { logout } from "~/logic/user";
    import { ShowPreferences, User } from "~/stores/state.js";
    import ThemeToggle from "~/components/theme/themeToggle.svelte";
    import LanguageSelector from "~/components/languageSelector.svelte";
    import MaterialSymbol from "~/components//materialSymbol.svelte";
</script>

<sl-dropdown>
    <sl-button
        class="userMenu-toggle"
        slot="trigger"
        variant="text"
        style="width: var(--size-header-height)"
    >
        <sl-avatar
            image={$User.has_art ? $User.art : null}
            style="--size: calc(var(--size-header-height) - var(--spacing-md));"
        ></sl-avatar>
    </sl-button>

    <sl-card style="max-width: 250px">
        {#if $User.isLoggedIn}
            <div class="user-details">
                <sl-avatar image={$User.has_art ? $User.art : null}></sl-avatar>

                <span class="truncate">
                    {$User.username}
                </span>
            </div>

            <sl-divider></sl-divider>

            <sl-button
                variant="warning"
                on:click={() => {
                    logout();
                }}
                class="logout"
                title={$_("text.logOut")}
            >
                <MaterialSymbol name="logout" slot="prefix" />
                {$_("text.logOut")}
            </sl-button>

            <sl-button
                on:click={() => {
                    $ShowPreferences = !$ShowPreferences;
                }}
            >
                {$_("text.preferences")}
            </sl-button>
        {/if}

        <ThemeToggle />

        <LanguageSelector />
    </sl-card>
</sl-dropdown>

<style>
    sl-card::part(body) {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .userMenu-toggle {
        margin-inline-end: var(--spacing-sm);
    }

    .user-details {
        display: flex;
        gap: var(--spacing-md);
        align-items: center;
    }
</style>
