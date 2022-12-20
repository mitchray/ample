<script>
    export let id;
    export let activeTabValue; // bind from Tabs
</script>

<div
    class:active-tab={activeTabValue === id}
    class="{$$restProps.class}"
>
    <slot></slot>
</div>