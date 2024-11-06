<script>
    import { onMount } from "svelte";
    import { _ } from "svelte-i18n";
    import { fade } from "svelte/transition";
    import AmpacheAPI from "javascript-ampache";
    import {
        ampleVersion,
        API,
        debugMode,
        PageTitle,
        Server,
    } from "~/stores/state.js";
    import { attemptLogin } from "~/logic/user";
    import UserMenu from "~/components/userMenu.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import localforage from "localforage";

    $: username = "";
    $: password = "";
    let versionCheck;
    let apiKey = "";
    let result;
    let lastUsedTab;
    let currentTab;
    let loaded = false;

    // List of tab items with labels and values.
    let tabs = [
        { id: "username", label: $_("text.username") },
        { id: "apikey", label: $_("text.apiKey") },
    ];

    let fatalError = false;

    let title = $_("text.login");
    $PageTitle = title;

    $: versionCheck = $Server.version?.charAt(0);

    function changeTab(e) {
        currentTab = e.detail.name;
    }

    const handleSubmit = async () => {
        setServerDetails();

        try {
            if (currentTab === "apikey") {
                result = await attemptLogin({ passphrase: apiKey });
            } else {
                result = await attemptLogin({
                    passphrase: password,
                    username: username,
                });
            }

            await localforage.setItem("AmpleLastLoginMethod", currentTab);
        } catch (e) {
            fatalError = true;
        }
    };

    function setServerDetails() {
        fatalError = false;
        $API = new AmpacheAPI({ url: $Server.ampacheURL, debug: $debugMode });

        $API.ping().then((result) => {
            $Server = { ...$Server, version: result.version };
        });
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
        lastUsedTab = await localforage.getItem("AmpleLastLoginMethod");
        currentTab = lastUsedTab || "username";
        loaded = true;
    });
</script>

<div class="header">
    <UserMenu />
</div>

<div class="inner">
    <div class="form" in:fade out:fade>
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

        {#if loaded}
            <sl-tab-group on:sl-tab-show={changeTab}>
                {#each tabs as tab}
                    <sl-tab
                        slot="nav"
                        panel={tab.id}
                        active={tab.id === currentTab}
                    >
                        {tab.label}
                    </sl-tab>
                {/each}

                <sl-tab-panel name="username">
                    <form on:submit|preventDefault={handleSubmit}>
                        <p>
                            <sl-input
                                label={$_("text.username")}
                                on:paste={handleUsername}
                                on:sl-change={handleUsername}
                                on:sl-input={handleUsername}
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
                                on:paste={handlePassword}
                                on:sl-change={handlePassword}
                                on:sl-input={handlePassword}
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
                        >
                            <MaterialSymbol name="login" slot="prefix" />
                            {$_("text.login")}
                        </sl-button>
                    </form>
                </sl-tab-panel>

                <sl-tab-panel name="apikey">
                    <form on:submit|preventDefault={handleSubmit}>
                        <p>
                            <sl-input
                                label={$_("text.apiKey")}
                                on:paste={handleAPIkey}
                                on:sl-change={handleAPIkey}
                                on:sl-input={handleAPIkey}
                                type="password"
                                value={apiKey}
                            ></sl-input>
                        </p>

                        <input hidden type="submit" />
                        <sl-button
                            disabled={!apiKey}
                            type="submit"
                            variant="primary"
                        >
                            <MaterialSymbol name="login" slot="prefix" />
                            {$_("text.login")}
                        </sl-button>
                    </form>
                </sl-tab-panel>
            </sl-tab-group>
        {/if}

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

<div class="footer">
    <div class="meta">
        <span>Ample v{$ampleVersion}</span>
        {#if $Server.version}- <span>Ampache v{$Server.version}</span>{/if}
    </div>
</div>

<!-- override App overflow on this page -->
{@html `<style>
    #app {
        overflow: auto;
        background-color: var(--color-surface-container-lowest);
    }
</style>`}

<style>
    .inner {
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
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

    .header,
    .footer {
        display: flex;
        justify-content: end;
        padding: var(--spacing-md);
    }

    .meta {
        opacity: 0.4;
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
