<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { lchToRgb } from 'color-converters';

    import { serverVersion } from "../stores/server";
    import { Theme } from "../stores/status";
    import { ampleVersion } from "../stores/player";

    import { handshake, handshakeAPI } from '../logic/user';
    import { getCustomHue, getRandomInt } from '../logic/helper';

    import Tabs from "../components/tabs.svelte";
    import ThemeToggle from '../components/themeToggle.svelte';

    import SVGAmpleLogo from "../../public/images/ample_logo.svg";
    import SVGLogin from "../../public/images/login.svg";

    let theme;
    let versionCheck;
    let username = "";
    let password = "";
    let apiKey = "";
    let promise;
    let legibleColors;
    let randomColor = lchToRgb([50, 50, getRandomInt(360)]);
    let message = '';

    // List of tab items with labels and values.
    let tabItems = [
        { label: "Username", value: 1 },
        { label: "API key",  value: 2 }
    ];

    // Current active tab
    let currentTab;

    $: theme = $Theme;

    $: versionCheck = $serverVersion.charAt(0);

    const handleSubmitUsername = async (e) => {
        message = '';
        message = await handshake(username, password);
    }

    const handleSubmitAPI = async (e) => {
        message = '';
        message = await handshakeAPI(apiKey);
    }

    onMount(async () => {
        await getCustomHue(randomColor);
    });
</script>

<div class="container">
    <ThemeToggle />

    <div class="form" in:fade out:fade>
        {#if versionCheck && versionCheck < 5}
            <p class="server-message badge badge--danger" in:fade>Ample only supports Ampache v5 and up. Version {$serverVersion} detected.</p>
        {/if}

        <div class="logo">
            <SVGAmpleLogo />
        </div>

        <Tabs bind:activeTabValue={currentTab} items={tabItems}>
            <div class="username" style="display: {currentTab === 1 ? 'block' : 'none'}">
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
            </div>

            <div class="api" style="display: {currentTab === 2 ? 'block' : 'none'}">
                <form on:submit|preventDefault={handleSubmitAPI}>
                    <p>
                        <label>API key
                            <input type="text" bind:value={apiKey} />
                        </label>
                    </p>

                    <button class="button button--primary" type="submit"><SVGLogin /> Login</button>
                </form>
            </div>
        </Tabs>

        {#if message}
            <p class="login-message badge badge--warning" in:fade>{message}</p>
        {/if}

        <div class="meta">
            <span>Ample v{$ampleVersion}</span> {#if $serverVersion}- <span>Ampache v{$serverVersion}</span>{/if}
        </div>
    </div>
</div>

<div class="bg-container" out:fade>
    <div class="bg"></div>
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
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translateY(-50%) translateX(-50%);
        width: 100%;
        max-width: 400px;
        padding: var(--spacing-xxl);
        background-color: var(--color-interface);
        border-radius: 15px;
        z-index: 10;
        box-shadow: var(--shadow-xl);
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
        top: 100%;
        left: 0;
        width: 100%;
    }

    .meta {
        position: absolute;
        bottom: var(--spacing-xl);
        right: var(--spacing-xxl);
        opacity: 0.4;
    }

    .bg {
        background-color: var(--color-highlight);
        bottom: 0;
        left: -50%;
        position: fixed;
        right: -50%;
        top: 0;
        z-index: 1;
        opacity: 0.1;
    }
</style>