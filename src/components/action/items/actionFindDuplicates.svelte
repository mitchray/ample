<script>
    import { _ } from "svelte-i18n";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    export let item;
</script>

<a href="#/versions/{item?.name}/{item?.artist?.name}">
    <sl-menu-item title={$_("text.findDuplicates")}>
        <MaterialSymbol name="dynamic_feed" slot="prefix" />
        {$_("text.findDuplicates")}
    </sl-menu-item>
</a>
