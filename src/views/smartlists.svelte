<script>
    import { _ } from 'svelte-i18n';
    import { API } from "../stores/api";
    import { PageTitle } from "../stores/status";
    import Lister from '../components/lister/lister.svelte';

    let title = $_('text.smartlists');
    $PageTitle = title;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="page-main">
    {#await $API.smartlists()}
        <p>{$_('text.loading')}</p>
    {:then smartlists}
        {#if smartlists.length > 0}
            <Lister
                data={smartlists}
                type="smartlist"
                initialSort="name"
                virtualList={true}
                actionData={{
                    disable: true
                }}
            />
        {:else}
            <p>{$_('text.noItemsFound')}</p>
        {/if}
    {:catch error}
        <p>{$_('text.errorGeneric')}</p>
    {/await}
</div>