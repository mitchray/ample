<script>
    import { _ } from "svelte-i18n";
    import { getContext } from "svelte";
    import { API } from "~/stores/state.js";
    import { systemPreference } from "~/logic/preferences.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    export let contextKey;

    const { _item } = getContext(contextKey);

    let loading = false;

    export function downloadFile(blob, name = "download") {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }

    async function handleAction() {
        loading = true;

        let song = await $API.song({ filter: $_item.id });

        if (song.error) {
            console.error("Ample error getting song:", song.error);
            loading = false;
            return;
        }

        let file = await $API.download({
            id: $_item.id,
            type: "song",
            format: "raw",
        });

        if (file.error) {
            console.error("Ample error downloading:", file.error);
            loading = false;
            return;
        }

        downloadFile(
            file,
            `${song.artist.name} - ${song.track} - ${song.title}.${song.format}`,
        );

        loading = false;
    }
</script>

{#if systemPreference("download")}
    <sl-menu-item on:click={handleAction} title={$_("text.download")} {loading}>
        <MaterialSymbol name="download" slot="prefix" />
        {$_("text.download")}
    </sl-menu-item>
{/if}
