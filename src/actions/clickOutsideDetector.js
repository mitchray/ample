export function clickOutsideDetector(node, options) {
    function handleEvent(e) {
        let toggleElement = document.querySelector(options.toggle) || null;
        let ignoreElement = document.querySelector(options.ignore) || null;

        // ignore clicks without our object
        if (node.contains(e.target)) {
            return;
        }

        // ignore clicks on the toggle
        if (toggleElement && toggleElement.contains && toggleElement.contains(e.target)) {
            return;
        }

        // ignore clicks on specified items
        if (ignoreElement && e.target.closest(options.ignore)) {
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