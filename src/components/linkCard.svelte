<script>
    import { Link } from 'svelte-routing';

    export let url;
</script>

<div class="link-card card">
    <Link to={url}>
        <slot></slot>
    </Link>
</div>

<style>
    /* Link grids should have this on the containing element */
    :global(.link-grid) {
        display: grid;
        gap: var(--spacing-md);
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }

    .link-card {
        display: flex;
        height: 100%; /* equal height with siblings */
        min-height: 150px;
        width: 150px;
    }

    :global(.link-card a) {
        display: flex;
        height: 100%;
        width: 100%;
        justify-content: center;
        align-items: center;
        font-size: 1.5rem;
        font-weight: 700;
    }
</style>