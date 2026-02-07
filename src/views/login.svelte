<script>
    import { onMount, tick } from "svelte";
    import { _ } from "@rgglez/svelte-i18n";
    import { fade } from "svelte/transition";
    import AmpacheAPI from "javascript-ampache";
    import {
        API,
        debugMode,
        PageTitle,
        Server,
        useBearerToken,
    } from "~/stores/state.js";
    import { Settings } from "~/stores/settings.js";
    import { attemptLogin } from "~/logic/user";
    import UserMenu from "~/components/userMenu.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { pingWithTimeout } from "~/logic/user";
    import { hideLoadingOverlay } from "~/logic/ui.js";

    let username = $state("");
    let password = $state("");

    let versionCheck = $derived($Server.version?.charAt(0));
    let apiKey = $state("");
    let result = $state();
    let lastUsedTab;
    let currentTab = $state();

    // List of tab items with labels and values.
    let tabs = [
        { id: "username", label: $_("text.username") },
        { id: "apikey", label: $_("text.apiKey") },
    ];

    let fatalError = $state(false);
    let loginInProgress = $state(false);

    let title = $_("text.login");
    $PageTitle = title;

    function changeTab(e) {
        currentTab = e.detail.name;
    }

    const handleSubmit = async () => {
        fatalError = false;
        loginInProgress = true;

        try {
            await setServerDetails();

            if (currentTab === "apikey") {
                result = await attemptLogin({ passphrase: apiKey });
            } else {
                result = await attemptLogin({
                    passphrase: password,
                    username: username,
                });
            }
            $Settings.LastLoginMethod = currentTab;
        } catch (e) {
            fatalError = true;
        } finally {
            loginInProgress = false;
        }
    };

    async function setServerDetails() {
        $API = new AmpacheAPI({
            url: $Server.ampacheURL,
            useBearerToken: $useBearerToken,
            debug: $debugMode,
        });

        try {
            let result = await pingWithTimeout(5000);

            if (result.version) {
                $Server.version = result.version;
            }
        } catch (e) {
            throw new Error("Failed to set server details");
        }
    }

    function handleUsername(e) {
        username = e.target.value || "";
    }

    function handlePassword(e) {
        password = e.target.value || "";
    }

    function handleAPIkey(e) {
        apiKey = e.target.value;
    }

    onMount(async () => {
        lastUsedTab = $Settings.LastLoginMethod;
        currentTab = lastUsedTab || "username";
        await tick();
        hideLoadingOverlay();
    });
</script>

<div class="container" transition:fade>
    <div class="header">
        <UserMenu />
    </div>

    <div class="inner">
        <div class="form">
            <div class="logo">
                {#if $Server.logo}
                    <img src={$Server.logo} alt="" />
                {:else}
                    <div class="ample"></div>
                {/if}
            </div>

            {#if versionCheck && versionCheck < 6}
                <sl-badge class="server-message" variant="danger" in:fade>
                    {$_("versionWarning", {
                        values: { serverVersion: $Server.version },
                    })}
                </sl-badge>
            {/if}

            {#if !$Server.ampacheURL}
                <sl-alert variant="danger" open>
                    {$_("text.errorNoURL")}
                </sl-alert>
                <sl-divider></sl-divider>
            {/if}

            {#if $Server.loginMessage}
                <sl-alert open>
                    {@html $Server.loginMessage}
                </sl-alert>
                <sl-divider></sl-divider>
            {/if}

            <sl-tab-group onsl-tab-show={changeTab}>
                {#each tabs as tab}
                    <sl-tab
                        slot="nav"
                        panel={tab.id}
                        active={tab.id === currentTab}
                        aria-label={tab.id}
                    >
                        {tab.label}
                    </sl-tab>
                {/each}

                <sl-tab-panel name="username">
                    <form
                        onsubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <p>
                            <sl-input
                                label={$_("text.username")}
                                onpaste={handleUsername}
                                onsl-change={handleUsername}
                                onsl-input={handleUsername}
                                type="text"
                                value={username}
                            ></sl-input>
                            <input
                                autocomplete="username"
                                bind:value={username}
                                hidden
                                type="text"
                            />
                        </p>

                        <p>
                            <sl-input
                                label={$_("text.password")}
                                onpaste={handlePassword}
                                onsl-change={handlePassword}
                                onsl-input={handlePassword}
                                type="password"
                                value={password}
                            ></sl-input>
                            <input
                                autocomplete="current-password"
                                bind:value={password}
                                hidden
                                type="password"
                            />
                        </p>
                        <input hidden type="submit" />

                        <sl-button
                            disabled={!username || !password}
                            type="submit"
                            variant="primary"
                            loading={loginInProgress}
                        >
                            <MaterialSymbol name="login" slot="prefix" />
                            {$_("text.login")}
                        </sl-button>
                    </form>
                </sl-tab-panel>

                <sl-tab-panel name="apikey">
                    <form
                        onsubmit={(e) => {
                            e.preventDefault();
                            handleSubmit();
                        }}
                    >
                        <p>
                            <sl-input
                                label={$_("text.apiKey")}
                                onpaste={handleAPIkey}
                                onsl-change={handleAPIkey}
                                onsl-input={handleAPIkey}
                                type="password"
                                value={apiKey}
                                role={"textbox"}
                                aria-label="apikey_input"
                            ></sl-input>
                        </p>

                        <input hidden type="submit" />
                        <sl-button
                            disabled={!apiKey}
                            type="submit"
                            variant="primary"
                            data-testid={"apikey_login"}
                            loading={loginInProgress}
                        >
                            <MaterialSymbol name="login" slot="prefix" />
                            {$_("text.login")}
                        </sl-button>
                    </form>
                </sl-tab-panel>
            </sl-tab-group>

            {#if result?.error?.errorMessage}
                <sl-badge class="login-message" variant="warning" in:fade>
                    {result.error.errorMessage}
                </sl-badge>
            {/if}

            {#if fatalError}
                <sl-badge class="login-message" variant="danger" in:fade>
                    {$_("text.errorFatal")}
                </sl-badge>
            {/if}
        </div>
    </div>
</div>

<style>
    .container {
        --login-header-height: 100px;
        overflow: auto;
        background-color: var(--color-surface-container-lowest);
        height: 100vh;
        width: 100vw;
        position: fixed;
        z-index: 1000;
        display: flex;
        flex-direction: column;
    }

    .header {
        height: var(--login-header-height);
    }

    .inner {
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
        padding-block-end: var(--login-header-height);
    }

    .form {
        background-color: var(--color-surface-container);
        width: 100%;
        max-width: 400px;
        padding: var(--spacing-xl);
        z-index: 10;
        border-radius: 10px;
    }

    .server-message {
        position: absolute;
        inset-block-end: 100%;
        inset-inline-start: 0;
        width: 100%;
    }

    .header {
        display: flex;
        justify-content: end;
        padding: var(--spacing-md);
    }

    sl-badge::part(base) {
        white-space: normal;
    }

    .logo {
        display: flex;
        margin-block-end: var(--spacing-lg);
        justify-content: center;
    }

    .logo img {
        max-width: 100%;
        max-height: 150px;
    }

    .logo .ample {
        width: 100%;
        height: 30px;
        background-color: var(--color-on-surface-variant);
        mask: url("/src/assets/ample_logo.svg") no-repeat top center;
    }
</style>
