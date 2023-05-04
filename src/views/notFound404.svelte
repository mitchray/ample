<script>
    import {PageTitle} from "../stores/status";

    let title = "Not found";
    $PageTitle = title;
</script>

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div class="page-main">
    <p>Sorry not found</p>
</div>