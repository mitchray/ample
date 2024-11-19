<script>
    import { run } from "svelte/legacy";

    import { CurrentMedia, IsPlaying, PageTitle } from "~/stores/state.js";

    window.addEventListener("blur", updateTitle);
    window.addEventListener("focus", updateTitle);

    function updateTitle() {
        if (document.hasFocus()) {
            document.title = $PageTitle;
        } else {
            switch ($CurrentMedia?.object_type) {
                case "song":
                    document.title = `${$CurrentMedia.title} - ${$CurrentMedia.artist?.name}`;
                    break;
                case "podcast_episode":
                    document.title = `${$CurrentMedia.title} - ${$CurrentMedia.podcast?.name}`;
                    break;
                case "live_stream":
                    document.title = `${$CurrentMedia.title}`;
                    break;
                default:
                    document.title = $PageTitle;
                    break;
            }
        }
    }
    run(() => {
        $PageTitle, updateTitle();
    });
    run(() => {
        $IsPlaying, updateTitle();
    });
    run(() => {
        $CurrentMedia, updateTitle();
    });
</script>
