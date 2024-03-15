<script>
    import { PageTitle, CurrentMedia, IsPlaying } from "~/stores/state.js";

    window.addEventListener("blur", updateTitle);
    window.addEventListener("focus", updateTitle);

    $: $PageTitle, updateTitle();
    $: $IsPlaying, updateTitle();
    $: $CurrentMedia, updateTitle();

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
</script>
