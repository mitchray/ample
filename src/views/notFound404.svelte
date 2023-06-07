<script>
    import { _ } from 'svelte-i18n';
    import { PageTitle } from "../stores/status";

    let title = $_('title.notFound');
    $PageTitle = title;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="page-main">
    <p>Sorry not found</p>
</div>