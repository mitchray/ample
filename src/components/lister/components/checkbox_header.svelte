<script>
    import { getContext } from "svelte";

    export let contextKey;

    let { dataDisplay, selectedCount } = getContext(contextKey);

    function toggleAllChecked(e) {
        $dataDisplay.forEach(
            (element) => (element.selected = !!e.target.checked),
        );

        // reset counts
        $selectedCount = e.target.checked ? $dataDisplay.length : 0;

        $dataDisplay = $dataDisplay;
    }
</script>

<sl-checkbox
    checked={$selectedCount === $dataDisplay.length}
    indeterminate={$selectedCount > 0 && $selectedCount !== $dataDisplay.length}
    on:sl-change={toggleAllChecked}
></sl-checkbox>
