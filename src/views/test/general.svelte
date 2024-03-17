<h2>Form elements</h2>
<div class="forms">
    <sl-checkbox>Check me</sl-checkbox>

    <sl-switch>Switch!</sl-switch>

    <sl-radio-group name="radioTest">
        <sl-radio>This</sl-radio>
        <sl-radio>That</sl-radio>
    </sl-radio-group>

    <sl-input placeholder="Example" type="text"></sl-input>

    <sl-button>Button</sl-button>

    <sl-select>
        <sl-option value="1">One</sl-option>
        <sl-option value="2">Two</sl-option>
        <sl-option value="3">Three</sl-option>
    </sl-select>

    <sl-select>
        <small>Fruit</small>
        <sl-option value="1">One</sl-option>
        <sl-option value="2">Two</sl-option>
        <sl-option value="3">Three</sl-option>
        <sl-divider></sl-divider>
        <small>Vegetables</small>
        <sl-option value="4">Four</sl-option>
        <sl-option value="5">Five</sl-option>
        <sl-option value="6">Six</sl-option>
    </sl-select>

    <sl-divider></sl-divider>

    <h3>Disabled</h3>

    <sl-checkbox disabled>Check me</sl-checkbox>

    <sl-switch disabled>Switch!</sl-switch>

    <sl-radio-group name="radioTest">
        <sl-radio disabled>This</sl-radio>
        <sl-radio disabled>That</sl-radio>
    </sl-radio-group>

    <sl-input disabled placeholder="Example" type="text"></sl-input>

    <sl-button disabled>Button</sl-button>

    <sl-select disabled>
        <sl-option value="1">One</sl-option>
        <sl-option value="2">Two</sl-option>
        <sl-option value="3">Three</sl-option>
    </sl-select>

    <sl-select disabled>
        <small>Fruit</small>
        <sl-option value="1">One</sl-option>
        <sl-option value="2">Two</sl-option>
        <sl-option value="3">Three</sl-option>
        <sl-divider></sl-divider>
        <small>Vegetables</small>
        <sl-option value="4">Four</sl-option>
        <sl-option value="5">Five</sl-option>
        <sl-option value="6">Six</sl-option>
    </sl-select>
</div>

<style>
    .forms > * {
        margin-inline-end: 1em;
    }
</style>
