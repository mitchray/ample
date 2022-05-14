<script>
    import { onMount, getContext, tick } from 'svelte';

    import CardList from '../../components/cardList.svelte';

    export let contextKey;

    const { getData, getType } = getContext(contextKey);

    let data = getData();
    let type = getType();

    onMount(async () => {
        await tick();
    })
</script>

{#if data.length > 0}
    <CardList type={type} initialData={data} limit={data.length} showOnlyThese={true} />
{/if}