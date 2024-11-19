<script>
    import { run } from "svelte/legacy";

    import { _ } from "svelte-i18n";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { API, CurrentMedia } from "~/stores/state.js";
    import { MediaPlayer } from "~/stores/elements.js";
    import { errorHandler } from "~/logic/helper.js";
    import Portal from "~/components/portal.svelte";

    let bookmarks = $state([]);
    let clickTimeout;

    function addBookmark() {
        if (!$CurrentMedia) return;

        $API.bookmarkCreate({
            filter: $CurrentMedia.id,
            type: $CurrentMedia.object_type,
            position: $MediaPlayer.getCurrentTime(),
            client: "ample",
        }).then((result) => {
            if (result.error) {
                errorHandler("creating bookmark", result.error);
                return;
            }

            bookmarks = [result, ...bookmarks];
        });
    }

    function getBookmarks() {
        bookmarks = [];
        if (!$CurrentMedia) return;

        $API.getBookmark({
            filter: $CurrentMedia.id,
            type: $CurrentMedia.object_type,
            all: 1,
        }).then((result) => {
            if (result.error) {
                errorHandler(
                    "getting bookmarks for current item",
                    result.error,
                );
                return;
            }

            bookmarks = result.bookmark;
        });
    }

    function clickBookmark(event, bookmark) {
        clearTimeout(clickTimeout); // Clear any existing timeout

        clickTimeout = setTimeout(() => {
            if (event.detail === 1) {
                $MediaPlayer.seekTo(bookmark.position / $CurrentMedia?.time);
            } else if (event.detail > 1) {
                removeBookmark(bookmark);
            }
        }, 200);
    }

    function removeBookmark(bookmark) {
        $API.bookmarkDelete({
            filter: bookmark.id,
            type: "bookmark",
        }).then((result) => {
            if (result.error) {
                errorHandler("deleting bookmark", result.error);
                return;
            }

            bookmarks = bookmarks.filter((b) => b.id !== bookmark.id);
        });
    }
    run(() => {
        $CurrentMedia, getBookmarks();
    });
    run(() => {
        bookmarks = bookmarks;
    });
</script>

<sl-button
    disabled={!$CurrentMedia}
    onclick={addBookmark}
    title={$_("text.bookmark")}
    variant="text"
>
    <MaterialSymbol name="bookmark" />
</sl-button>

<Portal target={".bookmarks-container"}>
    {#each bookmarks as bookmark}
        <div
            class="bookmark"
            onclick={(e) => clickBookmark(e, bookmark)}
            style:left={(bookmark.position / $CurrentMedia?.time) * 100 + "%"}
        ></div>
    {/each}
</Portal>

<style>
    .bookmark {
        position: absolute;
        top: 50%;
        left: 0;
        background-color: var(--color-waveform);
        border: 2px solid var(--color-surface-container);
        border-radius: 999px;
        width: 5px;
        height: 5px;
        z-index: 200;
        cursor: crosshair;
        box-sizing: content-box;
        transform: translateY(-50%);
    }
</style>
