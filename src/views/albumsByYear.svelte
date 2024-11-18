<script>
    import { _ } from "svelte-i18n";
    import { PageTitle } from "~/stores/state.js";
    import AlbumsByYear from "~/components/album/albumsByYear.svelte";

    /** @type {{params?: any}} */
    let { params = {} } = $props();

    let title = $_("text.albumsByYear");
    $PageTitle = title;
</script>

<div class="page-header">
    <h1 class="page-title">{title}</h1>
</div>

{#key params.year || 0}
    <AlbumsByYear showYear={params.year} />
{/key}
