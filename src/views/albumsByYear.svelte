<script>
    import AlbumsByYear from '../components/album/albumsByYear.svelte';

    export let year;
</script>

<h1 class="page-title">Albums by Year</h1>

{#key year || 0}
    <AlbumsByYear showYear={year} />
{/key}