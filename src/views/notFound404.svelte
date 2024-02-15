<script>
    import { _ } from "svelte-i18n";
    import { PageTitle } from "~/stores/state.js";

    let title = $_("text.notFound");
    $PageTitle = title;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>
