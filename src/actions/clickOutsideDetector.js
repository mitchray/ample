export function clickOutsideDetector(node, options) {
    function handleEvent(e) {
        // ignore clicks without our object
        if (node.contains(e.target)) {
            return;
        }

        // ignore clicks on the toggle
        if (options.toggle && options.toggle.contains && options.toggle.contains(e.target)) {
            return;
        }

        // ignore clicks on specified items
        if (options.ignore && e.target.closest(options.ignore)) {
            return;
        }

        node.dispatchEvent(new CustomEvent('clickedOutside'));
    }

    window.addEventListener('mousedown', handleEvent);

    return {
        destroy() {
            window.removeEventListener('mousedown', handleEvent);
        }
    };
}