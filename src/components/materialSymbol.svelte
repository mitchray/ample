<script>
    export let name;
    export let variant = "outlined";
    export let fill = true;
    export let weight = 400;
    export let grade = 0;
    export let opticalSize = 24;
    export let size = "1em";
    export let classes = "";
</script>

{#if name}
    <span
        class="material-symbols-{variant} icon {classes}"
        style="font-size: {size};
        font-variation-settings:
        'FILL' {fill ? 1 : 0},
        'wght' {weight},
        'GRAD' {grade},
        'opsz' {opticalSize};"
        {...$$restProps}
    >
        {name}
    </span>
{/if}
