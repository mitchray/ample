<script>
    import MaterialSymbol from "~/components/materialSymbol.svelte";
</script>

<h2>Buttons</h2>
<h4>Plain</h4>
<sl-button size="small">Default</sl-button>
<sl-button variant="neutral" size="small">Neutral</sl-button>
<sl-button variant="primary" size="small">Primary</sl-button>
<sl-button variant="success" size="small">Success</sl-button>
<sl-button variant="warning" size="small">Warning</sl-button>
<sl-button variant="danger" size="small">Danger</sl-button>
<sl-button variant="text" size="small">Text</sl-button>
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
<sl-button variant="neutral" size="large">Neutral</sl-button>
<sl-button variant="primary" size="large">Primary</sl-button>
<sl-button variant="success" size="large">Success</sl-button>
<sl-button variant="warning" size="large">Warning</sl-button>
<sl-button variant="danger" size="large">Danger</sl-button>
<sl-button variant="text" size="large">Text</sl-button>
<br />

<hr />

<h4>With icons</h4>
<sl-button size="small">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Default
</sl-button>
<sl-button variant="neutral" size="small">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Neutral
</sl-button>
<sl-button variant="primary" size="small">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Primary
</sl-button>
<sl-button variant="success" size="small">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Success
</sl-button>
<sl-button variant="warning" size="small">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Warning
</sl-button>
<sl-button variant="danger" size="small">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Danger
</sl-button>
<sl-button variant="text" size="small">
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
<sl-button variant="neutral" size="large">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Neutral
</sl-button>
<sl-button variant="primary" size="large">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Primary
</sl-button>
<sl-button variant="success" size="large">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Success
</sl-button>
<sl-button variant="warning" size="large">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Warning
</sl-button>
<sl-button variant="danger" size="large">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Danger
</sl-button>
<sl-button variant="text" size="large">
    <MaterialSymbol name="shuffle" slot="prefix" />
    Text
</sl-button>

<hr />

<h4>Icons only</h4>
<sl-button size="small" circle>
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button variant="neutral" size="small" circle>
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button variant="primary" size="small" circle>
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button variant="success" size="small" circle>
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button variant="warning" size="small" circle>
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button variant="danger" size="small" circle>
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button variant="text" size="small" circle>
    <MaterialSymbol name="shuffle" />
</sl-button>
<br />
<sl-button circle>
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button variant="neutral" circle>
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button variant="primary" circle>
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button variant="success" circle>
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button variant="warning" circle>
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button variant="danger" circle>
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button variant="text" circle>
    <MaterialSymbol name="shuffle" />
</sl-button>
<br />
<sl-button size="large" circle>
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button variant="neutral" size="large" circle>
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button variant="primary" size="large" circle>
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button variant="success" size="large" circle>
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button variant="warning" size="large" circle>
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button variant="danger" size="large" circle>
    <MaterialSymbol name="shuffle" />
</sl-button>
<sl-button variant="text" size="large" circle>
    <MaterialSymbol name="shuffle" />
</sl-button>

<hr />

<h4>Disabled</h4>
<sl-button disabled>Default</sl-button>
<sl-button variant="neutral" disabled>Neutral</sl-button>
<sl-button variant="primary" disabled>Primary</sl-button>
<sl-button variant="success" disabled>Success</sl-button>
<sl-button variant="warning" disabled>Warning</sl-button>
<sl-button variant="danger" disabled>Danger</sl-button>
<sl-button variant="text" disabled>Text</sl-button>
<hr />

<style>
    br {
        display: block;
        margin-block-end: 1rem;
    }
</style>
