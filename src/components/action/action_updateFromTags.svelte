<script>
    import { getContext } from 'svelte';
    import { updateFromTags } from "../../logic/library";
    import { loadingSpinner } from "../../actions/loadingSpinner";
    import SVGUpdate from "../../../public/images/sync.svg";

    export let contextKey;

    const { getType, getID } = getContext(contextKey);

    let loaded = false;
    let type = getType();
    let id = getID();

    async function handleAction() {
        loaded = false;
        let result = await updateFromTags(type, id);
        if (result) {
            loaded = true;
        }
    }
</script>

<button
    type="button"
    on:click={handleAction}
    title="Update from tags"
    use:loadingSpinner={loaded}
>
    <SVGUpdate />
</button>