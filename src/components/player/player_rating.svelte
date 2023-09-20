<script>
    import { CurrentMedia } from "../../stores/status";

    import Rating from '../rating.svelte';
</script>

{#if $CurrentMedia}
    <Rating type="song" data={$CurrentMedia} />
{:else}
    <Rating type="song" />
{/if}