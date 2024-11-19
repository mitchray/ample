<script>
    import { _ } from "svelte-i18n";
    import { MediaPlayer } from "~/stores/elements.js";
    import { Settings } from "~/stores/settings.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
</script>

<sl-button
    class:active={$Settings.RepeatState !== "disabled"}
    onclick={() => $MediaPlayer.repeat()}
    title={$Settings.RepeatState === "repeat_one"
        ? $_("text.repeatOne")
        : $_("text.repeat")}
    variant="text"
>
    {#if $Settings.RepeatState === "repeat_one"}
        <MaterialSymbol name="repeat_one_on" />
    {:else}
        <MaterialSymbol name="repeat" />
    {/if}
</sl-button>

<style>
    sl-button {
        position: relative;
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
