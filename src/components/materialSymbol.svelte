<script>
    /** @type {{name: any, variant?: string, fill?: boolean, weight?: number, grade?: number, opticalSize?: number, size?: string, classes?: string, [key: string]: any}} */
    let {
        name,
        variant = "outlined",
        fill = true,
        weight = 400,
        grade = 0,
        opticalSize = 24,
        size = "1em",
        classes = "",
        ...rest
    } = $props();
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
        {...rest}
    >
        {name}
    </span>
{/if}
