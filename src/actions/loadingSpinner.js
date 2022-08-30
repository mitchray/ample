import { sleep } from "../logic/helper"; // tick doesn't work

export function loadingSpinner(node, loaded) {
    let original = node.innerHTML;
    let dimensions = node.getBoundingClientRect();

    function handleClick(event) {
        // ignore clicks unless its on our target
        if (!node.contains(event.target)) {
            return;
        }

        startSpinner();
    }

    function startSpinner() {
        node.style.width = dimensions.right - dimensions.left + 'px';
        node.style.height = dimensions.bottom - dimensions.top + 'px';
        node.classList.add('loading');
        node.innerHTML = '';
    }

    function stopSpinner() {
        node.innerHTML = original;
        node.classList.remove('loading');
        node.style = null;
    }

    window.addEventListener('click', handleClick);

    return {
        async update(loaded) {
            await sleep(50);

            if (loaded === true) {
                stopSpinner();
            }
        },

        destroy() {
            window.removeEventListener('click', handleClick);
        }
    };
}