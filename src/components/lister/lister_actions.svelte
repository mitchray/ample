<script>
    import {getContext} from "svelte";

    import SVGCenter from "../../../public/images/center_focus.svg";
    import SVGDistribute from "../../../public/images/horizontal_distribute.svg";

    export let contextKey;

    const { listerHeader, listerWrapper, listerContainer } = getContext(contextKey);

    function centerLister() {
        $listerWrapper.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "center"
        });
    }
</script>


<div class="actions">
    <button on:click={centerLister} class="with-icon" title="Center in view"><SVGCenter style="padding: 0.05em;" /> Center in view</button>
    <button on:click={() => { $listerHeader.calculateWidths() }} class="with-icon" title="Reset widths"><SVGDistribute style="padding: 0.05em;" /> Reset widths</button>
</div>


<style>
    .actions {
        margin-bottom: var(--spacing-sm);
    }
</style>