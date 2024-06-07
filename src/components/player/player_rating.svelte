<script>
    import { CurrentMedia } from "~/stores/state.js";
    import Rating from "~/components/rating/rating.svelte";
</script>

{#key $CurrentMedia || 0}
    {#if $CurrentMedia}
        {#if $CurrentMedia.object_type !== "live_stream"}
            <Rating type={$CurrentMedia.object_type} data={$CurrentMedia} />
        {/if}
    {:else}
        <Rating type="song" />
    {/if}
{/key}
