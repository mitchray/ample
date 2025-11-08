<script>
    import { _ } from "@rgglez/svelte-i18n";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let { item } = $props();
</script>

<a
    href="#/versions/{encodeURIComponent(item?.name)}/{encodeURIComponent(
        item?.artist?.name,
    )}"
>
    <sl-menu-item title={$_("text.findDuplicates")}>
        <MaterialSymbol name="dynamic_feed" slot="prefix" />
        {$_("text.findDuplicates")}
    </sl-menu-item>
</a>
