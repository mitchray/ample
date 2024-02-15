<script>
    import { _ } from "svelte-i18n";
    import { formatReleaseType } from "~/logic/formatters.js";

    export let type;

    $: formatted = formatReleaseType(type);
</script>

<div
    class="c-release-type release-type-label"
    title="{$_('text.releaseType')}: {formatted}"
>
    {formatted}
</div>

<style>
    .release-type-label {
        display: inline-block;
        padding: 0.25em 0.4em;
        line-height: 1;
        border-radius: 4px;
        font-size: 0.85em;
        text-transform: uppercase;
        font-weight: 500;
        letter-spacing: 0.03em;
        background-color: var(--color-secondary-container);
        color: var(--color-on-secondary-container);
    }
</style>
