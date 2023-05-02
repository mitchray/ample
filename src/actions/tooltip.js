import { computePosition, flip } from '@floating-ui/dom';

/**
 *
 * @param node Triggering item
 * @param options.text The text to display in the tooltip
 * @param options.placement The positioning of the tooltip relative to trigger item
 * @returns {{destroy(): void}}
 */
export function tooltip(node, options) {
    node.addEventListener('mouseover', handleIn);
    node.addEventListener('mouseout', handleOut);

    let tt;
    let ttText;

    options.placement = options.placement || "top";

    function handleIn(e) {
        if (node.dataset.tooltipDisabled === "true") {
            return tt;
        }

        tt = document.createElement("div");
        tt.classList.add("tooltip");
        ttText = document.createTextNode(options.text);
        tt.appendChild(ttText);
        document.body.append(tt);

        computePosition(node, tt, {
            placement: options.placement,
            middleware: [flip()],
        }).then(({x, y}) => {
            Object.assign(tt.style, {
                left: `${x}px`,
                top: `${y}px`,
            });
        });

        tt.style.display = 'block';
    }

    function handleOut(e) {
        if (tt) {
            tt.style.display = '';
            tt.remove();
        }
    }

    return {
        destroy() {
            node.removeEventListener('mouseover', handleIn);
            node.removeEventListener('mouseout', handleOut);

            if (tt) {
                tt.remove();
            }
        }
    };
}