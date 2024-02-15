<script>
    export let row = null;

    import { createEventDispatcher } from "svelte";

    const dispatch = createEventDispatcher();

    function emitEvent(row) {
        dispatch("rowToggled", {
            checked: row.selected,
        });
    }

    function handleChange(e) {
        if (!row) return;

        row.selected = e.target.checked;
        row = row;
        emitEvent(row);
    }
</script>

<sl-checkbox checked={row?.selected} on:sl-change={handleChange}></sl-checkbox>
