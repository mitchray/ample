<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { lchToRgb } from 'color-converters';

    import { serverVersion } from "../stores/server";
    import { PageTitle, Theme } from "../stores/status";
    import { ampleVersion } from "../stores/player";

    import { loginNew } from '../logic/user';
    import { getRandomInt } from '../logic/helper';
    import { setCustomHue } from '../logic/color';

    import Tabs from "../components/tabs/tabs.svelte";
    import Tab from "../components/tabs/tab.svelte";
    import ThemeToggle from '../components/themeToggle.svelte';

    import SVGAmpleLogo from "/src/images/ample_logo.svg";
    import SVGLogin from "/src/images/login.svg";

    let theme;
    let versionCheck;
    let username = "";
    let password = "";
    let apiKey = "";
    let randomColor = lchToRgb([50, 50, getRandomInt(360)]);
    let result;

    // List of tab items with labels and values.
    let tabItems = [
        { label: "Username", value: 1 },
        { label: "API key",  value: 2 }
    ];

    let title = "Login";
    $PageTitle = title;

    // Current active tab
    let currentTab;

    $: theme = $Theme;

    $: versionCheck = $serverVersion.charAt(0);

    const handleSubmitUsername = async (e) => {
        result = await loginNew({ passphrase: password, username: username });
    }

    const handleSubmitAPI = async (e) => {
        result = await loginNew({ passphrase: apiKey });
    }

    onMount(async () => {
        await setCustomHue(randomColor);
    });
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="container">
    <ThemeToggle />

    <div class="form" in:fade out:fade>
        {#if versionCheck && versionCheck < 6}
            <p class="server-message badge badge--danger" in:fade>This version of Ample only supports Ampache v6 and up. Version {$serverVersion} detected.</p>
        {/if}

        <div class="logo">
            <SVGAmpleLogo />
        </div>

        <Tabs bind:activeTabValue={currentTab} items={tabItems}>
            <Tab id={1} bind:activeTabValue={currentTab} class="username login-tab">
                <form on:submit|preventDefault={handleSubmitUsername}>
                    <p>
                        <label>Ampache username
                            <input type="text" autofocus bind:value={username} />
                        </label>
                    </p>
                    <p>
                        <label>Ampache password
                            <input type="password" bind:value={password} />
                        </label>
                    </p>
                    <button class="button button--primary" type="submit"><SVGLogin /> Login</button>
                </form>
            </Tab>

            <Tab id={2} bind:activeTabValue={currentTab} class="api login-tab">
                <form on:submit|preventDefault={handleSubmitAPI}>
                    <p>
                        <label>API key
                            <input type="text" bind:value={apiKey} />
                        </label>
                    </p>

                    <button class="button button--primary" type="submit"><SVGLogin /> Login</button>
                </form>
            </Tab>
        </Tabs>

        {#if result && result.error && result.error.errorMessage}
            <p class="login-message badge badge--warning" in:fade>{result.error.errorMessage}</p>
        {/if}
    </div>

    <div class="meta">
        <span>Ample v{$ampleVersion}</span> {#if $serverVersion}- <span>Ampache v{$serverVersion}</span>{/if}
    </div>
</div>

<style>
    .logo {
        margin-bottom: var(--spacing-xl);
    }

    .container {
        width: 100vw;
        height: 100vh;
        z-index: 10;
    }

    .container :global(.theme-toggle) {
        position: absolute;
        top: var(--spacing-md);
        right: var(--spacing-md);
        margin: 0;
    }

    .form {
        background-color: var(--color-background); /* cover version details when the mobile keyboard appears */
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateY(-50%) translateX(-50%);
        width: 100%;
        max-width: 400px;
        padding: var(--spacing-xxl);
        z-index: 10;
    }

    label > * {
        margin-top: var(--spacing-sm);
    }

    label input {
        display: table;
        width: 100%;
    }

    button {
        margin-top: var(--spacing-md);
    }

    .server-message {
        position: absolute;
        bottom: 100%;
        left: 0;
        width: 100%;
    }

    .login-message {
        position: absolute;
        left: var(--spacing-xxl);
        right: var(--spacing-xxl);
    }

    .meta {
        position: absolute;
        bottom: var(--spacing-lg);
        right: var(--spacing-lg);
        opacity: 0.4;
    }

    /* don't shift layout when tabs change */
    .form :global(.login-tab) {
        min-height: 190px;
    }
</style>