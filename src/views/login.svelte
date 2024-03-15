<script>
    import { _ } from "svelte-i18n";
    import { fade } from "svelte/transition";
    import AmpacheAPI from "javascript-ampache";
    import {
        API,
        ampleVersion,
        Server,
        debugMode,
        PageTitle,
    } from "~/stores/state.js";
    import { loginNew } from "~/logic/user";
    import UserMenu from "~/components/userMenu.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import localforage from "localforage";

    $: username = "";
    $: password = "";
    let versionCheck;
    let apiKey = "";
    let result;

    // List of tab items with labels and values.
    let tabs = [
        { id: "username", label: "Username" },
        { id: "apikey", label: "API key" },
    ];

    let fatalError = false;

    let title = $_("text.login");
    $PageTitle = title;

    // Current active tab
    let currentTab = "username";

    $: versionCheck = $Server.version?.charAt(0);

    function changeTab(e) {
        currentTab = e.detail.name;
    }

    const handleSubmit = async () => {
        setServerDetails();

        try {
            if (currentTab === "apikey") {
                result = await loginNew({ passphrase: apiKey });
            } else {
                result = await loginNew({
                    passphrase: password,
                    username: username,
                });
            }
        } catch (e) {
            fatalError = true;
        }
    };

    function setServerDetails() {
        fatalError = false;
        $API = new AmpacheAPI({ url: $Server.url, debug: $debugMode });
        localforage.setItem("AmpleServerURL", $Server.url);

        $API.ping().then((result) => {
            $Server = { ...$Server, version: result.version };
        });
    }

    function handleServer(e) {
        $Server.url = e.target.value || "";
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
</script>

<div class="container">
    <UserMenu />

    <div class="form" in:fade out:fade>
        {#if versionCheck && versionCheck < 6}
            <sl-badge class="server-message" variant="danger" in:fade>
                {$_("versionWarning", {
                    values: { serverVersion: $Server.version },
                })}
            </sl-badge>
        {/if}

        {#if $Server.loginMessage}
            <sl-alert open>
                {@html $Server.loginMessage}
            </sl-alert>
            <sl-divider></sl-divider>
        {/if}

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
                    {#if !$Server.isHardcodedURL}
                        <p>
                            <sl-input
                                type="text"
                                label={$_("text.serverURL")}
                                placeholder="e.g. https://ampache-server"
                                value={$Server.url}
                                on:sl-change={handleServer}
                                on:sl-input={handleServer}
                                on:paste={handleServer}
                            ></sl-input>
                        </p>
                    {/if}

                    <p>
                        <sl-input
                            type="text"
                            label={$_("text.username")}
                            value={username}
                            on:sl-change={handleUsername}
                            on:sl-input={handleUsername}
                            on:paste={handleUsername}
                        ></sl-input>
                        <input
                            type="text"
                            autocomplete="username"
                            bind:value={username}
                            hidden
                        />
                    </p>

                    <p>
                        <sl-input
                            type="password"
                            label={$_("text.password")}
                            value={password}
                            on:sl-change={handlePassword}
                            on:sl-input={handlePassword}
                            on:paste={handlePassword}
                        ></sl-input>
                        <input
                            type="password"
                            autocomplete="current-password"
                            bind:value={password}
                            hidden
                        />
                    </p>
                    <input type="submit" hidden />

                    <sl-button
                        variant="primary"
                        disabled={!$Server.url || !username || !password}
                        type="submit"
                    >
                        <MaterialSymbol name="login" slot="prefix" />
                        {$_("text.login")}
                    </sl-button>
                </form>
            </sl-tab-panel>

            <sl-tab-panel name="apikey">
                <form on:submit|preventDefault={handleSubmit}>
                    {#if !$Server.isHardcodedURL}
                        <p>
                            <sl-input
                                type="text"
                                label={$_("text.serverURL")}
                                placeholder="e.g. https://ampache-server"
                                value={$Server.url}
                                on:sl-change={handleServer}
                                on:sl-input={handleServer}
                                on:paste={handleServer}
                            ></sl-input>
                        </p>
                    {/if}
                    <p>
                        <sl-input
                            type="text"
                            label={$_("text.apiKey")}
                            value={apiKey}
                            on:sl-change={handleAPIkey}
                            on:sl-input={handleAPIkey}
                            on:paste={handleAPIkey}
                        ></sl-input>
                    </p>

                    <input type="submit" hidden />
                    <sl-button
                        variant="primary"
                        disabled={!$Server.url || !apiKey}
                        type="submit"
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

    <div class="meta">
        <span>Ample v{$ampleVersion}</span>
        {#if $Server.version}- <span>Ampache v{$Server.version}</span>{/if}
    </div>
</div>

<style>
    .container {
        background-color: var(--color-surface-container-lowest);
        width: 100vw;
        height: 100vh;
        z-index: 10;
    }

    .container :global(.userMenu-toggle) {
        position: absolute;
        inset-block-start: var(--spacing-md);
        inset-inline-end: var(--spacing-md);
        margin: 0;
    }

    .form {
        /* cover version details when the mobile keyboard appears */
        background-color: var(--color-surface-container);
        position: absolute;
        inset-inline-start: 50%;
        inset-block-start: 50%;
        transform: translateY(-50%) translateX(-50%);
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

    .meta {
        position: absolute;
        inset-block-end: var(--spacing-lg);
        inset-inline-end: var(--spacing-lg);
        opacity: 0.4;
    }

    sl-badge::part(base) {
        white-space: normal;
    }
</style>
