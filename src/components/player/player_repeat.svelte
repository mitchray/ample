<script>
    import { _ } from "svelte-i18n";
    import { MediaPlayer } from "~/stores/elements.js";
    import { RepeatEnabled } from "~/stores/settings.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
</script>

<sl-button
    class:active={$RepeatEnabled}
    on:click={$MediaPlayer.repeat()}
    title={$_("text.repeat")}
    variant="text"
>
    <MaterialSymbol name="repeat" />
</sl-button>

<style>
    sl-button {
        display: relative;
    }

    .active:after {
        content: "";
        background-color: var(--color-primary);
        position: absolute;
        width: 3px;
        height: 3px;
        border-radius: 100%;
        top: 80%;
        left: 50%;
        transform: translateX(-50%);
    }
</style>
