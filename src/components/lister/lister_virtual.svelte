<script>
    import { onMount, getContext, onDestroy } from "svelte";
    import { waitForElement } from "~/logic/helper.js";

    export let contextKey;

    const {
        _virtualList,
        dataDisplay,
        dataFinal,
        offsetY,
        listerObject,
        listerScroller,
        listerContainer,
        rowHeight,
        listerHeight,
        pseudoHeight,
    } = getContext(contextKey);

    let ready = false;
    let nodePadding = 3;
    let startNode;
    let visibleNodesCount;

    $: ready = $listerScroller !== null;
    $: $dataDisplay, update(); // update whenever dataDisplay changes

    function update() {
        if (ready) {
            startNode =
                Math.floor($listerScroller.scrollTop / $rowHeight) -
                nodePadding;
            startNode = Math.max(0, startNode);

            visibleNodesCount =
                Math.ceil(parseInt($listerHeight) / $rowHeight) +
                2 * nodePadding;
            visibleNodesCount = Math.min(
                $dataDisplay.length - startNode,
                visibleNodesCount,
            );

            $offsetY = startNode * $rowHeight;

            $dataFinal = $dataDisplay
                .slice(startNode, startNode + visibleNodesCount)
                .map((d) => {
                    return d;
                });
        }
    }

    async function handleScroll() {
        $listerContainer.scrollIntoView({
            block: "start",
            inline: "nearest",
            behavior: "smooth",
        });

        update();

        // DEBUG ZONE
        // console.debug('==========================');
        // console.debug('viewport height', $listerHeight);
        // console.debug('total height', $pseudoHeight);
        // console.debug('index of first node to show', startNode);
        // console.debug('how many to show', visibleNodesCount);
        // console.debug('offset', $offsetY);
    }

    onMount(() => {
        if ($_virtualList && $listerScroller) {
            // get row height based on first item
            waitForElement($listerObject, true).then((selector) => {
                $rowHeight = selector.firstChild?.clientHeight || $rowHeight;
            });

            $listerScroller.addEventListener("scroll", handleScroll);
            update();
        }
    });

    onDestroy(() => {
        if ($listerScroller) {
            $listerScroller.removeEventListener("scroll", handleScroll);
        }
    });
</script>
