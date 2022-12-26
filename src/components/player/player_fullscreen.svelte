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