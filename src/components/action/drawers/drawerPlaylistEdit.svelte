<script>
    import { _ } from "svelte-i18n";
    import { createEventDispatcher } from "svelte";
    import { API } from "~/stores/state.js";
    import { keepDrawerOpen } from "~/logic/ui.js";
    import { addAlert } from "~/logic/alert.js";
    import { errorHandler } from "~/logic/helper.js";
    import { Tabulator } from "tabulator-tables";

    export let playlist = null;
    export let isNew = false;

    export const show = () => drawer.show();
    const dispatch = createEventDispatcher();

    let originalName = playlist?.name || null;
    let playlistName = playlist?.name || "";
    let playlistType = playlist?.type || "private";
    let playlistTypeBoolean = playlist?.type === "public";
    let drawer;

    $: {
        playlistType = playlistTypeBoolean ? "public" : "private";
    }

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

        if (existingPlaylist.length > 0) {
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
            playlist = result;
        }

        // update Tabulator if that exists
        const playlistsTables = Tabulator.findTable("[data-id=playlists]");

        if (playlistsTables.length > 0) {
            if (isNew) {
                // add to top of list
                playlistsTables.forEach((table) => {
                    table.addRow(result, true);
                });
            } else {
                // update existing
                const editedPlaylist = await $API.playlist({
                    filter: playlist.id,
                });

                playlistsTables.forEach((table) => {
                    table?.updateRow(editedPlaylist.id, editedPlaylist);
                });
            }
        }

        addAlert({
            title: $_("text.playlistSaved"),
            style: "success",
        });

        // informs parent component
        dispatch("created");

        drawer.hide();
        setDefaults();
    }

    function setDefaults() {
        playlistName = "";
        playlistTypeBoolean = 0; // private
    }

    function handleName(e) {
        playlistName = e.target.value.trim();
    }
</script>

<sl-drawer
    {...$$restProps}
    bind:this={drawer}
    label={isNew ? $_("text.playlistNew") : $_("text.playlistEdit")}
    on:sl-request-close={keepDrawerOpen}
>
    <sl-input
        on:sl-input={handleName}
        placeholder={$_("text.name")}
        type="text"
        value={playlistName}
    ></sl-input>

    <sl-switch
        checked={playlistTypeBoolean}
        on:sl-change={() => (playlistTypeBoolean = !playlistTypeBoolean)}
    >
        Public
    </sl-switch>

    <sl-button
        disabled={!playlistName}
        on:click={savePlaylist}
        slot="footer"
        variant="primary"
    >
        Save
    </sl-button>
</sl-drawer>
