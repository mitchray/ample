<script>
    import GenreByType from "~/components/genre/genreByType.svelte";

    let { id } = $props();
</script>

<GenreByType {id} type="song" />
