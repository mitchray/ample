<script>
    import { onMount, getContext, tick } from 'svelte';
    import { ListerEvent } from "../../stores/message";
    import CardList from '../../components/cardList.svelte';

    export let contextKey;

    const { getType, dataDisplay } = getContext(contextKey);

    let type = getType();

    onMount(async () => {
        await tick();
    })
</script>

{#key $ListerEvent._id || 0}
    {#if $dataDisplay.length > 0}
        <CardList type={type} initialData={$dataDisplay} limit={$dataDisplay.length} showOnlyThese={true} />
    {/if}
{/key}