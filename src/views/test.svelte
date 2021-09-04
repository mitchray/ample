<script>
    import Menu from '../components/menu.svelte';

    let isVisible = false;
    let menuAnchor;

    function toggleMenu() {
        isVisible = !isVisible;
    }
</script>

<h1>Test page yo</h1>

<div style="margin: 2rem 0;">
    <label>
        <input type="checkbox" />
        Check me
    </label>

    <label>
        <input type="checkbox" class="switch">
        Switch!
    </label>

    <label>
        <input type="radio" value="1" name="radioTest" />
        This
    </label>

    <label>
        <input type="radio" value="2" name="radioTest" />
        That
    </label>

    <input type="text" placeholder="Example" />

    <button>Button</button>

    <select>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
    </select>

    <select>
        <optgroup label="Fruit">
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
        </optgroup>

        <optgroup label="Vegetables">
            <option value="4">Four</option>
            <option value="5">Five</option>
            <option value="6">Six</option>
        </optgroup>
    </select>
</div>

<div style="margin: 2rem 0;">
    <label>
        <input type="checkbox" disabled />
        Check me
    </label>

    <label>
        <input type="checkbox" class="switch" disabled>
        Switch!
    </label>

    <label>
        <input type="radio" value="1" name="radioTest" disabled />
        This
    </label>

    <label>
        <input type="radio" value="2" name="radioTest" disabled />
        That
    </label>

    <input type="text" placeholder="Example" disabled />

    <button disabled>Button</button>

    <select disabled>
        <option value="1">One</option>
        <option value="2">Two</option>
        <option value="3">Three</option>
    </select>

    <select disabled>
        <optgroup label="Fruit">
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
        </optgroup>

        <optgroup label="Vegetables">
            <option value="4">Four</option>
            <option value="5">Five</option>
            <option value="6">Six</option>
        </optgroup>
    </select>
</div>

<section style="margin: 2rem 0;">
    <button class="danger">Danger</button>
    <button class="warning">Warning</button>
    <button class="primary">Primary</button>
    <button class="secondary">Secondary</button>
</section>

<section class="menus">
    <select bind:value={menuAnchor}>
        <option value="left-top">left-top</option>
        <option value="left-center">left-center</option>
        <option value="left-bottom" selected>left-bottom</option>

        <option value="top-left">top-left</option>
        <option value="top-center">top-center</option>
        <option value="top-right">top-right</option>

        <option value="right-top">right-top</option>
        <option value="right-center">right-center</option>
        <option value="right-bottom">right-bottom</option>

        <option value="bottom-left">bottom-left</option>
        <option value="bottom-center">bottom-center</option>
        <option value="bottom-right">bottom-right</option>
    </select>

    <button id="testToggleMenu" on:click={toggleMenu}>Menu {menuAnchor}</button>

    {#if isVisible}
        <Menu anchor="{menuAnchor}" toggleElement={document.querySelector("#testToggleMenu")} bind:isVisible>
            <ul style="margin: 0;">
                <li>One</li>
                <li>Two is longer so we can test stuff</li>
                <li>Three</li>
            </ul>
        </Menu>
    {/if}
</section>

<section class="actions">

</section>

<style>
    .menus {
        padding: 100px;
    }
</style>