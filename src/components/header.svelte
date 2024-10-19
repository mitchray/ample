<script>
    import { _ } from "svelte-i18n";
    import { Saved, SidebarIsOpen } from "~/stores/settings";
    import { SearchQuery, ShowSearch } from "~/stores/state.js";
    import Search from "~/components/search.svelte";
    import UserMenu from "~/components/userMenu.svelte";
    import Notifications from "~/components/notification/notifications.svelte";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { tick } from "svelte";

    let timeout;
    let inputBind;

    function handleClick() {
        ShowSearch.set(true);
    }

    function handleInputChange(event) {
        clearTimeout(timeout);

        timeout = setTimeout(function () {
            let chars = event.target.value;
            SearchQuery.set(chars);
        }, 600);
    }

    async function handleClear() {
        SearchQuery.set("");

        // don't focus the input if search isn't open
        if (!$ShowSearch) {
            await tick();
            inputBind.blur();
        }
    }

    function handleSidebarToggle() {
        let inverted = !$SidebarIsOpen;
        $Saved.setItem("SidebarIsOpen", inverted);
        SidebarIsOpen.set(inverted);
    }
</script>

<div class="site-header">
    <sl-button
        class="menu-button"
        id="sidebar-button"
        on:click={handleSidebarToggle}
    >
        <MaterialSymbol name="menu" />
    </sl-button>

    <div
        style="position: absolute; left: 50px; pointer-events: none; color: red; flex-direction: column; display: flex; display: none; "
    >
        <span style="font-size: 1.3rem; ">BETA PREVIEW</span>
        <span>Almost ready, final tweaks</span>
    </div>

    <sl-input
        bind:this={inputBind}
        class="site-search"
        clearable
        on:click={handleClick}
        on:keyup={handleInputChange}
        on:paste={handleInputChange}
        on:sl-change={handleInputChange}
        on:sl-clear={handleClear}
        on:sl-input={handleInputChange}
        placeholder={$_("text.search")}
        type="text"
        value={$SearchQuery}
    >
        <MaterialSymbol name="search" slot="prefix" />
    </sl-input>

    <div class="misc-container">
        <Notifications />
        <UserMenu />
    </div>
</div>

<Search />

<style>
    .site-header {
        width: 100%;
        height: var(--size-header-height);
        align-items: center;
        z-index: 20;
        line-height: 1;
        display: flex;
        gap: var(--spacing-sm);
        justify-content: space-between;
        justify-items: start;
    }

    @media (min-width: 500px) {
        .site-header {
            display: grid;
            grid-template-columns: 1fr auto 1fr;
        }
    }

    .menu-button {
        padding-inline-start: 2px;
    }

    .misc-container {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        justify-self: end;
    }

    .site-search {
        width: 300px; /* acts as max size */
    }

    .site-search::part(input) {
        width: 100%; /* auto size */
    }

    .site-search::part(clear-button) {
        flex-shrink: 0;
    }
</style>
