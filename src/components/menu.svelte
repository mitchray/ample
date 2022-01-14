<script>
    import { onMount } from "svelte";
    import { fly } from 'svelte/transition';

    import { clickOutsideDetector } from '../actions/clickOutsideDetector';

    export let isVisible;
    export let toggleElement;
    export let anchor;

    let spacing = 10;
    let menu;
    let menuBounds;
    let coords = [];
    let toggleBounds;

    $: {
        if (toggleElement && menu) {
            toggleBounds = toggleElement.getBoundingClientRect();
            menuBounds = menu.getBoundingClientRect();

            getAnchorCoordinates();

            menu.style.setProperty('--mouse-x', coords.left + 'px');
            menu.style.setProperty('--mouse-y', coords.top + 'px');
            menu.style.setProperty('--width', menuBounds.width + 'px');
            menu.style.setProperty('--height', menuBounds.height + 'px');
        }
    }

    function handleClickOutside() {
        isVisible = false;
    }

    function handleClickInside(event) {
        event.stopPropagation();

        // Close menu if we are following a link
        if (event.target.href !== undefined) {
            isVisible = false;
        }
    }

    onMount(() => {
        let menuContainer = document.querySelector('#menu-container');

        if (menu) {
            // move menu to be a direct child of body
            menuContainer.append(menu);
        }
    });

    // in reference to clicked item
    function getAnchorCoordinates() {
        if (toggleBounds && menuBounds) {
            let posLeft           = toggleBounds.left - menuBounds.width - spacing;
            let posRight          = toggleBounds.right + spacing;
            let posTop            = toggleBounds.top - menuBounds.height - spacing;
            let posBottom         = toggleBounds.top + toggleBounds.height + spacing;
            let alignTop          = toggleBounds.top;
            let alignMiddleHeight = toggleBounds.top + (toggleBounds.height / 2) - (menuBounds.height / 2);
            let alignMiddleWidth  = toggleBounds.left + (toggleBounds.width / 2) - (menuBounds.width / 2);
            let alignBottom       = toggleBounds.bottom - menuBounds.height;
            let alignLeft         = toggleBounds.left;
            let alignRight        = toggleBounds.right - menuBounds.width;

            // [relative to toggle]-[alignment with toggle]
            switch (anchor) {
                case 'top-left':
                    coords.top = posTop;
                    coords.left = alignLeft;
                    break;
                case 'bottom-left':
                    coords.top = posBottom;
                    coords.left = alignLeft;
                    break;
                case 'top-center':
                    coords.top = posTop;
                    coords.left = alignMiddleWidth;
                    break;
                case 'bottom-center':
                    coords.top = posBottom;
                    coords.left = alignMiddleWidth;
                    break;
                case 'top-right':
                    coords.top = posTop;
                    coords.left = alignRight;
                    break;
                case 'bottom-right':
                    coords.top = posBottom;
                    coords.left = alignRight;
                    break;
                case 'left-center':
                    coords.top = alignMiddleHeight;
                    coords.left = posLeft;
                    break;
                case 'right-center':
                    coords.top = alignMiddleHeight;
                    coords.left = posRight;
                    break;
                case 'left-top':
                    coords.top = alignTop;
                    coords.left = posLeft;
                    break;
                case 'right-top':
                    coords.top = alignTop;
                    coords.left = posRight;
                    break;
                case 'left-bottom':
                    coords.top = alignBottom;
                    coords.left = posLeft;
                    break;
                case 'right-bottom':
                    coords.top = alignBottom;
                    coords.left = posRight;
                    break;
                default:
                    console.warn(anchor + " as a menu anchor position was not found");
                    coords.top = posBottom;
                    coords.left = alignLeft;
                    break;
            }
        }
    }
</script>

<div
    class="c-menu"
    class:is-open={isVisible}
    bind:this={menu}
    transition:fly={{ x: 0, y: 0, duration: 300 }}
    use:clickOutsideDetector={{
        toggle: toggleElement,
        ignore: '.c-menu'
    }}
    on:clickedOutside={handleClickOutside}
    on:click={handleClickInside}
>
    <slot></slot>
</div>

<style>
    /* TODO: restore transparency? */
    .c-menu {
        contain: layout paint;
        background-color: var(--color-menu-background);
        border: 2px solid var(--color-menu-border);
        border-radius: 5px;
        box-shadow: var(--shadow-lg);
        opacity: 0;
        cursor: initial;
        pointer-events: none;
        position: fixed;
        top: min(max(0%, var(--mouse-y)), calc(100vh - var(--height)));
        left: min(max(0%, var(--mouse-x)), calc(100vw - var(--width)));
        z-index: 1000;
    }

    .is-open {
        opacity: 1;
        pointer-events: initial;
    }

    /* some default styles for menu items */
    .c-menu :global(li + li) {
        margin-top: var(--spacing-md);
    }

    .c-menu :global(.menu-list) {
        display: flex;
        flex-direction: column;
        margin: 0;
    }

    .c-menu :global(.menu-list button),
    .c-menu :global(.menu-list a) {
        display: flex;
        width: 100%;
        text-align: left;
        align-items: center;
        gap: var(--spacing-sm);
    }

    .c-menu :global(.title) {
        margin-bottom: 0;
        display: inline-block;
        margin-right: var(--spacing-xl);
    }
</style>
