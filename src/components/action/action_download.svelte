<script>
    import { getContext } from 'svelte';
    import { API } from "../../stores/api";
    import { loadingSpinner } from "../../actions/loadingSpinner";
    import SVGDownload from "/src/images/download.svg";

    export let contextKey;

    const { getID } = getContext(contextKey);

    let loaded = false;
    let id = getID();

    export const downloadFile = (blob, name = "download") => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }

    async function handleAction() {
        loaded = false;

        let song = await $API.song({ filter: id });
        let file = await $API.download({id: id, type: "song", format: "raw"});

        downloadFile(file, `${song.artist.name} - ${song.track} - ${song.title}.${song.format}`);

        loaded = true;
    }
</script>

<button
    type="button"
    on:click={handleAction}
    title="Download"
    use:loadingSpinner={loaded}
>
    <SVGDownload />
</button>