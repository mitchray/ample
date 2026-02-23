/**
 * MediaKeys plugin: sets Media Session action handlers for system/media keys.
 * @param {object} player - Player (coordinator) with playPause(), next(), previous(), stop()
 */
export function installMediaKeys(player) {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) {
        return;
    }
    navigator.mediaSession.setActionHandler("play", () => player.playPause());
    navigator.mediaSession.setActionHandler("pause", () => player.playPause());
    navigator.mediaSession.setActionHandler("stop", () => player.stop());
    navigator.mediaSession.setActionHandler("nexttrack", () => player.next());
    navigator.mediaSession.setActionHandler("previoustrack", () =>
        player.previous(),
    );
}
