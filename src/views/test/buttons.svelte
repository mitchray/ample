<script>
    import MaterialSymbol from "~/components/materialSymbol.svelte";
</script>

<h2>Buttons</h2>
<h4>Plain</h4>
<sl-button size="small">Default</sl-button>
<sl-button size="small" variant="neutral">Neutral</sl-button>
<sl-button size="small" variant="primary">Primary</sl-button>
<sl-button size="small" variant="success">Success</sl-button>
<sl-button size="small" variant="warning">Warning</sl-button>
<sl-button size="small" variant="danger">Danger</sl-button>
<sl-button size="small" variant="text">Text</sl-button>
<br />
<sl-button>Default</sl-button>
<sl-button variant="neutral">Neutral</sl-button>
<sl-button variant="primary">Primary</sl-button>
<sl-button variant="success">Success</sl-button>
<sl-button variant="warning">Warning</sl-button>
<sl-button variant="danger">Danger</sl-button>
<sl-button variant="text">Text</sl-button>
<br />
<sl-button size="large">Default</sl-button>
<sl-button size="large" variant="neutral">Neutral</sl-button>
<sl-button size="large" variant="primary">Primary</sl-button>
<sl-button size="large" variant="success">Success</sl-button>
<sl-button size="large" variant="warning">Warning</sl-button>
<sl-button size="large" variant="danger">Danger</sl-button>
<sl-button size="large" variant="text">Text</sl-button>
<br />

<hr />

<h4>With icons</h4>
<sl-button size="small">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Default
</sl-button>
<sl-button size="small" variant="neutral">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Neutral
</sl-button>
<sl-button size="small" variant="primary">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Primary
</sl-button>
<sl-button size="small" variant="success">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Success
</sl-button>
<sl-button size="small" variant="warning">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Warning
</sl-button>
<sl-button size="small" variant="danger">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Danger
</sl-button>
<sl-button size="small" variant="text">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Text
</sl-button>
<br />

<sl-button>
    <MaterialSymbol name="shuffle" slot="prefix" />
    Default
</sl-button>
<sl-button variant="neutral">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Neutral
</sl-button>
<sl-button variant="primary">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Primary
</sl-button>
<sl-button variant="success">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Success
</sl-button>
<sl-button variant="warning">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Warning
</sl-button>
<sl-button variant="danger">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Danger
</sl-button>
<sl-button variant="text">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Text
</sl-button>
<br />
<sl-button size="large">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Default
</sl-button>
<sl-button size="large" variant="neutral">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Neutral
</sl-button>
<sl-button size="large" variant="primary">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Primary
</sl-button>
<sl-button size="large" variant="success">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Success
</sl-button>
<sl-button size="large" variant="warning">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Warning
</sl-button>
<sl-button size="large" variant="danger">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Danger
</sl-button>
<sl-button size="large" variant="text">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Text
</sl-button>

<hr />

<h4>Icons only</h4>
<sl-button circle size="small">
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button circle size="small" variant="neutral">
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button circle size="small" variant="primary">
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button circle size="small" variant="success">
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button circle size="small" variant="warning">
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button circle size="small" variant="danger">
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button circle size="small" variant="text">
    <MaterialSymbol name="shuffle" />
</sl-button>
<br />
<sl-button circle>
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button circle variant="neutral">
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button circle variant="primary">
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button circle variant="success">
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button circle variant="warning">
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button circle variant="danger">
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button circle variant="text">
    <MaterialSymbol name="shuffle" />
</sl-button>
<br />
<sl-button circle size="large">
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button circle size="large" variant="neutral">
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button circle size="large" variant="primary">
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button circle size="large" variant="success">
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button circle size="large" variant="warning">
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button circle size="large" variant="danger">
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button circle size="large" variant="text">
    <MaterialSymbol name="shuffle" />
</sl-button>

<hr />

<h4>Disabled</h4>
<sl-button disabled>Default</sl-button>
<sl-button disabled variant="neutral">Neutral</sl-button>
<sl-button disabled variant="primary">Primary</sl-button>
<sl-button disabled variant="success">Success</sl-button>
<sl-button disabled variant="warning">Warning</sl-button>
<sl-button disabled variant="danger">Danger</sl-button>
<sl-button disabled variant="text">Text</sl-button>
<hr />

<style>
    br {
        display: block;
        margin-block-end: 1rem;
    }
</style>
