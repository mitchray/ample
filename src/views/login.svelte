<script>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    import { lchToRgb } from 'color-converters';

    import { serverVersion } from "../stores/server";
    import { ThemeIsLight } from "../stores/status";
    import { customColors, ampleVersion } from "../stores/player";

    import { handshake, handshakeAPI } from '../logic/user';
    import { getLegibleColors, getRandomInt } from '../logic/helper';

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

    $: theme = $ThemeIsLight ? 'light' : 'dark';

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
        legibleColors = await getLegibleColors(randomColor);
        customColors.set(legibleColors);
    });
</script>

<div class="container">
    <ThemeToggle />

    <div class="form" in:fade out:fade>
        {#if versionCheck && versionCheck < 5}
            <p class="server-message badge danger" in:fade>Ample only supports Ampache v5 and up. Version {$serverVersion} detected.</p>
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
                    <button class="primary with-icon" type="submit"><SVGLogin /> Login</button>
                </form>
            </div>

            <div class="api" style="display: {currentTab === 2 ? 'block' : 'none'}">
                <form on:submit|preventDefault={handleSubmitAPI}>
                    <p>
                        <label>API key
                            <input type="text" bind:value={apiKey} />
                        </label>
                    </p>

                    <button class="primary with-icon" type="submit"><SVGLogin /> Login</button>
                </form>
            </div>
        </Tabs>

        {#if message}
            <p class="login-message badge warning" in:fade>{message}</p>
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
        margin-bottom: var(--spacing-lg);
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
        background-color: var(--color-interface-10);
        border-radius: 15px;
        z-index: 10;
        border-top: 2px solid var(--color-tint-100);
        box-shadow: var(--shadow-xl);
    }

    @supports (backdrop-filter: blur(0)) {
        .form {
            background-color: var(--color-tint-50);
            backdrop-filter: blur(15px) saturate(180%);
        }
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

    .bg-container {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 0;
        background-size: 30px 30px;
        background-image:
                linear-gradient(to right, var(--color-tint-50) 1px, transparent 1px),
                linear-gradient(to bottom, var(--color-tint-50) 1px, transparent 1px);
    }

    :global(.theme-is-light) .bg-container {
        background-color: var(--color-lines);
        background-image:
                linear-gradient(to right, var(--color-shade-50) 1px, transparent 1px),
                linear-gradient(to bottom, var(--color-shade-50) 1px, transparent 1px);
    }

    .bg {
        background-image: linear-gradient(-60deg, var(--color-interface-00) 50%, var(--color-lines) 50%);
        bottom: 0;
        left: -50%;
        opacity: 0.2;
        position: fixed;
        right: -50%;
        top: 0;
        z-index: 1;
    }
</style>