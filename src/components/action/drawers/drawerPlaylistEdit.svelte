<script>
    import { _ } from "svelte-i18n";
    import { createEventDispatcher } from "svelte";
    import { API } from "~/stores/state.js";
    import { DispatchListerEvent } from "~/stores/message.js";
    import { keepDrawerOpen } from "~/logic/ui.js";
    import { addAlert } from "~/logic/alert.js";

    export let playlist = null;
    export let isNew = false;

    export const show = () => drawer.show();
    const dispatch = createEventDispatcher();

    let playlistName = playlist?.name || "";
    let playlistType = playlist?.type || "private";
    let playlistTypeValue = playlist?.type === "public";
    let drawer;

    $: {
        playlistType = playlistTypeValue ? "public" : "private";
    }

    async function savePlaylist() {
        playlistName = playlistName.trim();

        if (playlistName) {
            let playlistTest = await $API.playlists({
                filter: playlistName,
                exact: 1,
                limit: 1,
                hide_search: 1,
            });

            if (isNew) {
                if (playlistTest.length > 0 && playlistTest[0].id) {
                    addAlert({
                        title: $_("text.playlistExists", {
                            values: { name: playlistName },
                        }),
                        style: "warning",
                    });
                    return;
                }

                playlist = await $API.playlistCreate({
                    name: playlistName,
                    type: playlistType,
                });

                if (playlist.error) {
                    console.error(
                        "Ample error creating playlist:",
                        playlist.error,
                    );
                    return;
                }

                addAlert({
                    title: $_("text.playlistCreated"),
                    style: "success",
                });

                // informs parent component
                dispatch("created");

                // informs lister
                $DispatchListerEvent = {
                    event: "addedPlaylist",
                    data: playlist,
                    type: "playlist",
                };

                // reset once completed
                playlist = null;
            } else {
                if (playlistTest?.id && playlistTest?.id !== playlist.id) {
                    return;
                }

                let result = await $API.playlistEdit({
                    filter: playlist.id,
                    name: playlistName,
                    type: playlistType,
                });

                if (result.error) {
                    console.error(
                        "Ample error editing playlist:",
                        result.error,
                    );
                    return;
                }

                if (result.success) {
                    let tempPlaylist = await $API.playlist({
                        filter: playlist.id,
                    });

                    if (tempPlaylist.error) {
                        console.error(
                            "Ample error getting playlist:",
                            tempPlaylist.error,
                        );
                    }

                    if (playlist.isNew) {
                        tempPlaylist.isNew = true;
                    }
                    playlist = tempPlaylist;

                    addAlert({
                        title: $_("text.playlistUpdated"),
                        style: "success",
                    });

                    $DispatchListerEvent = {
                        event: "editedPlaylist",
                        data: playlist,
                        type: "playlist",
                    };
                } else {
                    addAlert({
                        title: $_("text.playlistGone"),
                        style: "warning",
                    });

                    $DispatchListerEvent = {
                        event: "deletedPlaylist",
                        data: playlist,
                        type: "playlist",
                    };
                }
            }
        }

        drawer.hide();
    }

    function handleChange(e) {
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
        on:sl-input={handleChange}
        placeholder={$_("text.name")}
        type="text"
        value={playlistName}
    ></sl-input>

    <sl-switch
        checked={playlistTypeValue}
        on:sl-change={() => (playlistTypeValue = !playlistTypeValue)}
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
