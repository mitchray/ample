<script>
    import { _ } from 'svelte-i18n';
    import { getContext } from 'svelte';
    import { API } from "../../stores/api";
    import { loadingSpinner } from "../../actions/loadingSpinner";
    import SVGUpdate from "/src/images/sync.svg";
    import { addAlert } from "../../logic/alert";
    import { PageLoadedKey } from "../../stores/status";

    export let contextKey;

    const { getType, getID } = getContext(contextKey);

    let loaded = false;
    let type = getType();
    let id = getID();

    async function handleAction() {
        loaded = false;

        addAlert({title: 'Starting update from tags', style: 'info'});

        let urlBefore = window.location.href;

        $API.updateFromTags({ type: type, id: id })
            .then(result => {
                if (result?.success) {
                    let urlAfter = window.location.href;

                    if (urlBefore === urlAfter) {
                        $PageLoadedKey = Date.now().toString();
                    }

                    addAlert({title: 'Updated from tags', style: 'success'});
                } else {
                    addAlert({title: 'Failed to update from tags', message: `${result.error?.errorCode}: ${result.error?.errorMessage}`, style: 'warning'});
                }

                loaded = true;
            })
    }
</script>

<button
    type="button"
    on:click={handleAction}
    title="{$_('text.updateFromTags')}"
    use:loadingSpinner={loaded}
>
    <SVGUpdate />
</button>