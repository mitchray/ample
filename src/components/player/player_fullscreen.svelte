<script>
    import { FullScreenEnabled } from "../../stores/status";

    import SVGUp from "/src/images/keyboard_arrow_up.svg";
</script>

<button
    class="icon-button button--regular"
    on:click={() => { $FullScreenEnabled = true }}
>
    <SVGUp />
</button>

<style>
    button {
        margin: 0 var(--spacing-lg);
        width: 100%;
        justify-content: center;
    }
</style>