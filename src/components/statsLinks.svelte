<script>
    import { _ } from "svelte-i18n";
    import MaterialSymbol from "~/components/materialSymbol.svelte";
</script>

<div class="container">
    <sl-button href="#/favorites" size="large">
        <MaterialSymbol name="favorite" slot="prefix" />
        {$_("text.favorites")}
    </sl-button>

    <sl-button href="#/trending" size="large">
        <MaterialSymbol name="trending_up" slot="prefix" />
        {$_("text.trending")}
    </sl-button>

    <sl-button href="#/top-rated" size="large">
        <MaterialSymbol name="star" slot="prefix" />
        {$_("text.topRated")}
    </sl-button>

    <sl-button href="#/forgotten" size="large">
        <MaterialSymbol name="trending_down" slot="prefix" />
        {$_("text.forgotten")}
    </sl-button>

    <sl-button href="#/random" size="large">
        <MaterialSymbol name="gesture" slot="prefix" />
        {$_("text.random")}
    </sl-button>

    <sl-button href="#/unrated" size="large">
        <MaterialSymbol fill={false} name="star" slot="prefix" />
        {$_("text.unrated")}
    </sl-button>
</div>

<style>
    .container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: var(--spacing-md);
        margin-block-end: var(--spacing-xl);
    }
</style>
