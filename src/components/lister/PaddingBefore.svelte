<script>
    let { height = 0 } = $props();
</script>

<div class="padding-before" style="height: {height}px;" aria-hidden="true"></div>

<style>
    .padding-before {
        flex-shrink: 0;
        pointer-events: none;
    }
</style>
