<script>
    import { _ } from 'svelte-i18n';
    import { API } from "../stores/api";
    import { PageTitle } from "../stores/status";
    import Lister2 from '../components/lister/lister.svelte';

    let title = $_('title.smartlists');
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
            <Lister2
                data={smartlists}
                type="smartlist"
                initialSort="name"
                virtualList={true}
                actionData={{
                    disable: true
                }}
            />
        {:else}
            <p>Unable to find any smartlists</p>
        {/if}
    {:catch error}
        <p>Something went wrong: {error.message}</p>
    {/await}
</div>