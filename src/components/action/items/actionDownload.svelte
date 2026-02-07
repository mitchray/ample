<script>
    import { _ } from "@rgglez/svelte-i18n";
    import { API } from "~/stores/state.js";
    import { userPreference } from "~/logic/preferences.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
    import { errorHandler } from "~/logic/helper.js";

    let { actionContext } = $props();

    const { items } = actionContext;
    const downloadPreference = userPreference("download");

    let loading = $state(false);

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

        for (const item of items) {
            let song = await $API.song({ filter: item.id });

            if (song.error) {
                errorHandler("getting song", song.error);
                continue;
            }

            let file = await $API.download({
                id: item.id,
                type: "song",
                format: "raw",
            });

            if (file.error) {
                errorHandler("downloading", file.error);
                continue;
            }

            downloadFile(
                file,
                `${song.artist.name} - ${song.track} - ${song.title}.${song.format}`,
            );
        }

        loading = false;
    }
</script>

{#if $downloadPreference}
    <sl-menu-item onclick={handleAction} title={$_("text.download")} {loading}>
        <MaterialSymbol name="download" slot="prefix" />
        {$_("text.download")}
    </sl-menu-item>
{/if}
