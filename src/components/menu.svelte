<script>
    import { onDestroy, onMount } from "svelte";
    import { fly } from 'svelte/transition';
    import { computePosition, autoUpdate, shift, flip } from '@floating-ui/dom';
    import Portal from 'svelte-portal';
    import { clickOutsideDetector } from '../actions/clickOutsideDetector';

    export let isVisible;
    export let toggleSelector;
    export let anchor;

    let menu;
    let toggleElement;
    let autoUpdateCleanup = () => {};

    function handleClickOutside() {
        isVisible = false;
    }

    function handleClickInside(event) {
        // Close menu if we are following a link
        if (event.target.href !== undefined) {
            isVisible = false;
        }
    }

    function updatePosition() {
        computePosition(toggleElement, menu, {
            placement: anchor || "bottom",
            middleware: [flip(), shift()],
        }).then(({x, y}) => {
            Object.assign(menu.style, {
                left: `${x}px`,
                top: `${y}px`,
            });
        });
    }

    onMount(() => {
        toggleElement = document.querySelector(toggleSelector);

        if (toggleElement) {
            updatePosition();

            autoUpdateCleanup = autoUpdate(
                toggleElement,
                menu,
                updatePosition
            );
        }
    });

    onDestroy(() => {
        // floating-ui
        autoUpdateCleanup();
    })
</script>

<Portal target="body">
    <div
        class="c-menu"
        class:is-open={isVisible}
        bind:this={menu}
        transition:fly={{ x: 0, y: 0, duration: 300 }}
        use:clickOutsideDetector={{
            toggle: toggleSelector,
            ignore: '.c-menu'
        }}
        on:clickedOutside={handleClickOutside}
        on:click={handleClickInside}
        >
        <slot></slot>
    </div>
</Portal>

<style>
    .c-menu {
        /*contain: layout paint;*/
        background-color: var(--color-menu-background);
        border: 2px solid var(--color-menu-border);
        border-radius: 10px;
        box-shadow: var(--shadow-lg);
        opacity: 0;
        cursor: initial;
        pointer-events: none;
        position: absolute;
        inset-block-start: 0;
        inset-inline-start: 0;
        z-index: 1000;
        padding: var(--spacing-lg);
        max-width: 100%;
    }

    .is-open {
        opacity: 1;
        pointer-events: initial;
    }

    /* some default styles for menu items */
    .c-menu :global(.menu-list) {
        display: flex;
        flex-direction: column;
        margin: 0;
    }

    .c-menu :global(.menu-list button),
    .c-menu :global(.menu-list a) {
        display: flex;
        width: 100%;
        text-align: start;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .c-menu :global(.menu-list li + li) {
        margin-block-start: var(--spacing-sm);
    }

    .c-menu :global(.title) {
        display: inline-block;
        margin-inline-end: var(--spacing-md);
    }

    .c-menu :global(label) {
        cursor: pointer;
    }
</style>
