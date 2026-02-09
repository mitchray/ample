<script>
    let { height = 0 } = $props();
</script>

<div class="padding-after" style="height: {height}px;" aria-hidden="true"></div>

<style>
    .padding-after {
        flex-shrink: 0;
        pointer-events: none;
    }
</style>
