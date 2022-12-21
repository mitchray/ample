<script>
    export let id;
    export let activeTabValue; // bind from Tabs
</script>

<div
    class:active-tab={activeTabValue === id}
    class="tab tab-hidden tab-visuallyHidden {$$restProps.class || ''}"
>
    <slot></slot>
</div>