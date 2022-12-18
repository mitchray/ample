<script>
    import { CurrentMedia } from "../../stores/status";

    import Rating from '../rating.svelte';
</script>

{#if $CurrentMedia}
    <Rating type="song" id="{$CurrentMedia.id}" rating="{$CurrentMedia.rating}" flag="{$CurrentMedia.flag}" averageRating="{$CurrentMedia.averagerating}" />
{:else}
    <Rating type="song" />
{/if}