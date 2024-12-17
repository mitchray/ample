<script>
    import { _ } from "svelte-i18n";
    import { API } from "~/stores/state.js";
    import { keepDrawerOpen } from "~/logic/ui.js";
    import { addAlert } from "~/logic/alert.js";
    import { errorHandler } from "~/logic/helper.js";
    import { Tabulator } from "tabulator-tables";

    let { playlist = $bindable(null), isNew = false, ...rest } = $props();

    export const show = () => {
        resetValues();
        drawer.show();
    };

    let defaultName = "";
    let defaultType = "private";

    let originalName = playlist?.name || null;
    let playlistName = $state(playlist?.name || defaultName);
    let playlistType = $state(playlist?.type || "private");
    let playlistTypeBoolean = $derived(playlistType === "public");
    let drawer = $state();

    async function savePlaylist() {
        // do checks
        playlistName = playlistName.trim();
        if (playlistName.length < 1) return;

        let result;
        const existingPlaylist = await $API.playlists({
            filter: playlistName,
            exact: 1,
            limit: 1,
            hide_search: 1,
        });

        if (existingPlaylist.total_count > 0) {
            if (isNew || playlistName !== originalName) {
                addAlert({
                    title: $_("text.playlistExists", {
                        values: { name: playlistName },
                    }),
                    style: "warning",
                });
                return;
            }
        }

        // create/edit
        if (isNew) {
            result = await $API.playlistCreate({
                name: playlistName,
                type: playlistType,
            });
        } else {
            result = await $API.playlistEdit({
                filter: playlist.id,
                name: playlistName,
                type: playlistType,
            });
        }

        if (result.error) {
            errorHandler("saving playlist", result.error);
            return;
        }

        if (isNew) {
            result.selected = true;
            playlist = result;
        }

        // update Tabulator if that exists
        const playlistsTables = Tabulator.findTable("[data-id=playlists]");

        if (playlistsTables.length > 0) {
            if (isNew) {
                // add to top of list
                if (Array.isArray(playlistsTables)) {
                    playlistsTables.forEach((table) => {
                        table.addRow(result, true);
                    });
                }
            } else {
                // update existing
                const editedPlaylist = await $API.playlist({
                    filter: playlist.id,
                });

                if (Array.isArray(playlistsTables)) {
                    playlistsTables.forEach((table) => {
                        table?.updateRow(editedPlaylist.id, editedPlaylist);
                    });
                }
            }
        }

        addAlert({
            title: $_("text.playlistSaved"),
            style: "success",
        });

        drawer.hide();
    }

    function handleName(e) {
        playlistName = e.target.value.trim();
    }

    function handleClose() {
        resetValues();
    }

    function resetValues() {
        if (isNew) {
            playlistName = defaultName;
            playlistType = defaultType;
        } else {
            playlistName = playlist?.name || null;
            playlistType = playlist?.type || "private";
        }
    }
</script>

<sl-drawer
    {...rest}
    bind:this={drawer}
    label={isNew ? $_("text.playlistNew") : $_("text.playlistEdit")}
    onsl-request-close={keepDrawerOpen}
    onsl-hide={handleClose}
>
    <sl-input
        onsl-input={handleName}
        placeholder={$_("text.name")}
        type="text"
        value={playlistName}
    ></sl-input>

    <sl-switch
        checked={playlistTypeBoolean}
        onsl-change={() =>
            (playlistType = playlistType === "public" ? "private" : "public")}
    >
        Public
    </sl-switch>

    <sl-button
        disabled={!playlistName}
        onclick={savePlaylist}
        slot="footer"
        variant="primary"
    >
        Save
    </sl-button>
</sl-drawer>
