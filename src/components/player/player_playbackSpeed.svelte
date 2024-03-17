<script>
    import { PlaybackSpeed } from "~/stores/state.js";
    import MaterialSymbol from "~/components/materialSymbol.svelte";

    let menu;

    function handleClick() {
        let options = menu.querySelectorAll("sl-menu-item");

        // uncheck all other items
        options.forEach((opt) => {
            opt.checked = false;
        });
    }

    function handleSelection(e) {
        $PlaybackSpeed = e.detail.item.value;
    }
</script>

<sl-menu-item>
    Playback speed
    <MaterialSymbol name="speed" slot="prefix" />

    <sl-menu
        bind:this={menu}
        on:click={handleClick}
        on:sl-select={handleSelection}
        slot="submenu"
    >
        <sl-menu-item type="checkbox" value="0.25">0.25×</sl-menu-item>
        <sl-menu-item type="checkbox" value="0.5">0.5×</sl-menu-item>
        <sl-menu-item type="checkbox" value="0.7">0.7×</sl-menu-item>
        <sl-menu-item type="checkbox" value="0.8">0.8×</sl-menu-item>
        <sl-menu-item type="checkbox" value="0.9">0.9×</sl-menu-item>

        <sl-divider></sl-divider>

        <sl-menu-item checked type="checkbox" value="1.0">1×</sl-menu-item>

        <sl-divider></sl-divider>

        <sl-menu-item type="checkbox" value="1.1">1.1×</sl-menu-item>
        <sl-menu-item type="checkbox" value="1.2">1.2×</sl-menu-item>
        <sl-menu-item type="checkbox" value="1.3">1.3×</sl-menu-item>
        <sl-menu-item type="checkbox" value="1.5">1.5×</sl-menu-item>
        <sl-menu-item type="checkbox" value="1.75">1.75×</sl-menu-item>
        <sl-menu-item type="checkbox" value="1.75">2×</sl-menu-item>
    </sl-menu>
</sl-menu-item>
