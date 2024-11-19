<script>
    let { text } = $props();
</script>

<div class="c-badge badge-label truncate" title={text}>
    <span class="truncate">{text}</span>
</div>

<style>
    .badge-label {
        display: inline-flex;
        align-items: center;
        padding: 0.25em 0.4em;
        line-height: 1;
        border-radius: 4px;
        font-size: 10px;
        text-transform: uppercase;
        font-weight: 500;
        letter-spacing: 0.03em;
        background-color: var(--color-secondary-container-variant);
        color: var(--color-on-secondary-container);
    }
</style>
