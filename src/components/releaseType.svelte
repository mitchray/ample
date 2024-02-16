<script>
    import { _ } from "svelte-i18n";
    import { formatReleaseType } from "~/logic/formatters.js";

    export let type;

    $: formatted = formatReleaseType(type);
</script>

<div
    class="c-release-type release-type-label truncate"
    title="{$_('text.releaseType')}: {formatted}"
>
    <span class="truncate">{formatted}</span>
</div>

<style>
    .release-type-label {
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
