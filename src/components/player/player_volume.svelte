<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { Settings } from "~/stores/settings.svelte.js";
    import { MediaPlayer } from "~/stores/elements.js";
    import { IsMuted, NowPlayingQueue } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import PlayerOptions from "~/components/player/player_options.svelte";

    let debounceTimer;

    function logVolume(val) {
        return Math.pow(val / 100, 2);
    }

    function handleVolumeInput(e) {
        const val = Math.max(0, Math.min(100, Number(e.target.value)));

        $MediaPlayer.setMasterVolume(logVolume(val));

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            Settings.PlayerVolume = val;
        }, 300);
    }

    async function handleMuteToggle() {
        let inverted = !$IsMuted;
        IsMuted.set(inverted);
        $MediaPlayer.setMuted(inverted);
    }
</script>

<sl-button
    class="volume-control"
    disabled={$NowPlayingQueue.length === 0}
    onclick={handleMuteToggle}
    title={$IsMuted ? $_("text.volumeUnmute") : $_("text.volumeMute")}
    variant="text"
>
    <MaterialSymbol name={$IsMuted ? "volume_off" : "volume_up"} />
</sl-button>

<sl-range
    class="volume-slider volume-control"
    min="0"
    max="100"
    step="1"
    value={Settings.PlayerVolume}
    onsl-input={handleVolumeInput}
></sl-range>

<PlayerOptions />

<style>
    .volume-slider {
        --thumb-size: 0.01em;
        --track-color-active: var(--color-primary);
        --track-color-inactive: var(--color-outline-variant);
        --tooltip-offset: 25px;
        --track-height: 8px;
        width: 100%;
        min-width: 50px;
        margin: 0 10px;
        justify-self: center;
    }

    sl-range::part(input) {
        cursor: pointer;
    }
</style>
